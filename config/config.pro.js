'use strict';

/**
 * egg-passport-jybfault config
 * @member Config#passportJyb
 * @property {String} SOME_KEY - some description
 */

exports.passportJyb = {
    clients: {
        mysqlOperate: {
            host: '10.23.143.124',
            port: 3306,
            user: 'jybread',
            password: 'Pub@read$sh18;;',
            database: "db_jyb"
        }
    },
    'client_id': 'operate_system',
    'secret_key': '4464fb906f4d7bc29cada6c510d0e2be',
    'portal': {
        "portal_url": "http://u.jyblife.com/out/", //用户中心接口地址
        "portal_get_ticket_url": "http://u.jyblife.com/system/getTicket", //获取ticketurl
        "portal_change_pwd_url": "http://u.jyblife.com/site/updatePwd", //用户中心修改密码url
        "portal_notify_url": "http://pms.jtjr.com/site/login", //用户中心回调url
        "portal_set_login_url": "http://u.jyblife.com/site/setLoginState", //用户中心设置登录
        "portal_set_logout_url": "http://u.jyblife.com/site/setLogOutState" //用户中心设置退出
    }
};