
'use strict';

const rds = require('ali-rds');
const debugPassportJyb = require('debug')('passportJyb')

let count = 0;

module.exports = app => {
  app.addSingleton('passportJyb', createOneClient);
};

function createOneClient(config, app) {
  if(config.type === 'mysqlOperate') {
    app.coreLogger.info('[egg-passport-jyb] connecting %s@%s:%s/%s',
    config.user, config.host, config.port, config.database);
    const client = rds(config);

    app.beforeStart(function* () {
      const rows = yield client.query('select now() as currentTime;');
      const index = count++;
      debugPassportJyb('[egg-passport-jyb] connecting %s@%s:%s/%s',
      config.user, config.host, config.port, config.database);
      app.coreLogger.info(`[egg-passport-jyb] mysql instance[${index}] status OK, rds currentTime: ${rows[0].currentTime}`);
    });
    return client;
  }
}