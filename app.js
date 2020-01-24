'use strict';

const { ApiPromise, WsProvider } = require('@polkadot/api');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async didLoad() {
    // Load plugin service

    // Initialise the provider to connect to the local node
    const provider = new WsProvider(this.app.config.ksm.ws);

    // Create the API and wait until ready
    const api = await ApiPromise.create({ provider });

    // Create polkadot webservice
    this.app.api = api;
    this.app.io.origins((origin, callback) => {
      if (this.app.config.cors.origin !== '*' && origin !== this.app.config.cors.origin) {
        return callback('origin not allowed', false);
      }
      callback(null, true);
    });
    // const mysqlConfig = await this.app.configCenter.fetch('mysql');
    //  this.app.database = app.mysql.createInstance(mysqlConfig);

  }

  async serverDidReady() {
    // http / https server is loaded.
    await this.app.api.derive.chain.subscribeNewHeads(header => {

      this.app.io.emit('headerChange', { height: header.number, validatorAddr: header.author });
    });
    await this.app.api.rpc.chain.subscribeFinalizedHeads(header => {
      this.app.io.emit('finalizedHeaderChange', { height: header.number });
    });
  }
}

module.exports = AppBootHook;
