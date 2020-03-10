'use strict';

const Service = require('egg').Service;
const BN = require('bn.js');

class ReferendumsService extends Service {
  async list() {
    const bestNumber = await this.app.api.derive.chain.bestNumber();
    const result = await this.app.api.derive.democracy.referendums();
    const referendums = [];
    for (const obj of result) {
      const referendum = await this.votesFor(obj.index);
      referendum.index = obj.index;
      referendum.hash = obj.hash.toString();
      if (obj.proposal && obj.proposal.callIndex) {
        referendum.detail = await this.service.meta.findMetaCall(obj.proposal.callIndex, obj.proposal.args);
      }
      referendum.enactBlock = obj.info.end.add(obj.info.delay).toNumber();
      referendum.remainingBlocks = obj.info.end.sub(bestNumber).subn(1).toNumber();
      referendums.push(referendum);
    }
    return referendums;
  }

  async votesFor(idNumber) {
    const votesFor = await this.app.api.derive.democracy.referendumVotesFor(idNumber);
    let voteCount = 0;
    let voteCountAye = 0;
    let voteCountNay = 0;
    let votedBalanceAye = new BN(0);
    let votedBalanceNay = new BN(0);
    let votedBalanceTotal = new BN(0);
    votesFor.forEach(({ balance, vote }) => {
      const isDefault = vote.conviction.index === 0;
      const countedBalance = balance
        .muln(isDefault ? 1 : vote.conviction.index)
        .divn(isDefault ? 10 : 1);

      if (vote.isAye) {
        voteCountAye++;
        votedBalanceAye = votedBalanceAye.add(countedBalance);
      } else {
        voteCountNay++;
        votedBalanceNay = votedBalanceNay.add(countedBalance);
      }

      voteCount++;
      votedBalanceTotal = votedBalanceTotal.add(countedBalance);
    });
    const result = {};
    result.voteCount = voteCount;
    result.voteCountAye = voteCountAye;
    result.voteCountNay = voteCountNay;
    result.votedBalanceAye = votedBalanceAye;
    result.votedBalanceNay = votedBalanceNay;
    result.votedBalanceTotal = votedBalanceTotal;
    return result;
  }
}

module.exports = ReferendumsService;

