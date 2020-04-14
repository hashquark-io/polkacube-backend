'use strict';

const Service = require('egg').Service;
const BN = require('bn.js');

class ReferendumsService extends Service {
  async list() {
    const bestNumber = await this.app.api.derive.chain.bestNumber();
    const result = await this.app.api.derive.democracy.referendums();
    const referendums = [];
    for (const obj of result) {
      const referendum = this._votesFor(obj);
      referendum.index = obj.index;
      referendum.hash = obj.imageHash;
      if (obj.image.proposal && obj.image.proposal.callIndex) {
        referendum.detail = await this.service.meta.findMetaCall(obj.image.proposal.callIndex, obj.image.proposal.args);
      }
      referendum.enactBlock = obj.status.end.add(obj.status.delay).toNumber();
      referendum.remainingBlocks = obj.status.end.sub(bestNumber).subn(1).toNumber();
      referendums.push(referendum);
    }
    return referendums;
  }

  _votesFor(obj) {
    this.app.logger.debug(obj);
    const result = {};
    result.voteCount = obj.voteCountAye + obj.voteCountNay;
    result.voteCountAye = obj.voteCountAye;
    result.voteCountNay = obj.voteCountNay;
    result.votedBalanceAye = obj.votedAye;
    result.votedBalanceNay = obj.votedNay;
    result.votedBalanceTotal = new BN(obj.votedAye).add(new BN(obj.votedNay));
    result.allAye = obj.allAye.map(({ accountId }) => accountId);
    result.allNay = obj.allNay.map(({ accountId }) => accountId);
    result.isPassing = obj.isPassing;
    return result;
  }
}

module.exports = ReferendumsService;

