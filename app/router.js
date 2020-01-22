'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/api/v1/validator', controller.validators.index);
  router.get('/api/v1/validator/:accountId', controller.validators.info);
  router.get('/api/v1/slash', controller.slash.slashPageQuery);
  router.get('/api/v1/slash-count', controller.slash.slashCountPageQuery);
  router.get('/api/v1/reward', controller.reward.rewardPageQuery);
  router.get('/api/v1/token', controller.token.getToken);
  router.get('/api/v1/token-validator', controller.token.getValidator);
  router.get('/api/v1/finalize-number', controller.token.getBestNumberFinalized);
};
