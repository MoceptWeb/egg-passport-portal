const debugPassportJyb = require('debug')('passportJyb')

module.exports = (options, app) => {
  /**
   * 1、是否有session
   *  有session
   *   1.1 没有setLoginState 则去同步登录
   *   2.1 登出路由则同步登录
   *   3.1 正常需要session 的api 正常next
   * 2、没有session
   *    2.1 登录接口 post等无需权限的接口
   *    2.2 不是登录接口的其他所有接口， 先去用户中心校验getticket信息
   *           2.2.1. 全部先getticket， getTicketState === 1
   *                 2.2.1.1  code === 0 则用户在用户中心有登录状态， 然后检验ticket
   *                     2.2.1.1.1  ticket 失败   跳转 getLogin?code=-2 
   *                     2.2.1.1.2  ticket 成功   getTicketState: 2
   *                 2.2.1.2  code !== 0 则失败
                        跳转 getLogin?code=-2 
   * 
   *           （2）去getTicket校验过的真code === -2  才能不去getTicket， 跳转到logingetTicketState === 0 表示验证失败
   *           （4）在 getTicketState === 0 进去登陆后为了让用户能够再次getticket则重置
   * 
   * getTicketState :   0 校验失败后的状态 （密码登录的失败， 和同步登陆的失败）   1 get tikcet后状态    2 获得url中ticket并校验成功的状态
   */ 
        
  return async function passportJybAuth(ctx, next) {

    const customNext = async function (ctx, next, hook) {
      await hook.after(ctx)
      await next();
      return false;
    }
    
    const passportJyb = ctx.session && ctx.session.passportJyb || {};
    const {user_id, user_name, ticket, setLoginState, getTicketState}  = passportJyb;

    const {url: requestUrl, path: requestPath, origin: originUrl} = ctx.request;
    const portalConfig= ctx.app.config['passportJyb']['selfSystem']
    const hook = portalConfig.hook

    if(await hook.before(ctx)) {
      await customNext(ctx, next, hook) 
    }

    Object.keys(portalConfig).forEach(key => {
      if(['redirect_uri', 'notify_uri', 'loginOut_redirect_uri', 'loginIn_redirect_uri', 'getLogin'].indexOf(key) !== -1 && !/^http/.test(portalConfig[key])) {
        portalConfig[key] = originUrl +  portalConfig[key]
      }
    });
    const {redirect_uri, notify_uri, loginOut_redirect_uri, loginIn_redirect_uri, getLogin,  getLoginOut, noAuth } = portalConfig;

    if((user_id && user_name)) {
      if(setLoginState !== 1) {
        // 同步登陆
        const setLoginStateUrl = await ctx.service.portal.portal.setLoginState(ticket.ticket, loginIn_redirect_uri)
        debugPassportJyb(`[egg-passport-jyb] 同步登陆, 当前url: ${requestUrl},  setLoginStateUrl: ${setLoginStateUrl}`);
        ctx.session.passportJyb.setLoginState = 1;
        ctx.redirect(setLoginStateUrl)
      } else if (requestPath === getLoginOut)  {
        // 同步登出
        const setLogOutStateUrl = await ctx.service.portal.portal.setLogOutState(loginOut_redirect_uri);
        debugPassportJyb(`[egg-passport-jyb] 同步登出, 当前url: ${requestUrl},  setLogOutStateUrl: ${setLogOutStateUrl}`);
        ctx.session = null;
        ctx.redirect(setLogOutStateUrl);
      } else {
        // 正常的api
        await customNext(ctx, next, hook) 
      }
    } else if(ctx.helper.passportIsAllowUrl(noAuth, requestPath)) {
      // 只有登录api不需要session 或配置项
      debugPassportJyb(`[egg-passport-jyb] 无需登录的接口： 当前url: ${requestUrl}`);
      ctx.session.passportJyb = Object.assign({}, ctx.session.passportJyb,{getTicketState: null})
      await customNext(ctx, next, hook) 

    } else {

      if(await hook.logoutCallbackbefore(ctx)) {
         return false;
      }

      // 这里是ticket相关的操作

      const {ticket: ticketUrl, code} = ctx.request.query;
      if(ticketUrl && code === '0' && getTicketState === 1) {
        const verifyTicket = await ctx.passportLoginByTicket(ticketUrl);
        if(verifyTicket && verifyTicket.success !== false) {
          ctx.session.passportJyb = Object.assign({}, ctx.session.passportJyb, {getTicketState: 2})
          debugPassportJyb(`[egg-passport-jyb] ticket校验成功： 当前url: ${requestUrl}， 跳转loginIn_redirect_uri： ${loginIn_redirect_uri}`);
          ctx.redirect(loginIn_redirect_uri)
        } else {
          debugPassportJyb(`[egg-passport-jyb] ticket校验失败： 当前url: ${requestUrl}, `);
          if(await hook.errorPage(ctx, next, {msg: verifyTicket.msg})) {
            return false;
          } else {
            await customNext(ctx, next, hook) 
          }
        }
      } else if(code && code !== '0' && getTicketState === 1) { 
        //['-2', '-1', '-11', '-12'].indexOf(code) !== -1 
        // 修复用户中心抽风 -1 时候回到初始页面导致next
        // if(code === '-1') {
        //   ctx.redirect(getLogin + '?code=--100')
        //   return ;
        // }

        // 这里是getticket 错误或登录失败， 和ticket校验失败的回调地址
        debugPassportJyb(`[egg-passport-jyb] getticket或最终ticket校验失败： 当前url: ${requestUrl}, 跳转的就是当前url， 因为发生此错误一定要去的是登录页面`);
        ctx.session.passportJyb = Object.assign({}, ctx.session.passportJyb, {getTicketState: 0}) 

      
        if(await hook.errorPage(ctx, next, {code})) {
          return false;
        } else {
          await customNext(ctx, next, hook) 
        }
      } else {
        // 无ticket直接去用户中心验证
        const ticketUrl = await ctx.service.portal.portal.getTicket({redirect_uri: redirect_uri, notify_uri: notify_uri})
        debugPassportJyb(`[egg-passport-jyb] getticket： 当前url: %s, ticketUrl： %s`, requestUrl, ticketUrl);
        ctx.session.passportJyb = Object.assign({}, ctx.session.passportJyb,{getTicketState: 1})
        ctx.redirect(ticketUrl);
      }
      
    }


  }
}