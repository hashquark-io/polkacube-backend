'use strict';
const Service = require('egg').Service;
const { formatBalance } = require('@polkadot/util');


formatBalance.setDefaults({
  decimals: 12,
  unit: 'KSM',
});

class TokenService extends Service {

  async excute() {
    const token = await this.app.mysql.select('ksm_token', {
      orders: [
        [ 'id', 'desc' ],
      ],
      limit: 1,
    });
    if (token && token.length > 0) {
      const polkaModel = {
        totalIssuance: formatBalance(token[0].totalIssuance),
        totalBond: formatBalance(token[0].totalBond),
        stakingRatio: token[0].stakingRatio,
        inflation: token[0].inflation,
        valDayRewards: formatBalance(token[0].valDayRewards),
      };
      return polkaModel;
    }
    return token;
  }

  async validator() {
    const apiPolka = this.app.api;
    const [ info, overview ] = await Promise.all([
      apiPolka.derive.session.info(),
      apiPolka.derive.staking.overview(),
    ]);
    this.app.logger.info(JSON.stringify(info));
    const polkaModel = {
      maxValidator: overview.validatorCount,
      actualValidator: overview.validators.length,
      eraProgress: info.eraProgress,
      eraLength: info.eraLength,
      sessionLength: info.sessionLength,
      sessionProgress: info.sessionProgress,
    };
    return polkaModel;
  }
  async bestNumberFinalized() {
    const apiPolka = this.app.api;
    const [ finalized ] = await Promise.all([
      apiPolka.derive.chain.bestNumberFinalized(),
    ]);
    const headerChange = this.app.io.headerChange || {};
    const header = {
      height: headerChange.height,
      validatorAddr: headerChange.validatorAddr,
      finalized,
    };
    this.app.logger.info(JSON.stringify(finalized));
    this.app.logger.info(JSON.stringify(header));
    return header;
  }

}
module.exports = TokenService;
