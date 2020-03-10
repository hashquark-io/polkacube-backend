'use strict';

const Service = require('egg').Service;

class IdentityService extends Service {

  async findIdentity(accountId) {
    const account = await this.app.api.derive.accounts.info(accountId);
    if (account.identity && account.identity.judgements) {
      if ((!account.identity.display) && account.identity.judgements.length === 0) {
        return {};
      }
    }
    return account.identity;
  }

}
module.exports = IdentityService;
