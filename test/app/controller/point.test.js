'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/point.test.js', () => {


  it('should GET point', async () => {
    const result = await app.httpRequest()
      .get('/api/v1/point/JLKcPk652UTtQfyrk7keyU6vqAEj5JXzDAvQdPxB1DJTnZ3')
      .expect(200);
    assert(result.body);
  });

});
