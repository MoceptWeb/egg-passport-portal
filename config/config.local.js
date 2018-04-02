'use strict';

/**
 * egg-passport-jybfault config
 * @member Config#passportJyb
 * @property {String} SOME_KEY - some description
 */

exports.passportJyb = {
    'client_id': 'operate_system',
    'secret_key': '4464fb906f4d7bc29cada6c510d0e2be',
    'portal': {
        "portal_url": "http://portal.jtjr.com/out/", //用户中心接口地址
        "portal_get_ticket_url": "http://portal.jtjr.com/system/getTicket", //获取ticketurl
        "portal_change_pwd_url": "http://portal.jtjr.com/site/updatePwd", //用户中心修改密码url
        "portal_notify_url": "http://pms.jtjr.com/site/login", //用户中心回调url
        "portal_set_login_url": "http://portal.jtjr.com/site/setLoginState", //用户中心设置登录
        "portal_set_logout_url": "http://portal.jtjr.com/site/setLogOutState" //用户中心设置退出
    }
};