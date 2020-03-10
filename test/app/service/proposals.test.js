'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('test/app/service/proposals.test.js', () => {
  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });
  afterEach(mock.restore);

  describe('list()', () => {
    it('should get proposals', function* () {
      const ctx = app.mockContext();
      const proposals = yield ctx.service.proposals.list();
      assert(proposals);
    });
  });
});

