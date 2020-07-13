'use strict';

const Service = require('egg').Service;

const MAX_NODE_NUM = 130;
const MAX_ERA_NUM = 3600;
const MAX_DECIMAL_NUM = 1000000;
// 10^12
const DOT_UNIT = 1000000000000;

class NodeService extends Service {

  _roundNum(num) {
    return Math.round(num * MAX_DECIMAL_NUM) / MAX_DECIMAL_NUM;
  }

  async calculate(num) {
    const overview = await this.app.api.derive.session.info();
    const max = overview.validatorCount || MAX_NODE_NUM;
    // 1. Find the last era bonded amount of validators
    num = this._roundNum(num);
    const validators = await this.app.mysql.query('select validatorAddr as addr, round(totalBonded/pow(10, 12),6) as value from ksm_validator where currentSession = (select currentSession from ksm_validator order by id desc limit 1)');
    const validatorCount = validators.length;
    if (validatorCount < 1) {
      return {};
    }

    // 2. Find required least bonded amount
    const myValidators = {};
    const compare = (a, b) => { return a.value - b.value; };
    validators.sort(compare);
    if (max === 1) {
      if (num > validators[0].value) {
        myValidators.value = num;
      }
    } else {
      let p = 0;
      let avg = 0;
      while (p < max && p < validatorCount) {
        if (num > validators[p].value * (p + 1)) {
          avg = validators[p].value;
          p++;
        } else {
          break;
        }
      }

      // 3. Calculate total number of validators and average bonded amount based on current era data
      if (validatorCount < max && p === validatorCount) {
        p = Math.min(Math.round(num / avg), max);
      }

      if (p > 0) {
        avg = this._roundNum(avg + (num - avg * p) / p);
        myValidators.averageBonded = avg;
        myValidators.totalNumber = p;
      }
    }

    console.log(myValidators.averageBonded * myValidators.totalNumber);
    // 4. Aggregate revenues
    myValidators.currentEraLength = overview.eraLength || MAX_ERA_NUM;
    const eraRevenue = await this.app.mysql.query('select amount from ksm_rewards_era order by id desc limit 1');
    if (eraRevenue.length > 0 && myValidators.totalNumber > 0) {
      // convert to daily blocks
      const dailyEraAmount = 14400 / myValidators.currentEraLength;
      // calculate each validator reward for one era
      myValidators.currentValidatorCount = validatorCount;
      const eraValidatorRevenue = this._roundNum(eraRevenue[0].amount / validatorCount);
      myValidators.eraRevenue = Math.round(eraValidatorRevenue * myValidators.totalNumber);
      myValidators.dailyRevenue = Math.round(myValidators.eraRevenue * dailyEraAmount);
      myValidators.annualRate = Math.round(myValidators.dailyRevenue / DOT_UNIT / num * 365 * 10000) / 100 + '%';
    }
    return myValidators;
  }

}

module.exports = NodeService;
