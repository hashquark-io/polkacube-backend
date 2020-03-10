'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('test/app/controller/identity.test.js', () => {
  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });
  afterEach(mock.restore);

  it('should GET identity', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/identity/Gc6YgfbTJ6pYXcwib6mk3KoiwncLm4dfdcN3nwFjvfi4Agd')
      .expect(200);
    assert(result.body != null);
  });

});
