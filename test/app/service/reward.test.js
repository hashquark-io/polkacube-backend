'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('test/app/service/reward.test.js', () => {
  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });
  afterEach(mock.restore);

  describe('find()', () => {
    it('should get rewards', function* () {
      const ctx = app.mockContext();
      const rewards = yield ctx.service.reward.find(1, 100);
      assert(rewards);
    });

  });
});

