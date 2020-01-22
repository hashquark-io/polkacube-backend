const Controller = require('egg').Controller;

class TokenController extends Controller {

  async getToken() {
    const { ctx } = this;
    const res = await ctx.service.token.excute();
    ctx.body = res;
  }
  async getValidator() {
    const { ctx } = this;
    const res = await ctx.service.token.validator();
    ctx.body = res;
  }
  async getBestNumberFinalized() {
    const { ctx } = this;
    const res = await ctx.service.token.bestNumberFinalized();
    ctx.body = res;
  }
}

module.exports = TokenController;
