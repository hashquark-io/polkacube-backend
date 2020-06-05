'use strict';

const { formatNumber, formatBalance } = require('@polkadot/util');
const BN = require('bn.js');


const util = {};

util.formatBalance = function(balance) {
  const unit = this.app.config.ksm.unit;
  formatBalance.setDefaults({ decimals: 12, unit });
  const format = formatBalance(balance, { forceUnit: '-' });
  return format === '0' ? ('0 ' + unit) : format;
};

util.formatNumber = function(num) {
  return formatNumber(num);
};
// percentage of the commission. e.g. 100000000 is converted to 10.00 percent
util.formatCommission = function(commission) {
  if (commission.unwrap().toNumber() === 0) {
    return 0;
  }
  const PERBILL = new BN(1000000000);
  return (commission.unwrap().muln(10000).div(PERBILL)
    .toNumber() / 100).toFixed(2);
};

module.exports = util;
