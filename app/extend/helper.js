'use strict';




module.exports = {
/**
   * 向目标服务器发请求，简单的处理负载均衡（一台机器访问出错，再重新访问另外一台机器，直到访问成功。如果机器已经遍历完毕，则返回错误）
   * @param {*} env     当前访问的目标环境列表对象
   * @param {*} param   需要发送的参数
   */
  async passportSendNormalRequest(env, param) {
    const ctx = this.ctx;

    try {
      ctx.logger.info('target Ip: '+ env);
      ctx.logger.info('request param: '+ JSON.stringify(param));
      const result = await ctx.curl(env + '?ts='+(+new Date()), {
        // 必须指定 method
        method: 'POST',
        // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
        contentType: 'json',
        data: param,
        // data: requestParam,
        dataType: 'json',
      });
      return result.data;
    } catch(e) {
      ctx.logger.error(e.message);
      // return false;
      // 重新调用
    }
  },

  async passportMysqlConnect() {
    const portalConfig = this.app.config['passportJyb']
    if(portalConfig.clients.mysqlOperate.app) {
      return this.app.passportJyb.get(portalConfig.clients.mysqlOperate.type);
    }
    let mysqlConnect = null;
    if(portalConfig.userDBClient) {
      mysqlConnect = this.app.mysql.get(portalConfig.clients.mysqlOperate.userDBClient)
    } else {
      mysqlConnect = this.app.mysql
    } 
    if(!mysqlConnect) {
      this.ctx.logger.error('数据库连接数据');
    }
    return mysqlConnect;
  },

  /**
   * 向目标服务器发请求，简单的处理负载均衡（一台机器访问出错，再重新访问另外一台机器，直到访问成功。如果机器已经遍历完毕，则返回错误）
   * @param {*} env     当前访问的目标环境列表对象
   * @param {*} param   需要发送的参数
   */
  async passportMysqlQuery(sql, param) {
    const mysqlConnect = await this.passportMysqlConnect();
    const ctx = this.ctx;
    try {
      ctx.logger.info('passportMysqlQuery '+ sql + ' ' + JSON.stringify(param));
      const queryResult = await mysqlConnect.query(sql, param);
      return queryResult;
    } catch(e) {
      ctx.logger.error(e.message);
      return false;
      // 重新调用
    }
  },

  passportIsAllowUrl(rules, path) {
    return rules.find(rule => {
      if(rule.test(path)) {
        return true;
      }
    })
  }
}
