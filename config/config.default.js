/* eslint valid-jsdoc: "off" */

'use strict';

require('dotenv').config('../.env');

// kusama configuration
const ksm = {
  // The '127.0.0.1' or 'localhost' direct to container host, you must change it when you run in docker.
  ws: 'ws://' + (process.env.SUBSTRATE_WS_HOST || '127.0.0.1') + ':' + (process.env.SUBSTRATE_WS_PORT || '9944'),
  unit: process.env.SUBSTRATE_UNIT || 'KSM',  
};

// logger
const logger = {
  level: 'DEBUG',
};

const logrotator = {
  maxFileSize: 10 * 1024 * 1024,
  maxFiles: 10,
  rotateDuration: 30000,
};

// database configuration
const mysql = {
  client: {
    // The '127.0.0.1' or 'localhost' direct to container host, you must change it when you run in docker.
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || '3306',
    user: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'hq_polkacube',
    charset: 'utf8mb4',
  },
};
console.log('Development enviroment is starting =============');
const io = {
  init: {}, // passed to engine.io
  namespace: {
    '/': {
      connectionMiddleware: [],
      packetMiddleware: [],
    },
  },
};

const security = {
  csp: {
    enable: false,
    policy: {
      'default-src': 'none',
      'script-src': 'self',
      'connect-src': 'self',
      'img-src': 'self',
      'style-src': 'self',
    },
  },
};

const cors = {
  origin: '*',
  allowHeaders: '*',
  allowMethods: 'GET,PUT,POST,OPTIONS',
  credentials: false,
};

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1573638285088_5858';

  // add your middleware config here
  config.middleware = [ 'errorHandler' ];
  config.errorHandler = {
    match: '/api',
  };

  // add your user config here
  const userConfig = {
    ksm,
    logger,
    logrotator,
    mysql,
    io,
    security,
    cors,
  };

  return {
    ...config,
    ...userConfig,
  };
};
