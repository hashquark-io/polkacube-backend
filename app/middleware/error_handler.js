'use strict';

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      // err log
      ctx.app.emit('error', err, ctx);
      const status = err.status || 500;
      const error = status === 500 && ctx.app.config.env === 'prod'
        ? 'Internal Server Error'
        : err.message;
      ctx.body = { error };
      ctx.status = status;
    }
  };
};
