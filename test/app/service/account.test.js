'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('test/app/service/account.test.js', () => {
  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });
  afterEach(mock.restore);

  describe('balances()', () => {
    it('should get account balances', function* () {
      const ctx = app.mockContext();
      const balances = yield ctx.service.account.balances('HsWN6mjakUvuYjYoQauuiJhrSBtcup9M66X4YQasx5HZNYS');
      assert(balances);
    });

  });

  describe('stashes()', () => {
    it('should get account stashes', function* () {
      const ctx = app.mockContext();
      const stashes = yield ctx.service.account.stashes([ 'HsWN6mjakUvuYjYoQauuiJhrSBtcup9M66X4YQasx5HZNYS' ]);
      assert(stashes);
    });
  });

});

