'use strict';

const Controller = require('egg').Controller;
// 10^12
const DOT_UNIT = 1000000000000;

class DemocracyController extends Controller {

  _formatBalance(balance) {
    return this.ctx.helper.formatBalance(balance);
  }

  _formatNumber(num) {
    return this.ctx.helper.formatNumber(num);
  }

  async overview() {
    const { ctx } = this;
    const [ proposals, referendums, progress ] = await Promise.all([ ctx.service.democracy.overviewOfProposals(),
      ctx.service.democracy.overviewOfReferendums(),
      ctx.service.democracy.overviewOfProgress(),
    ]);
    proposals.proposalsFormat = this._formatNumber(proposals.proposals);
    proposals.totalProposalsFormat = this._formatNumber(proposals.totalProposals);

    referendums.referendumCountFormat = this._formatNumber(referendums.referendumCount);
    referendums.totalReferendumCountFormat = this._formatNumber(referendums.totalReferendumCount);

    progress.progressFormat = this._formatNumber(progress.progress);
    progress.launchPeriodFormat = this._formatNumber(progress.launchPeriod);

    const res = {};
    Object.assign(res, proposals, referendums, progress);
    ctx.body = res;
  }

  async referendums() {
    const { ctx } = this;
    const result = await ctx.service.referendums.list();
    const res = result.map(referendum => {
      referendum.enactBlockFormat = this._formatNumber(referendum.enactBlock);
      referendum.remainingBlocksFormat = this._formatNumber(referendum.remainingBlocks);
      referendum.votedBalanceAyeFormat = this._formatBalance(referendum.votedBalanceAye);
      referendum.votedBalanceAye = referendum.votedBalanceAye / DOT_UNIT;
      referendum.votedBalanceNayFormat = this._formatBalance(referendum.votedBalanceNay);
      referendum.votedBalanceNay = referendum.votedBalanceNay / DOT_UNIT;
      referendum.votedBalanceTotalFormat = this._formatBalance(referendum.votedBalanceTotal);
      referendum.votedBalanceTotal = referendum.votedBalanceTotal / DOT_UNIT;
      return referendum;
    });
    ctx.body = res;
  }

  async proposals() {
    const { ctx } = this;
    const result = await ctx.service.proposals.list();
    const res = [];
    for (const proposal of result) {
      proposal.balanceFormat = this._formatBalance(proposal.balance);
      res.push(proposal);
    }
    ctx.body = res;
  }

}

module.exports = DemocracyController;
