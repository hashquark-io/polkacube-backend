'use strict';

const { formatNumber, formatBalance } = require('@polkadot/util');

formatBalance.setDefaults({ decimals: 12, unit: 'KSM' });

const util = {};

util.formatBalance = function(balance) {
  const format = formatBalance(balance, { forceUnit: '-' });
  return format === '0' ? '0 KSM' : format;
};

util.formatNumber = function(num) {
  return formatNumber(num);
};

module.exports = util;
