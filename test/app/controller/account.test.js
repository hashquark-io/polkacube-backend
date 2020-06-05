'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/account.test.js', () => {

  it('should GET account balances', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/account/balances/HsWN6mjakUvuYjYoQauuiJhrSBtcup9M66X4YQasx5HZNYS')
      .expect(200);
    assert(result.body.freeBalance);
  });

  it('should GET account all balances', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/account/all-balances/HsWN6mjakUvuYjYoQauuiJhrSBtcup9M66X4YQasx5HZNYS,JEk9et2iLAZGcqrs9uxda662BoytT2SSh7Z7ddeEBrWG6CQ')
      .expect(200);
    assert(result.body[0].freeBalance >= 0);
  });


  it('should GET account stashes', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/account/stashes/HsWN6mjakUvuYjYoQauuiJhrSBtcup9M66X4YQasx5HZNYS')
      .expect(200);
    assert(result.body[0].redeemable >= 0);
  });

});
