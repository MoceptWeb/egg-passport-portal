'use strict';

/**
 * egg-passport-jyb default config
 * @member Config#passportJyb
 * @property {String} SOME_KEY - some description
 */

/**
 * 主要配置    'menu_code': null,       // 运营中心所配置的系统的 sys_code 
    'client_id': null,        // 用户中心对应的系统的的sys_code 
    'secret_key': null,       //  用户中心对应的系统的secret_key
  其次 是 各种跳转的连接  selfSystem
 */

exports.passportJyb = {
    'userDBClient': null,     //  运营中心的user数据库所对应数据库连接, 不配置则默认连接的那个就是
    'menu_code': null,       // 运营中心所配置的系统的 sys_code 
    'client_id': null,        // 用户中心对应的系统的的sys_code 
    'secret_key': null,       //  用户中心对应的系统的secret_key
    'selfSystem': {  
        'notify_uri': '/login',   // 在通过getTicket方法中，自身系统检生成Ticket之后的通知（回调）地址 或者未登录的回跳地址
        'redirect_uri': '/',    //在通过getTicket方法中，透传返回的url参数中的redirect_uri
        'getLogin': '/login',    // 系统登录url, *** 这里必须在用户中心中同步配置子系统登录url ***， 不然默认都抛到用户中心登录界面
        'postlogin' : '/login/doLogin',  // 本系统登出地址
        'getLoginOut': '/login/loginOut',  // 本系统登出地址
        'noAuth': [] // 无需auth验证的api
    },
    'cmd': {
        'getTicketByUserId': '80010001',
        'verifyTicket': '80010002',
        'getTokenByUsername': '80010003',
        'getUserByUseId': '80010004',
     },


    'menu': {
    },
    'user': {
        'default_pwd': 'jyb123456',   // 从用户中心新增过来的默认t_user密码
    }
};