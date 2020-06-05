'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/identity.test.js', () => {


  it('should GET identity', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/identity/Et5ne6GRrWZ178npoYdnG8RRU92gzqBiSRf4hTaU3Yonsf2')
      .expect(200);
    assert(result.body != null);
  });

});
