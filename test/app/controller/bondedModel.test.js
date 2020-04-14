'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/bondedModel.test.js', () => {

  it('should GET nomination', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/nomination/500')
      .expect(200);
    assert(result.body);
  });

  it('should GET node', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/node/500')
      .expect(200);
    assert(result.body);
  });


});
