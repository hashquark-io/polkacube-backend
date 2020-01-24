'use strict';

const Controller = require('egg').Controller;
const { formatBalance } = require('@polkadot/util');

formatBalance.setDefaults({ decimals: 12, unit: 'KSM' });

class ValidatorsController extends Controller {

  _formatValidator(validator) {
    validator.totalBondedKsm = formatBalance(validator.totalBonded);
    validator.selfBondedKsm = formatBalance(validator.selfBonded);
    validator.commission = (parseFloat(validator.commission) * 100).toFixed(2) + '%';
    validator.nominatorsBondedKsm = formatBalance(validator.nominatorsBonded);
    validator.nominators.sort((a, b) => b.value - a.value).forEach(nominator => this._formatNominator(nominator));
  }

  _formatNominator(nominator) {
    nominator.valueKsm = formatBalance(nominator.value);
  }

  async index() {
    const validators = await this.ctx.service.validators.findAll();
    validators.sort((a, b) => b.totalBonded - a.totalBonded).forEach(validator => this._formatValidator(validator));
    this.ctx.body = validators;
  }

  async info() {
    this.logger.debug(`params: ${this.ctx.params.accountId}`);
    const accountId = this.ctx.params.accountId;
    const validator = await this.ctx.service.validators.findByAccountId(accountId);
    if (validator) {
      this._formatValidator(validator);
      this.ctx.body = validator;
    }
  }

}

module.exports = ValidatorsController;
