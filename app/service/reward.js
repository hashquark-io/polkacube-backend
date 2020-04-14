'use strict';
const Service = require('egg').Service;

const { formatBalance } = require('../util.js');

class RewardService extends Service {

  async find(page, size) {
    size = size || 100;
    page = page || 1;
    size = size > 200 ? 200 : size;
    const offset = (page * size) - size;
    let reward = [];
    if (isNaN(offset)) {
      return reward;
    }
    reward = await this.app.mysql.select('ksm_rewards_era', {
      orders: [
        [ 'currentEra', 'desc' ],
      ],
      limit: +size,
      offset,
    });
    reward = reward.map(obj => {
      obj.amount = formatBalance(obj.amount);
      return obj;
    });
    return reward;
  }
}
module.exports = RewardService;
