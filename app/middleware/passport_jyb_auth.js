module.exports = (options, app) => {
  /**
   * 1、是否有session
   *  有session
   *   （1） 根路由但是没有setLoginState 则去同步登录
   *   （2） 登出路由则同步登录
   *    （3） 正常需要session 的api 正常next
   * 没有session
   *    （1）登录接口 post （只有登录api不需要session）
   *    （2）不是登录接口的其他所有接口， 先去用户中心校验信息
   *           （1）全部先getticket
   *           （2）用户中心校验后getTicketState === 1 的真code才去ticket校验
   *          （3）去getTicket校验过的真code === -2  才能不去getTicket， 跳转到logingetTicketState === 0 表示验证失败
   *           （4）在 getTicketState === 0 进去登陆后为了让用户能够再次getticket则重置
   * 
   * getTicketState : 1 正在get校验   0 校验错误  2 获得url中ticket并校验
   */ 
        
  return async function passportJybAuth(ctx, next) {
    
    const passportJyb = ctx.session && ctx.session.passportJyb || {};
    const {user_id, user_name, ticket, setLoginState, getTicketState}  = passportJyb;

    const portalConfig= ctx.app.config['passportJyb']['selfSystem']
    const {redirect_uri, notify_uri, getLogin, postlogin, getLoginOut, noAuth} = portalConfig;
    const {url: requestUrl, path: requestPath, origin: originUrl} = ctx.request;
    if((user_id && user_name)) {
      if(/^\/[^?#]/.test(requestPath) === false && setLoginState !== 1) {
        // 根路由，同步登陆
        const setLoginStateUrl = await ctx.service.portal.portal.setLoginState(ticket.ticket, originUrl)
        ctx.session.passportJyb.setLoginState = 1;
        ctx.redirect(setLoginStateUrl)
      } else if (requestPath === getLoginOut)  {
        // 同步登出
        const setLogOutStateUrl = await ctx.service.portal.portal.setLogOutState(originUrl + redirect_uri);
        ctx.session = null;
        ctx.redirect(setLogOutStateUrl);
      } else {
        // 正常的api
        await next();
      }
    } else if((getTicketState === 0 && requestPath === postlogin) || ctx.helper.isAllowUrl(noAuth, requestPath)) {
      // 只有登录api不需要session 或配置项
      ctx.session.passportJyb = Object.assign({}, ctx.session.passportJyb,{getTicketState: null})
      await next();
    } else {
      // 这里是ticket相关的操作

      const {ticket: ticketUrl, code} = ctx.request.query;
      if(ticketUrl && code === '0' && getTicketState === 1) {
        const verifyTicket = await ctx.passportLoginByTicket(ticketUrl);
        ctx.session.passportJyb = Object.assign({}, ctx.session.passportJyb, {getTicketState: 2})
        if(verifyTicket) {
          ctx.redirect(redirect_uri)
        } else {
          ctx.redirect(notify_uri)
        }
      } else if(code === '-2' && getTicketState === 1) {
        // 去getTicket校验过的真code === -2  才能不去getTicket
        // 这里是notify_uri: login的get地址
        ctx.session.passportJyb = Object.assign({}, ctx.session.passportJyb, {getTicketState: 0}) 
        await next();
      } else {
        // 无ticket直接去用户中心验证
        const ticketUrl = await ctx.service.portal.portal.getTicket({redirect_uri: originUrl + redirect_uri, notify_uri: originUrl + notify_uri})
        ctx.session.passportJyb = Object.assign({}, ctx.session.passportJyb,{getTicketState: 1})
        ctx.redirect(ticketUrl);
      }
      
    }





    /* if (/^\/login/.test(requestUrl)) {
      await next();
    } else {
      if(!userId || !userName) {
        
        // ctx.redirect(url);
        ctx.redirect('/login');
      } else {
        await next();
      }
    }
 */

  }
}