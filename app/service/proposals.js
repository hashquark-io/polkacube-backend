'use strict';

const Service = require('egg').Service;

class ProposalsService extends Service {
  async list() {
    const result = await this.app.api.derive.democracy.proposals();
    const proposals = [];
    for (const obj of result) {
      const proposal = {};
      proposal.index = obj.index.toString();
      proposal.proposer = obj.proposer.toString();
      proposal.identity = await this.service.identity.findIdentity(proposal.proposer);
      proposal.balance = obj.balance;
      proposal.seconds = obj.seconds.filter(value => value.toString() !== proposal.proposer);
      proposal.hash = obj.imageHash;
      if (obj.image && obj.image.proposal && obj.image.proposal.callIndex) {
        proposal.detail = await this.service.meta.findMetaCall(obj.image.proposal.callIndex, obj.image.proposal.args);
      }
      proposals.push(proposal);
    }
    return proposals;
  }

}
module.exports = ProposalsService;
