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
  router.get('/api/v1/identity/:accountId', controller.identity.getIdentity);
  router.get('/api/v1/democracy/overview', controller.democracy.overview);
  router.get('/api/v1/democracy/referendums', controller.democracy.referendums);
  router.get('/api/v1/democracy/proposals', controller.democracy.proposals);
  router.get('/api/v1/nomination/:num', controller.bondedModel.forecastReward);
  router.get('/api/v1/node/:num', controller.bondedModel.buildNodes);
  router.get('/api/v1/slash-reward', controller.statistics.getValidatorSlashReward);
  router.get('/api/v1/point/:accountId', controller.point.pointQuery);
};
