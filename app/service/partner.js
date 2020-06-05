'use strict';

const Service = require('egg').Service;
const partner = require('../partner.json');

class PartnerService extends Service {
  async findAll() {
    try {
      const result = await this.app.curl('https://stakedrop.phala.network/api/whitelist', {
        dataType: 'json',
      });
      if (result.status === 200 && result.data.status === 'ok' && result.data.result.length > 0) {
        return result.data.result;
      }
    } catch (error) {
      this.ctx.logger.error('partner-error:', error);
      return partner.result;
    }
    return [];
  }
}

module.exports = PartnerService;
