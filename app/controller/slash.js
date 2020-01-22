'use strict';

const Controller = require('egg').Controller;

class SlashController extends Controller {
  /*

  */
  async slashPageQuery() {
    const { ctx } = this;
    const res = await ctx.service.slash.find(ctx.query.page, ctx.query.size, ctx.query.accountAddr);
    ctx.body = res;
  }
  async slashCountPageQuery() {
    const { ctx } = this;
    const res = await ctx.service.slash.slashCountPageQuery(ctx.query.page, ctx.query.size,ctx.query.accountAddr);
    ctx.body = res;
  }
}

module.exports = SlashController;
