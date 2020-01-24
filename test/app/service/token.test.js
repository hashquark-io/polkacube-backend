'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('test/app/service/token.test.js', () => {
  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });
  afterEach(mock.restore);

  describe('excute()', () => {
    it('should get token', function* () {
      const ctx = app.mockContext();
      const token = yield ctx.service.token.excute();
      assert(token);
    });

  });

  describe('validator()', () => {
    it('should get validator', function* () {
      const ctx = app.mockContext();
      const validator = yield ctx.service.token.validator();
      assert(validator);
    });

  });
});
