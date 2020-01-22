'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/slash.test.js', () => {

  it('should GET slash', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/slash?page=1&size=100')
      .expect(200);
    assert(result.body.length > 0);
  });

  it('should GET slash by account', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/slash?page=1&size=100&accountAddr=Cdk5WqELnXQ2QiCLtnrvz2M1vpJtLNP9y6yBRqS6SsLPKvz')
      .expect(200);
    assert(result.body.length > 0);
  });

});
