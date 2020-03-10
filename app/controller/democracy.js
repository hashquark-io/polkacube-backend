'use strict';

const Controller = require('egg').Controller;
const { formatNumber, formatBalance } = require('@polkadot/util');
// 10^12
const DOT_UNIT = 1000000000000;

formatBalance.setDefaults({ decimals: 12, unit: 'KSM' });

class DemocracyController extends Controller {

  async overview() {
    const { ctx } = this;
    const [proposals, referendums, progress] = await Promise.all([ctx.service.democracy.overviewOfProposals(),
    ctx.service.democracy.overviewOfReferendums(),
    ctx.service.democracy.overviewOfProgress(),
    ]);
    proposals.proposalsFormat = formatNumber(proposals.proposals);
    proposals.totalProposalsFormat = formatNumber(proposals.totalProposals);

    referendums.referendumCountFormat = formatNumber(referendums.referendumCount);
    referendums.totalReferendumCountFormat = formatNumber(referendums.totalReferendumCount);

    progress.progressFormat = formatNumber(progress.progress);
    progress.launchPeriodFormat = formatNumber(progress.launchPeriod);

    const res = {};
    Object.assign(res, proposals, referendums, progress);
    ctx.body = res;
  }

  async referendums() {
    const { ctx } = this;
    const result = await ctx.service.referendums.list();
    const res = result.map(referendum => {
      referendum.enactBlockFormat = formatNumber(referendum.enactBlock);
      referendum.remainingBlocksFormat = formatNumber(referendum.remainingBlocks);
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

  _formatBalance(value) {
    const format = formatBalance(value);
    return format === '0' ? '0 KSM' : format;
  }

}

module.exports = DemocracyController;
