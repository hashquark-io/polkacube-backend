'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/token.test.js', () => {

  it('should GET token', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/token')
      .expect(200);
    assert(result.body.stakingRatio > 0);
  });

  it('should GET validator info', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/token-validator')
      .expect(200);
      assert(result.body.eraLength >= 0);
      assert(result.body.eraProgress >= 0);
      assert(result.body.sessionLength >= 0);
      assert(result.body.sessionProgress >= 0);
      assert(result.body.maxValidator);
      assert(result.body.actualValidator);
  });

  it('should GET finalize block number', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/finalize-number')
      .expect(200);
    assert(result.body.finalized > 0);
  });
});
