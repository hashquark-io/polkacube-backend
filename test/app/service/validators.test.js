'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('test/app/service/validators.test.js', () => {
  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });
  afterEach(mock.restore);

  describe('findAll()', () => {
    it('should get validators', function* () {
      const ctx = app.mockContext();
      const validators = yield ctx.service.validators.findAll(1, 100);
      assert(validators);
    });


  });


  describe('findByAccountId()', () => {
    it('should get validator', function* () {
      const ctx = app.mockContext();
      const validator = yield ctx.service.validators.findByAccountId('GiBnzCGFofhmAvsUv9FUShUb8YJYYwWex3ThQNkbDDNprS6');
      assert(validator);
    });
  });

  describe('stashes()', () => {
    it('should get stashes', function* () {
      const ctx = app.mockContext();
      const validator = yield ctx.service.validators.stashes();
      assert(validator);
    });
  });
});

