
module.exports = app => {
  // 将 static 中间件放到 bodyParser 之前
  const index = app.config.coreMiddleware.length;
  // const index = app.config.coreMiddleware.indexOf('bodyParser');
//   assert(index >= 0, 'bodyParser 中间件必须存在');

  app.config.coreMiddleware.splice(index, 0, 'passportJybAuth');
};
