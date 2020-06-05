'use strict';
const Service = require('egg').Service;
const BN = require('bn.js');
const { formatBalance } = require('@polkadot/util');


// const divisor = new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'));
class StatisticsService extends Service {

  _formatBalance() {
    const unit = this.app.config.ksm.unit;
    formatBalance.setDefaults({ decimals: 12, unit });
  }

  async getValidatorSlashReward(accountAddr) {
    this._formatBalance();
    const sqlSlash = 'SELECT currentEra,amount FROM ksm_slash_era where accountAddr=? and slashType= 1 ORDER BY currentEra desc LIMIT 100';
    const slashList = await this.app.mysql.query(sqlSlash, [ accountAddr ]);
    const sqlStatistics = `select * from (select a.point,a.totalPoint,a.currentEra,b.amount 
      from  ksm_rewards_era b LEFT JOIN ksm_point_era a on a.currentEra=b.currentEra 
      where a.accountAddr= ? ORDER BY currentEra DESC  LIMIT 100) c  ORDER BY c.currentEra `;
    const statisticsList = await this.app.mysql.query(sqlStatistics, [ accountAddr ]);
    // console.info('----slashList:' + JSON.stringify(slashList));
    // console.info('----statisticsList:' + JSON.stringify(statisticsList));
    const divisor = new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'));
    const statistics = [];
    const slashMap = new Map(slashList.map(slash => {
      return [ slash.currentEra, slash.amount ];
    }));
    let rewardCount = 0;
    let total = new BN(0);
    if (statisticsList && statisticsList.length > 0) {
      statisticsList.forEach(({ point, totalPoint, currentEra, amount }) => {
        const model = {
          currentEra,
          reward: 0,
          slash: 0,
          avg: 0,
        };
        model.reward = new BN(amount).muln(1000).muln(point)
          .divn(totalPoint)
          .div(divisor)
          .toNumber() / 1000;
        const slash = slashMap.get(currentEra);
        if (slash) {
          model.slash = new BN(slash).muln(1000)
            .div(divisor)
            .toNumber() / 1000;
        }
        rewardCount++;
        total = total.addn(model.reward * 1000);
        if (!total.eqn(0)) {
          model.avg = total.divn(rewardCount).toNumber() / 1000;
        }
        // console.info('----model:' + JSON.stringify(model) + '----total:' + total);
        statistics.push(model);
      });
    }
    return statistics;
  }
}
module.exports = StatisticsService;
