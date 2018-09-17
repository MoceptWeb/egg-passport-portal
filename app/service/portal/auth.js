'use strict';

const Service = require('egg').Service;
const md5 = require('md5')
const debugPassportJyb = require('debug')('passportJyb')

/**
 * 1、可以先通过getTicket url获取是否登录， 如果登录则到notify_uri进行token验证后直接登录
 * 2、如果getTicket 没有登录则通过用户名和密码登录，然后同步用户中心setLoginState
 * 3、之后就可以使用getticket生成跳转其他页面的
 */
class AuthService extends Service {


  async getUserAuth(ticket) {
    const portalConfig= this.app.config['passportJyb']
    const {secret_key}  =  portalConfig
    const secret_key2 = md5(ticket+'-'+secret_key);
    const param = {
      "cmd": portalConfig.cmd['getUserAuth'],
      "data": {
          "ticket": ticket,
          "client_secret": secret_key,
          "secret_key": secret_key2
        }
      }

    const result = await  this.ctx.helper.passportSendNormalRequest(portalConfig['portal']['portal_url'], param)

    this.ctx.logger.info('校验ticket, 结果是 %s', JSON.stringify(result))

    return result;
  }

  async getUserMenu(ticket) {
    const portalConfig= this.app.config['passportJyb']
    const {secret_key}  =  portalConfig
    const secret_key2 = md5(ticket+'-'+secret_key);
    const param = {
      "cmd": portalConfig.cmd['getUserMenu'],
      "data": {
          "ticket": ticket,
          "client_secret": secret_key,
          "secret_key": secret_key2
        }
      }

    const result = await  this.ctx.helper.passportSendNormalRequest(portalConfig['portal']['portal_url'], param)


    return result;
  }

}

module.exports = AuthService;
