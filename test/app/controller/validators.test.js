'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/validators.test.js', () => {

  it('should GET validators', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/validator')
      .expect(200);
    assert(result.body.length > 0);
  });

  it('should GET validator', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/validator/GiBnzCGFofhmAvsUv9FUShUb8YJYYwWex3ThQNkbDDNprS6')
      .expect(200);
    assert(result.body.id > 0);
  });

});
