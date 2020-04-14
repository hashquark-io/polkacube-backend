'use strict';

const assert = require('assert');
const mock = require('egg-mock');

describe('test/app/service/point.test.js', () => {
  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });
  afterEach(mock.restore);

  describe('find()', () => {
    it('should get point', function* () {
      const ctx = app.mockContext();
      const pointList = yield ctx.service.point.find('JLKcPk652UTtQfyrk7keyU6vqAEj5JXzDAvQdPxB1DJTnZ3');
      assert(pointList);
    });

  });
});

