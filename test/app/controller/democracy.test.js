'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/democracy.test.js', () => {

  it('should GET overview', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/democracy/overview')
      .expect(200);
    assert(result.body.proposals >= 0);
    assert(result.body.referendumCount >= 0);
    assert(result.body.progress >= 0);
  });

  it('should GET referendums', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/democracy/referendums')
      .expect(200);
    assert(result.body.length >= 0);
  });

  it('should GET proposals', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/democracy/proposals')
      .expect(200);
    assert(result.body.length >= 0);
  });

});
