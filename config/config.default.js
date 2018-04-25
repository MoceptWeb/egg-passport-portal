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
    isLoginRelatedOperate: true,   // 在用户中心登录后是否要去在运营中心找相关用户
    clients: {
        mysqlOperate: {
            type: 'mysqlOperate',
            'userDBClient': null,     // 如果isUseDefaultMySql = false 运营中心的user数据库所对应数据库连接, 不配置则默认连接的那个就是   
            default: {
                database: null,
                connectionLimit: 5,
            },
            app: false,   // 是否使用插件的mysql连接 来连接运营中心数据库
            agent: false
        }
    },
    'menu_code': null,       // 运营中心所配置的系统的 sys_code 
    'client_id': null,        // 用户中心对应的系统的的sys_code 
    'secret_key': null,       //  用户中心对应的系统的secret_key
    'selfSystem': {  
        'notify_uri': '/',   // 在通过getTicket方法中，如果登录则是在用户中心生成Ticket之后的通知（回调）地址 ， 没有登录则是跳转到用户中心配置的login或用户中心登录页面输入用户名密码登录后的回调地址
        'redirect_uri': '/',    //在通过getTicket方法中，透传返回的url参数中的redirect_uri
        'loginOut_redirect_uri': '/',    //同步登出后的重定向地址redirect_uri
        'getLoginOut': '/login/loginOut',  // 本系统登出地址
        'loginIn_redirect_uri': '/',    // 同步登录后的重定向地址redirect_uri
        'noAuth': [/\/login\/doLogin/], // 无需auth验证的api， 默认加入post登录， 否则无法进行自身系统的登录post
        'getLogin': '/login',    // 本身系统页面登录url, 一般和用户中心配置的登录一致
        // 'postlogin' : '/login/doLogin',  // 本系统登录地址
        'hook': {
            /**
             * 在中间件执行前执行该方法， 如果返回true则直接next执行自己系统的方法
             * @param {*} ctx 
             */
            async before(ctx)  {
                return false;
            },
            /**
             * 在next前执行的方法
             * @param {*} ctx 
             */
            async after(ctx) {
                return false;
            },
            /**
             * 没有用户信息且不再无需登录的接口中, 如果返回true则直接停止插件的中间件执行， 使用自身系统
             * @param {*} ctx 
             */
            async logoutCallbackbefore(ctx, next) {
                return false;
            }
        }
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