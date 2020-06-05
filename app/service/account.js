
'use strict';

const Service = require('egg').Service;
const BN = require('bn.js');
const ZERO = new BN(0);
class AccountService extends Service {
  async stashes(allAccounts) {
    // get own stashes
    const [ progress, allStashes, ownBonded, ownLedger ] = await Promise.all([
      this.app.api.derive.session.progress(),
      this.app.api.derive.staking.stashes(),
      this.app.api.query.staking.bonded.multi(allAccounts),
      this.app.api.query.staking.ledger.multi(allAccounts),
    ]);
    const ownStashes = [];
    ownBonded.forEach((value, index) => {
      value.isSome && ownStashes.push([ allAccounts[index], true ]);
    });
    ownLedger.forEach(ledger => {
      if (ledger.isSome) {
        const stashId = ledger.unwrap().stash.toString();
        !ownStashes.some(([ accountId ]) => accountId === stashId) && ownStashes.push([ stashId, false ]);
      }
    });
    if (ownStashes.length === 0) {
      return [];
    }
    const arrs = [];
    allStashes.forEach(value => {
      arrs.push(value.toString());
    });

    // get account
    const stashes = [];
    for (const obj of ownStashes) {
      const stash = await this._buildStash(obj, progress);
      stash.stashValidating = !(Array.isArray(stash.validateInfo) ? stash.validateInfo[1].isEmpty : stash.validateInfo.isEmpty) || !!arrs.includes(stash.stashId);
      // console.log('=====:' + stash.stashId + '===:' + !!allStashes.includes(stash.stashId.toString()) + '====:' + allStashes);
      stash.ownController = allAccounts.includes(stash.stakingAccount.controllerId.toString() || '');
      this._stakingBond(stash, progress);
      stashes.push(stash);
    }
    return stashes;
  }

  async _buildStash(obj) {
    const stash = {};
    stash.stashId = obj[0];
    stash.ownStash = obj[1];
    const [ stakingAccount, validateInfo ] = await Promise.all([ this.app.api.derive.staking.account(stash.stashId),
      this.app.api.query.staking.validators(stash.stashId) ]);
    stash.stakingAccount = stakingAccount;
    stash.validateInfo = validateInfo;
    stash.stashNominating = !!(stakingAccount.nominators.length);
    stash.sessionKeys = stakingAccount.sessionIds.map(id => id.toU8a());
    stash.nextSessionKeys = stakingAccount.nextSessionIds.map(id => id.toU8a());
    const inactiveNoms = [];
    if (stakingAccount.nominators.length > 0) {
      const indexes = await this.app.api.derive.session.indexes();
      stakingAccount.exposures = [];
      for (const nominator of stakingAccount.nominators) {
        const exposure = await this.app.api.query.staking.erasStakers(indexes.activeEra, nominator);
        stakingAccount.exposures.push(exposure);
      }
      stakingAccount.exposures.forEach((exposure, index) => {
        if (exposure.others && !exposure.others.some(({ who }) => who.eq(stash.stashId))) {
          inactiveNoms.push(stakingAccount.nominators[index]);
        }
      });
    }
    stash.inactiveNoms = inactiveNoms;
    stash.activeNoms = stakingAccount.nominators.filter(id => !inactiveNoms.includes(id));
    return stash;
  }

  _stakingBond(stash, progress) {
    // bonding
    stash.bondedBalance = (stash.stakingAccount.stakingLedger && stash.stakingAccount.stakingLedger.active && stash.stakingAccount.stakingLedger.active.unwrap()) || 0;
    // unlocking
    if (stash.stakingAccount.unlocking) {
      stash.unbondingBalance = (stash.stakingAccount.unlocking && stash.stakingAccount.unlocking.reduce((total, { value }) => total.add(value), new BN(0))) || 0;
      stash.unbondingDetail = stash.stakingAccount.unlocking;
      progress && stash.unbondingDetail && stash.unbondingDetail.forEach(unlocking => {
        const remaingBlocks = unlocking.remainingEras
          .subn(1)
          .mul(progress.eraLength)
          .add(progress.eraLength.sub(progress.eraProgress));
        unlocking.remaingBlocks = remaingBlocks.toNumber();
      });
    }
    // redeemable
    stash.redeemable = stash.stakingAccount.redeemable || new BN(0);
  }

