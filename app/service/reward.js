const Service = require('egg').Service;

const { formatBalance } = require('@polkadot/util');
formatBalance.setDefaults({
    decimals: 12,
    unit: 'KSM'
});

class SlashService extends Service {

    async find(page, size) {
        size = size || 100;
        page = page || 1;
        size = size > 200 ? 200 : size;
        let offset = (page * size) - size;
        let reward = [];
        if (isNaN(offset)) {
            return reward;
        }
        reward = await this.app.mysql.select('ksm_evt_reward', {
            orders: [
                ['height', 'desc'],
                ['index', 'desc']
            ],
            limit: +size,
            offset: offset
        })
        reward = reward.map(obj => {
            obj.validatorsAmount = formatBalance(obj.validatorsAmount);
            obj.treasuryAmount = formatBalance(obj.treasuryAmount);
            return obj;
        });
        return reward;
    }
}
module.exports = SlashService;