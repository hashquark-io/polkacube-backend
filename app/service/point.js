'use strict';
const Service = require('egg').Service;

class PointService extends Service {

  async find(accountAddr) {
    const sql = 'select * from (select point,currentEra from ksm_point_era where accountAddr= ? ORDER BY currentEra desc limit 100) a order by a.currentEra ';
    const point = await this.app.mysql.query(sql, [ accountAddr ]);
    return point;
  }

}
module.exports = PointService;
