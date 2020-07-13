'use strict';

const Service = require('egg').Service;

const MAX_VOTED_VALIDATORS = 16;
const MAX_ERA_NUM = 3600;
const MAX_DECIMAL_NUM = 1000000;
// 10^12
const DOT_UNIT = 1000000000000;

class NominationService extends Service {

  _averageNum(num, i) {
    return Math.round(num * MAX_DECIMAL_NUM / i) / MAX_DECIMAL_NUM;
  }

  _roundNum(num) {
    return Math.round(num * MAX_DECIMAL_NUM) / MAX_DECIMAL_NUM;
  }

  async calculate(num) {
    // 1. Find the last era of validators with commissions
    num = this._roundNum(num);
    const validators = await this.app.mysql.query('select validatorName, validatorAddr as validatorAddress, totalBonded, selfBonded, (totalBonded - selfBonded) as nominationBonded, round(totalBonded/(100-commission*100)*100/pow(10, 12),6) as value, 0 as myBonded, commission from ksm_validator where commission !=1 and currentSession = (select currentSession from ksm_validator order by id desc limit 1)');
    if (validators.length < 1) {
      return {};
    }
    const max = MAX_VOTED_VALIDATORS;
    const compare = (a, b) => { return a.value - b.value; };
    while (num > 0) {
      // 2. Prepare calculation of nomination
      validators.sort(compare);
      if (max === 1 || validators.length === 1) {
        validators[0].value = validators[0].value + num;
        validators[0].myBonded = validators[0].myBonded + num;
        break;
      }
      // 3. Calculate the bonded amount difference among validators
      let sub = validators[1].value - validators[0].value;
      let i = 1;
      while (sub === 0 && i < validators.length - 1 && i < max - 1) {
        sub = validators[i + 1].value - validators[i].value;
        i++;
      }

      // 4. Nominate votes to validators
      let votes = 0;
      if (sub === 0) {
        i++;
        votes = this._averageNum(num, i);
      } else {
        votes = Math.min(sub, this._averageNum(num, i));
      }

      if (votes > 0) {
        for (let j = 0; j < i; j++) {
          validators[j].value = this._roundNum(validators[j].value + votes);
          validators[j].myBonded = this._roundNum(validators[j].myBonded + votes);
        }
      }

      // 5. Finish all nomination
      num = this._roundNum(num - votes * i);
      if ((sub === 0 || votes === 0) && num > 0) {
        validators[0].value = this._roundNum(validators[0].value + num);
        break;
      }

    }

    // 4. Aggregate revenues
    const validatorsResult = validators.filter(validator => validator.myBonded !== 0);
    let total = 0;
    validatorsResult.forEach(validator => {
      const identity = JSON.parse(validator.validatorName);
      const model = {};
      const identityKes = Object.keys(identity);
      identityKes.forEach(item => {
        if (identity[item] && identity[item].length > 0) {
          model[item] = identity[item];
        }
      });
      validator.validatorName = model;
      total = Math.round((total * MAX_DECIMAL_NUM + validator.myBonded * MAX_DECIMAL_NUM)) / MAX_DECIMAL_NUM;
    });
    const myNomination = {};
    const overview = await this.app.api.derive.session.info();
    myNomination.validatorList = validatorsResult;
    myNomination.currentEraLength = overview.eraLength || MAX_ERA_NUM;
    const validatorCount = await this.app.mysql.query('select count(1) as count from ksm_validator where currentSession = (select currentSession from ksm_validator order by id desc limit 1)');
    const eraRevenue = await this.app.mysql.query('select amount from ksm_rewards_era order by id desc limit 1');
    if (total > 0 && validatorCount.length > 0 && eraRevenue.length > 0 && myNomination.validatorList.length > 0) {
      // calculate each validator reward for one era
      const eraValidatorRevenue = this._roundNum(eraRevenue[0].amount / DOT_UNIT / validatorCount[0].count);
      // convert to daily blocks
      const dailyEraAmount = 14400 / myNomination.currentEraLength;
      myNomination.dailyRevenue = 0;
      myNomination.validatorList.forEach(validator => {
        validator.totalBonded = Math.round((validator.totalBonded / DOT_UNIT + validator.myBonded) * DOT_UNIT);
        validator.nominationBonded = Math.round((validator.nominationBonded / DOT_UNIT + validator.myBonded) * DOT_UNIT);
        validator.eraRevenue = Math.round(eraValidatorRevenue * (1 - validator.commission) * validator.myBonded / (validator.totalBonded / DOT_UNIT) * DOT_UNIT);
        validator.dailyRevenue = Math.round(validator.eraRevenue * dailyEraAmount);
        myNomination.dailyRevenue = Math.round(myNomination.dailyRevenue + validator.dailyRevenue);
      });
      myNomination.total = total;
      myNomination.annualRate = Math.round(myNomination.dailyRevenue / DOT_UNIT / total * 365 * 10000) / 100 + '%';
    }
    return myNomination;
  }
}

module.exports = NominationService;
