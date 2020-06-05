'use strict';

const Service = require('egg').Service;

class MetaService extends Service {

  _formatBalance(balance) {
    return this.ctx.helper.formatBalance(balance);
  }

  async findMetaCall(callIndex, args) {
    const detail = {};
    const fn = this.app.api.findCall(callIndex);
    detail.method = fn.method;
    detail.section = fn.section;
    detail.documentation = fn.meta ? fn.meta.documentation.join(' ') : '';
    detail.args = [];
    let index = 0;
    for (const arg of fn.meta.args) {
      const obj = {};
      obj.name = arg.name.toString();
      obj.type = arg.type.toString();
      obj.value = args[index].toString();
      if (obj.type === 'Compact<Balance>') {
        obj.value = this._formatBalance(obj.value);
        if (obj.value === '0') {
          obj.value = '0 KSM';
        }
      }
      if (obj.type === 'AccountId' || obj.type === 'Address' || obj.type === 'LookupSource') {
        obj.identity = await this.service.identity.findIdentity(obj.value);
      }
      index++;
      detail.args.push(obj);
    }
    return detail;
  }
}
module.exports = MetaService;
