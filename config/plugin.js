'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  io: {
    enable: true,
    package: 'egg-socket.io',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
};
