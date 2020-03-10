'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('test/app/service/democracy.test.js', () => {
  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });
  afterEach(mock.restore);

  describe('overviewOfProposals()', () => {
    it('should get proposals', function* () {
      const ctx = app.mockContext();
      const proposals = yield ctx.service.democracy.overviewOfProposals();
      assert(proposals);
    });
  });

  describe('overviewOfReferendums()', () => {
    it('should get referendums', function* () {
      const ctx = app.mockContext();
      const referenda = yield ctx.service.democracy.overviewOfReferendums();
      assert(referenda);
    });
  });

  describe('overviewOfProgress()', () => {
    it('should get progress', function* () {
      const ctx = app.mockContext();
      const progress = yield ctx.service.democracy.overviewOfProgress();
      assert(progress);
    });
  });
});

