'use strict';

const Controller = require('egg').Controller;
const BN = require('bn.js');
class PointController extends Controller {
  /*

  */
  async pointQuery() {
    const { ctx } = this;
    const res = await ctx.service.point.find(ctx.params.accountId);
    const pointList = [];
    let totalPoint = 0;
    res.forEach(({ point, currentEra }, index) => {
      totalPoint = totalPoint + point;
      const averagePoint = new BN(totalPoint).muln(1000).divn(index + 1)
        .toNumber() / 1000;
      pointList.push({
        point,
        currentEra,
        averagePoint,
      });
    });
    ctx.body = pointList;
  }

}

module.exports = PointController;
