'use strict';

const Service = require('egg').Service;
const BN = require('bn.js');
const ZERO = new BN(0);

class DemocracyService extends Service {
  async overviewOfProposals() {
    const [ proposals, publicPropCount ] = await Promise.all([ this.app.api.derive.democracy.proposals(),
      this.app.api.query.democracy.publicPropCount() ]);
    const result = {};
    result.proposals = proposals.length || 0;
    result.totalProposals = publicPropCount || 0;
    return result;
  }

  async overviewOfReferendums() {
    const [ referendumCount, lowestUnbaked ] = await Promise.all([ this.app.api.query.democracy.referendumCount(),
      this.app.api.query.democracy.lowestUnbaked() ]);
    const result = {};
    result.referendumCount = referendumCount.sub(lowestUnbaked || ZERO).toNumber();
    result.totalReferendumCount = referendumCount.toNumber();
    return result;
  }

  async overviewOfProgress() {
    const [ launchPeriod, bestNumber ] = await Promise.all([ this.app.api.consts.democracy.launchPeriod,
      this.app.api.derive.chain.bestNumber() ]);
    const result = {};
    result.progress = bestNumber.mod(launchPeriod).addn(1).toNumber();
    result.launchPeriod = launchPeriod.toNumber();
    return result;
  }

}

module.exports = DemocracyService;
