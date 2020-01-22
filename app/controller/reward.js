const Controller = require('egg').Controller;

class RewardController extends Controller {

  async rewardPageQuery() {
    const { ctx } = this;
    const res = await ctx.service.reward.find(ctx.query.page, ctx.query.size);
    ctx.body = res;
  }

}

module.exports = RewardController;
