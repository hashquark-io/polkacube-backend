'use strict';
const assert = require('assert');
const mock = require('egg-mock');

describe('test/app/service/statistics.test.js', () => {

  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });
  afterEach(mock.restore);

  describe('excute()', () => {
    it('should get token', function* () {
      const ctx = app.mockContext();
      const token = yield ctx.service.statistics.getValidatorSlashReward('GiBnzCGFofhmAvsUv9FUShUb8YJYYwWex3ThQNkbDDNprS6');
      assert(token);
    });

  });


});
