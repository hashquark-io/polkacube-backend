'use strict';
const Controller = require('egg').Controller;

class StatisticsController extends Controller {


  async getValidatorSlashReward() {
    const { ctx } = this;
    const res = await ctx.service.statistics.getValidatorSlashReward(ctx.query.accountAddr);
    ctx.body = res;
  }

}

module.exports = StatisticsController;
