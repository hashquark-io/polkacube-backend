'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('test/app/service/identity.test.js', () => {

  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });
  afterEach(mock.restore);

  describe('findIdentity()', () => {
    it('should get rewards', function* () {
      const ctx = app.mockContext();
      const identity = yield ctx.service.identity.findIdentity('Gc6YgfbTJ6pYXcwib6mk3KoiwncLm4dfdcN3nwFjvfi4Agd');
      assert(identity);
    });

  });

});
