'use strict';

const Service = require('egg').Service;
const BN = require('bn.js');
const { hexToBn, isHex } = require('@polkadot/util');
const { of } = require('rxjs');
// const { map } = require('rxjs/operators');
const ZERO = new BN(0);
const COMM_DIV = new BN(1000000000);
const MAX_ERAS = new BN(1000000000);
const MIN_ONE = new BN(-1);
class StakerRewardsService extends Service {
  async filterRewards(accountId) {
    const { stakingLedger, stashId } = await this.app.api.derive.staking.query(accountId);
    // console.log('------------stakingLedger:' + JSON.stringify(stakingLedger));
    const parseRewards = await this._parseRewards(stashId.toString());
    // console.log('------------parseRewards:' + JSON.stringify(parseRewards));
    const validators = this._uniqValidators(parseRewards);
    const payoutStakers = await this.app.api.tx.staking.payoutStakers;
    // console.log('------------validators:' + JSON.stringify(validators));
    const optMigrate = (await this.app.api.query.staking.migrateEra)
      ? await this.app.api.query.staking.migrateEra()
      : of({ unwrapOr: () => (payoutStakers ? ZERO : MAX_ERAS) });
    const queryValidators = payoutStakers ? await this.app.api.derive.staking.queryMulti(validators) : of([]);
    // console.log('------------queryValidators:' + JSON.stringify(queryValidators));
    const migrateEra = optMigrate.unwrapOr(ZERO);
    return parseRewards
      .filter(({ isEmpty }) => !isEmpty)
      .filter(reward => {
        if (reward.era < migrateEra) {
          return this._filterEra(reward.era, stakingLedger);
        }
        reward.isStakerPayout = true;
        const rm = [];
        Object.keys(reward.validators).forEach(validatorId => {
          const index = validators.indexOf(validatorId);
          if (index !== -1) {
            const valLedger = queryValidators[index].stakingLedger;
            // console.log(reward.era + '------------valLedger:' + JSON.stringify(valLedger));
            if (valLedger === null || valLedger === void 0 ? void 0 : valLedger.claimedRewards.some(era => String(reward.era) === String(era))) {
              rm.push(validatorId);
            }
          }
        });

        rm.forEach(validatorId => {
          delete reward.validators[validatorId];
        });
        // console.log('------------reward:' + JSON.stringify(reward));
        return true;
      })
      .filter(({ validators }) => Object.keys(validators).length !== 0)
      .map(reward => ({
        ...reward,
        nominators: reward.nominating.filter(({ validatorId }) => !!reward.validators[validatorId]),
      }));
  }

  _filterEra(era, stakingLedger) {
    return this._isOldLedger(stakingLedger)
      ? era > stakingLedger.lastReward.unwrapOr(MIN_ONE)
      : !stakingLedger.claimedRewards.some(e => String(e) === String(era));
  }

  _isOldLedger(ledger) {
    return !!ledger.lastReward;
  }

  async _parseRewards(stakerId) {
    const stakerRewards =
      'select currentEra,exposureNominating,exposureValidators,eraPoints,allValPoints,erasPrefs,eraReward from ksm_staker_reward_era ORDER BY currentera desc LIMIT 84';
    const stakerRewardsList = await this.app.mysql.query(stakerRewards);
    const list = [];
    for (const model of stakerRewardsList) {
      const eraPoints = model.eraPoints;
      const era = model.currentEra;
      const eraReward = model.eraReward;
      const exposureNominating = JSON.parse(model.exposureNominating);
      const exposureValidators = JSON.parse(model.exposureValidators);
      const allValPoints = JSON.parse(model.allValPoints);
      const erasPrefs = JSON.parse(model.erasPrefs);
      const isValidator = !!exposureValidators[stakerId];
      const eraValidators = {};
      const nominating = exposureNominating[stakerId] || [];
      if (isValidator) {
        eraValidators[stakerId] = exposureValidators[stakerId];
      } else if (nominating) {
        nominating.forEach(({ validatorId }) => {
          eraValidators[validatorId] = exposureValidators[validatorId];
        });
      }
      const isEmpty = !Object.keys(eraValidators).length;
      const validators = {};
      Object.entries(eraValidators).forEach(([ validatorId, exposure ]) => {
        const valPoints = allValPoints[validatorId] || ZERO;
        const commission = erasPrefs[validatorId].commission;
        const valComm = new BN(commission) || ZERO;
        const avail = new BN(eraReward).mul(new BN(valPoints)).divn(eraPoints);
        const valCut = new BN(valComm).mul(avail).div(COMM_DIV);
        const expTotal = isHex(exposure.total) ? hexToBn(exposure.total) : new BN(exposure.total);
        let value;
        let staked;
        if (!expTotal.isZero() && !new BN(valPoints).isZero()) {
          if (validatorId === stakerId) {
            staked = isHex(exposure.own) ? hexToBn(exposure.own) : new BN(exposure.own);
          } else {
            const stakerExp = exposure.others.find(({ who }) => String(who) === stakerId);
            staked = stakerExp ? isHex(stakerExp.value) ? hexToBn(stakerExp.value) : new BN(stakerExp.value) : ZERO;
          }
          // 计算该era某个验证人下应分配的奖励金额
          value = avail
            .sub(valCut)
            .mul(staked)
            .div(expTotal)
            .add(validatorId === stakerId ? valCut : ZERO);
        }
        validators[validatorId] = {
          total: this.app.api.registry.createType('Balance', avail),
          value: this.app.api.registry.createType('Balance', value),
        };
      });
      list.push({
        era,
        eraReward,
        isEmpty,
        isValidator,
        nominating,
        validators,
      });
    }

    return list;
  }

  _uniqValidators(rewards) {
    const uniq = [];
    rewards.forEach(({ validators }) => {
      Object.keys(validators).forEach(validatorId => {
        if (!uniq.includes(validatorId)) {
          uniq.push(validatorId);
        }
      });
    });

    return uniq;
  }
}
module.exports = StakerRewardsService;
