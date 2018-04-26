'use strict';

const Service = require('egg').Service;
const md5 = require('md5')
const debugPassportJyb = require('debug')('passportJyb')

/**
 * 1、可以先通过getTicket url获取是否登录， 如果登录则到notify_uri进行token验证后直接登录
 * 2、如果getTicket 没有登录则通过用户名和密码登录，然后同步用户中心setLoginState
 * 3、之后就可以使用getticket生成跳转其他页面的
 */
class PortalService extends Service {

  /**
   * ticket生成（重定向接口）
   * 通过url校验用户是否已经在用户中心同步登录了, 可用于通过url单点登录
   * notify_uri  生成Ticket之后的通知（回调）地址 或者未登录的回跳地址
   * redirect_uri  登陆成功后返回的url参数中的redirect_uri
    //  例如登录后的getTicket会到跳转http://localhost:7001/?ticket=7b6f6a2cb40a105a0aee9958932555cc&expire=35140&redirect_uri=http://localhost:7777&code=0#/welcome
   */
  async getTicket({redirect_uri, notify_uri}) {
    const portalConfig= this.app.config['passportJyb']
    // const {client_id, secret_key, redirect_uri}  =  portalConfig
    const {client_id, secret_key}  =  portalConfig

    const secret_key2 = md5(redirect_uri+'-'+notify_uri+'-'+client_id+'-'+secret_key)
    
    const url = portalConfig['portal']['portal_get_ticket_url']+'?redirect_uri='+redirect_uri+'&notify_uri='+notify_uri+'&client_id='+client_id+'&secret_key='+secret_key2

    return url;
  }

  async verifyTicket(ticket) {
    const portalConfig= this.app.config['passportJyb']
    const {secret_key}  =  portalConfig
    const secret_key2 = md5(ticket+'-'+secret_key);
    const param = {
      "cmd": portalConfig.cmd['verifyTicket'],
      "data": {
          "ticket": ticket,
          "client_secret": secret_key,
          "secret_key": secret_key2
        }
      }

    const result = await  this.ctx.helper.passportSendNormalRequest(portalConfig['portal']['portal_url'], param)

    debugPassportJyb('校验ticket, 结果是 %s', JSON.stringify(result))
    this.ctx.logger.info('校验ticket, 结果是 %s', JSON.stringify(result))

    if(!result || result.code !== 0) {
      return {
        success: false,
        msg: result && result.msg || ''
      };
    }
    return result.data;
  }

  /**
   * 
   * @param {*} user md5版本的password
   */
  async getTokenByUsername(user) {
    
    const {username, password} = user

    const portalConfig= this.app.config['passportJyb']
    const {client_id, secret_key}  =  portalConfig
    const secret_key2 = md5(username+ '-' + password + '-' + client_id + '-' + secret_key)
    
    
    // 获取目标环境IP和微服务信息
    const param = {
      "cmd": portalConfig.cmd['getTokenByUsername'],
      "data": {
          "username": username,
          "password": password,
          "client_id": client_id,
          "secret_key": secret_key2
        }
      }
    
    const result = await  this.ctx.helper.passportSendNormalRequest(portalConfig['portal']['portal_url'], param)

    debugPassportJyb('校验用户中心用户名和密码, 结果是 %s', JSON.stringify(result))
    
    
    if(!result || result.code !== 0) {
      return false;
    }
    return result.data;
  }

  /**
   * 
   * @param {*} user_id 
   */
  async getUserByUseId(userId) {
    const portalConfig= this.app.config['passportJyb']
    const {cmd, client_id, secret_key}  =  portalConfig;
    const secret_key2 = md5(userId+ '-' + secret_key);
    
    
    // 获取目标环境IP和微服务信息
    const param = {
      "cmd": portalConfig.cmd['getUserByUseId'],
      "data": {
          "user_id": userId,
          "client_secret": secret_key,
          "secret_key": secret_key2
        }
      }

    const result = await  this.ctx.helper.passportSendNormalRequest(portalConfig['portal']['portal_url'], param)
    debugPassportJyb('通过用户中心id获取用户中心用户信息, 结果是 %s', JSON.stringify(result))
    
    if(!result || result.code !== 0) {
      return false;
    }
    return result.data;
  }

  async getTicketByUserId(userId) {

  }

  /**
   * 
   * @param {*} ticket 
   * @param {*} redirect_uri 用户中心同步登陆后的回来的重定向地址
   */
  async setLoginState(ticket, redirect_uri) {
    const portalConfig= this.app.config['passportJyb']
    const {client_id, secret_key}  =  portalConfig
    const secret_key2 = md5(ticket+'-'+redirect_uri+'-'+secret_key);

    const url = portalConfig['portal']['portal_set_login_url'] + '?ticket='+ticket+'&redirect_uri='+redirect_uri+'&client_id='+client_id+'&secret_key='+secret_key2;
    // this.ctx.redirect(url);
    return url;
  }
  
  /**
   * 
   * @param {*} redirect_uri  用户中心同步登出后的回来的重定向地址
   */
  async setLogOutState(redirect_uri) {
    const portalConfig= this.app.config['passportJyb']
    // const {client_id, secret_key, redirect_uri}  =  portalConfig
    const {client_id, secret_key}  =  portalConfig
    const secret_key2 = md5(redirect_uri+'-'+secret_key);

    const url = portalConfig['portal']['portal_set_logout_url'] + '?redirect_uri='+redirect_uri+'&client_id='+client_id+'&secret_key='+secret_key2;
    return url;
  }

  async updatePwd() {

  }

  async codeMap() {
    const portalConfig= this.app.config['passportJyb']
   
    const param = {
      "cmd": portalConfig.cmd['codeMap']
      }

    const result = await  this.ctx.helper.passportSendNormalRequest(portalConfig['portal']['portal_url'], param)


    if(!result || result.code !== 0) {
      return false;
    }
    return result.data;
  }

  // 获取业务系统授权用户列表

}

module.exports = PortalService;