  async rewards(stashIds) {
    const rtn = {};
    const allRewards = await this.ctx.service.stakerRewards.filterRewards(stashIds.pop());
    const stashes = Object
      .entries([ allRewards ])
      .map(([ stashId, rewards ]) => ({
        available: rewards.reduce((result, { validators }) =>
          Object.values(validators).reduce((result, { value }) =>
            result.iadd(value), result), new BN(0)
        ),
        rewards,
        stashId,
      }))
      .filter(({ available }) => !available.isZero())
      .sort((a, b) => b.available.cmp(a.available));
    const stashTotal = stashes.length
      ? stashes.reduce((total, { available }) => total.add(available), new BN(0))
      : 0;
    const stakerPayoutAfter = await this.app.api.query.staking.migrateEra();
    const validators = this._groupByValidator([ allRewards ], stakerPayoutAfter);
    rtn.rewards = [ allRewards ];
    rtn.stashes = stashes;
    rtn.stashTotal = stashTotal;
    const validatorsTotal = validators.length
      ? stashes.reduce((total, { available }) => total.add(available), new BN(0))
      : 0;
    rtn.validators = validators;
    rtn.validatorsTotal = validatorsTotal;
    rtn.stakerPayoutAfter = stakerPayoutAfter.unwrapOr(ZERO);
    return rtn;
  }

  _groupByValidator(allRewards, stakerPayoutAfter) {
    return Object
      .entries(allRewards)
      .reduce((grouped, [ stashId, rewards ]) => {
        rewards
          .filter(({ era }) => era >= stakerPayoutAfter)
          .forEach(reward => {
            Object
              .entries(reward.validators)
              .forEach(([ validatorId, { value }]) => {
                const entry = grouped.find(entry => entry.validatorId === validatorId);

                if (entry) {
                  const eraEntry = entry.eras.find(entry => entry.era === reward.era);

                  if (eraEntry) {
                    eraEntry.stashes[stashId] = value;
                  } else {
                    entry.eras.push({
                      era: reward.era,
                      stashes: { [stashId]: value },
                    });
                  }

                  entry.available = entry.available.add(value);
                } else {
                  grouped.push({
                    available: value,
                    eras: [{
                      era: reward.era,
                      stashes: { [stashId]: value },
                    }],
                    validatorId,
                  });
                }
              });
          });

        return grouped;
      }, [])
      .sort((a, b) => b.available.cmp(a.available));
  }

  async balances(accountId) {
    const [ result, stakingInfo, progress ] = await Promise.all([ this.app.api.derive.balances.all(accountId), this.app.api.derive.staking.account(accountId), this.app.api.derive.session.progress() ]);
    const balances = {};
    balances.accountId = accountId;
    balances.votingBalance = result.votingBalance;
    balances.freeBalance = result.freeBalance;
    balances.availableBalance = result.availableBalance;
    balances.lockedBalance = result.lockedBalance;
    balances.reservedBalance = result.reservedBalance;
    balances.bondedBalance = (stakingInfo.stakingLedger && stakingInfo.stakingLedger.active && stakingInfo.stakingLedger.active.unwrap()) || 0;
    balances.unbondingBalance = (stakingInfo.unlocking && stakingInfo.unlocking.reduce((total, { value }) => total.add(value), new BN(0))) || 0;
    balances.unbondingDetail = stakingInfo.unlocking;
    balances.unbondingDetail && balances.unbondingDetail.forEach(unlocking => {
      const remaingBlocks = unlocking.remainingEras
        .subn(1)
        .mul(progress.eraLength)
        .add(progress.eraLength.sub(progress.eraProgress));
      unlocking.remaingBlocks = remaingBlocks.toNumber();
    });
    balances.redeemable = stakingInfo.redeemable || new BN(0);
    return balances;
  }

}
module.exports = AccountService;
