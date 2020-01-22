'use strict';

const Service = require('egg').Service;
const BN = require('bn.js');

class ValidatorsService extends Service {

  _totalNominatorsBonded(nominators) {
    return (nominators.reduce((sum, cur) => new BN(sum).add(new BN(cur.value)), 0)).toString();
  }
  async findAll() {
    // find the last era of validators 
    const validators = await this.app.mysql.query('select * from ksm_validator where currentSession = (select currentSession from ksm_validator order by id desc limit 1)');
    // find the last block
    const blocks = await this.app.mysql.query('select * from ksm_author order by id desc');
    const validatorsMap = new Map(validators.map((validator) => {
      if (validator.nominators) {
        validator.nominators = JSON.parse(validator.nominators);
        validator.nominatorsBonded = this._totalNominatorsBonded(validator.nominators);
      }
      return [validator.validatorAddr, validator];
    }));
    blocks.forEach((block) => {
      const validator = validatorsMap.get(block.authorAddr);
      if (validator) {
        validator.height = block.lastBlockHeight;
      }
    });
    return [...validatorsMap.values()];
  }

  async findByAccountId(accountId) {
    // find the last status of validator
    const validators = await this.app.mysql.query('select * from ksm_validator where validatorAddr = ? order by id desc limit 1', accountId);
    if (validators.length > 0) {
      const validator = validators[0];
      if (validator.nominators) {
        let nominators = JSON.parse(validator.nominators);
        validator.nominatorsBonded = this._totalNominatorsBonded(nominators);
        nominators.forEach(singel => singel.percent = new BN(singel.value).muln(10000).div(new BN(validator.nominatorsBonded)).toNumber() / 100);
        validator.nominators = nominators;

      }
      // find the last block height
      const blockHeight = await this.app.mysql.query('select lastBlockHeight from ksm_author where authorAddr = ? order by id desc limit 1', accountId);
      if (blockHeight.length > 0) {
        validator.height = blockHeight[0].lastBlockHeight;
      }
      return validator;
    }
  }

}
module.exports = ValidatorsService;
