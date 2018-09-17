'use strict';

/**
 * egg-passport-jybfault config
 * @member Config#passportJyb
 * @property {String} SOME_KEY - some description
 */

exports.passportJyb = {
    // 用于单例生成
    clients: {
        mysqlOperate: {
            host: '172.16.1.13',
            port: 3306,
            user: 'jiayoubao',
            password: 'root1234',
            database: "db_jyb_test"
        }
    },
    'client_id': 'operate_system',
    'secret_key': '4464fb906f4d7bc29cada6c510d0e2be',
    'portal': {
        "portal_url": "http://portal.dev.jtjr.com/out/", //用户中心接口地址
        "portal_get_ticket_url": "http://portal.dev.jtjr.com/system/getTicket", //获取ticketurl
        "portal_change_pwd_url": "http://portal.dev.jtjr.com/site/updatePwd", //用户中心修改密码url
        "portal_notify_url": "http://pms.jtjr.com/site/login", //用户中心回调url
        "portal_set_login_url": "http://portal.dev.jtjr.com/site/setLoginState", //用户中心设置登录
        "portal_set_logout_url": "http://portal.dev.jtjr.com/site/setLogOutState" //用户中心设置退出
    }
};