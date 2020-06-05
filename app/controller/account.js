'use strict';

const Controller = require('egg').Controller;

class AccountController extends Controller {

  _formatBalance(balance) {
    return this.ctx.helper.formatBalance(balance);
  }

  _formatCommission(commission) {
    return this.ctx.helper.formatCommission(commission);
  }

  async stashes() {
    this.logger.debug(`params: ${this.ctx.params.accountId}`);
    const stashes = await this.ctx.service.account.stashes([ this.ctx.params.accountId ]);
    this._formatStashes(stashes);
    this.ctx.body = stashes;
  }

  _formatStashes(stashes) {
    stashes.forEach(stash => {
      stash.commissionFormat = this._formatCommission(stash.stakingAccount.validatorPrefs.commission);
      stash.bondedBalanceFormat = this._formatBalance(stash.bondedBalance);
      stash.redeemableFormat = this._formatBalance(stash.redeemable);
      stash.unbondingBalanceFormat = this._formatBalance(stash.unbondingBalance);
      stash.unbondingDetail && stash.unbondingDetail.forEach(item => {
        item.valueFormat = this._formatBalance(item.value);
      });
    });
  }

  async rewards() {
    // this.logger.debug(`params: ${JSON.stringify(this.ctx.request.body)}`);
    // const allAccounts = this.ctx.request.body.ids.split(',');
    this.logger.debug(`params: ${this.ctx.params.stashId}`);
    const stashIds = [];
    stashIds.push(this.ctx.params.stashId);
    const rewards = await this.ctx.service.account.rewards(stashIds);
    rewards.stashTotalFormat = this._formatBalance(rewards.stashTotal);
    rewards.stashes.forEach(item => {
      item.availableFormat = this._formatBalance(item.available);
    });
    rewards.validatorsTotalFormat = this._formatBalance(rewards.validatorsTotal);
    rewards.validators.forEach(item => {
      item.availableFormat = this._formatBalance(item.available);
    });
    this.ctx.body = rewards;
  }

  async allBalances() {
    this.logger.debug(`params: ${JSON.stringify(this.ctx.params.accountIds)}`);
    const allAccounts = this.ctx.params.accountIds.split(',');
    const allBalances = await Promise.all(
      allAccounts.map(accountId => this.ctx.service.account.balances(accountId)));
    allBalances.forEach(balances => this._formatAllBalances(balances));
    this.ctx.body = allBalances;
  }

  async balances() {
    this.logger.debug(`params: ${this.ctx.params.accountId}`);
    const balances = await this.ctx.service.account.balances(this.ctx.params.accountId);
    this._formatAllBalances(balances);
    this.ctx.body = balances;
  }

  _formatAllBalances(balances) {
    // 总共
    balances.freeBalanceFormat = this._formatBalance(balances.freeBalance);
    // 可转移
    balances.availableBalanceFormat = this._formatBalance(balances.availableBalance);
    // 锁定
    balances.lockedBalanceFormat = this._formatBalance(balances.lockedBalance);
    // 预留
    balances.reservedBalanceFormat = this._formatBalance(balances.reservedBalance);
    // 抵押
    balances.bondedBalanceFormat = this._formatBalance(balances.bondedBalance);
    // 解除抵押
    balances.unbondingBalanceFormat = this._formatBalance(balances.unbondingBalance);
    // 可赎回
    balances.redeemableFormat = this._formatBalance(balances.redeemable);

    // 投票权
    balances.votingBalanceFormat = this._formatBalance(balances.votingBalance);

    balances.unbondingDetail && balances.unbondingDetail.forEach(item => {
      item.valueFormat = this._formatBalance(item.value);
    });
  }

}

module.exports = AccountController;
