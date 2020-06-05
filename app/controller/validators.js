'use strict';

const Controller = require('egg').Controller;

class ValidatorsController extends Controller {

  _formatBalance(balance) {
    return this.ctx.helper.formatBalance(balance);
  }

  _formatValidator(validator) {
    validator.totalBondedKsm = this._formatBalance(validator.totalBonded);
    validator.selfBondedKsm = this._formatBalance(validator.selfBonded);
    validator.commission = (parseFloat(validator.commission) * 100).toFixed(2) + '%';
    validator.nominatorsBondedKsm = this._formatBalance(validator.nominatorsBonded);
    validator.nominators.sort((a, b) => b.value - a.value).forEach(nominator => this._formatNominator(nominator));
  }

  _formatNominator(nominator) {
    nominator.valueKsm = this._formatBalance(nominator.value);
  }

  async index() {
    const validators = await this.ctx.service.validators.findAll();
    validators.sort((a, b) => b.totalBonded - a.totalBonded).forEach(validator => this._formatValidator(validator));
    const partner = await this.ctx.service.partner.findAll();
    this._addPartner(partner, validators);
    this.ctx.body = validators;
  }

  _addPartner(partner, validators) {
    if (partner.length === 0) {
      return;
    }
    validators.forEach(validator => {
      validator.partner = partner.find(p => p.stash === validator.validatorAddr);
    });
  }

  async info() {
    this.logger.debug(`params: ${this.ctx.params.accountId}`);
    const accountId = this.ctx.params.accountId;
    const validator = await this.ctx.service.validators.findByAccountId(accountId);
    if (validator) {
      this._formatValidator(validator);
      const partner = await this.ctx.service.partner.findAll();
      this._addPartner(partner, [ validator ]);
      this.ctx.body = validator;
    }
  }
  async stashes() {
    const stashes = await this.ctx.service.validators.stashes();
    if (stashes) {
      const partner = await this.ctx.service.partner.findAll();
      this._addPartner(partner, stashes);
      this.ctx.body = stashes;
    }
  }
}

module.exports = ValidatorsController;
