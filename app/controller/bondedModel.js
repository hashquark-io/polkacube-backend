'use strict';

const Controller = require('egg').Controller;

const DISPLAY_DECIMAL_NUM = 1000;

class BondedModelController extends Controller {

  _formatBalance(balance) {
    return this.ctx.helper.formatBalance(balance);
  }

  async buildNodes() {
    this.logger.debug(`params: ${this.ctx.params.num}`);
    const num = this.ctx.params.num;
    this._validateNum(num);
    const myValidators = await this.ctx.service.node.calculate(num);
    if (myValidators && myValidators.dailyRevenue) {
      myValidators.dailyRevenue = this._formatBalance(myValidators.dailyRevenue.toString());
      myValidators.eraRevenue = this._formatBalance(myValidators.eraRevenue.toString());
    }
    this.ctx.body = myValidators;
  }

  async forecastReward() {
    this.logger.debug(`params: ${this.ctx.params.num}`);
    const num = this.ctx.params.num;
    this._validateNum(num);
    const myNomination = await this.ctx.service.nomination.calculate(num);
    const compare = (a, b) => { return b.dailyRevenue - a.dailyRevenue; };
    if (myNomination && myNomination.dailyRevenue) {
      myNomination.validatorList.sort(compare);
      myNomination.dailyRevenue = this._formatBalance(myNomination.dailyRevenue.toString());
      myNomination.validatorList.forEach(validator => {
        validator.totalBonded = this._formatBalance(validator.totalBonded.toString());
        validator.nominationBonded = this._formatBalance(validator.nominationBonded.toString());
        validator.selfBonded = this._formatBalance(validator.selfBonded.toString());
        validator.commission = (parseFloat(validator.commission) * 100).toFixed(2) + '%';
        validator.eraRevenue = this._formatBalance(validator.eraRevenue.toString());
        validator.dailyRevenue = this._formatBalance(validator.dailyRevenue.toString());
      });
    }
    this.ctx.body = myNomination;
  }

  _displayNum(num) {
    return Math.round(num * DISPLAY_DECIMAL_NUM) / DISPLAY_DECIMAL_NUM;
  }

  _validateNum(num) {
    if (Number.isNaN(num) || num <= 0 || num > 10000000) {
      throw new Error('Invalid number');
    }
  }

}

module.exports = BondedModelController;
