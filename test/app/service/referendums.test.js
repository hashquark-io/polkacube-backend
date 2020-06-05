'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('test/app/service/referendums.test.js', () => {
  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });
  afterEach(mock.restore);

  describe('list()', () => {
    it('should get referendums', function* () {
      const ctx = app.mockContext();
      const referendums = yield ctx.service.referendums.list();
      assert(referendums);
    });
  });

});

