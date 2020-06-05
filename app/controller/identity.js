'use strict';

const Controller = require('egg').Controller;

class IdentityController extends Controller {

  async getIdentity() {
    this.logger.debug(`params: ${this.ctx.params.accountId}`);
    const accountId = this.ctx.params.accountId;
    const identity = await this.ctx.service.identity.findIdentity(accountId);
    this.ctx.body = identity;
  }

}

module.exports = IdentityController;
