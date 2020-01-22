'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/reward.test.js', () => {

  it('should GET reward', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/reward?page=1&size=100')
      .expect(200);
    assert(result.body.length > 0);
  });

  it('should GET reward by account', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/reward?page=1&size=100&accountAddr=Cdk5WqELnXQ2QiCLtnrvz2M1vpJtLNP9y6yBRqS6SsLPKvz')
      .expect(200);
    assert(result.body.length > 0);
  });

});
