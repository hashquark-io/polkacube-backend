'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('test/app/service/slash.test.js', () => {
  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });
  afterEach(mock.restore);

  describe('find()', () => {
    it('should get slash', function* () {
      const ctx = app.mockContext();
      const slashs = yield ctx.service.slash.find(1, 100);
      assert(slashs);
    });

    it('should get account slash', function* () {
      const ctx = app.mockContext();
      const slashs = yield ctx.service.slash.find(1, 100, 'Cdk5WqELnXQ2QiCLtnrvz2M1vpJtLNP9y6yBRqS6SsLPKvz');
      assert(slashs);
    });

  });


  describe('slashCountPageQuery()', () => {
    it('should get slash count', function* () {
      const ctx = app.mockContext();
      const slashs = yield ctx.service.slash.slashCountPageQuery(1, 100, 'Cdk5WqELnXQ2QiCLtnrvz2M1vpJtLNP9y6yBRqS6SsLPKvz');
      assert(slashs);
    });

  });
});
