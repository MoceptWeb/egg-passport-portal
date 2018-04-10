'use strict';

/**
 * egg-passport-jybfault config
 * @member Config#passportJyb
 * @property {String} SOME_KEY - some description
 */

exports.passportJyb = {
    clients: {
        mysqlOperate: {
            host: '10.4.33.63',
            port: 3306,
            user: 'jybsit',
            password: 'SITYHNBGT',
            database: "db_jyb"
        }
    },
    'client_id': 'operate_system',
    'secret_key': 'aa12b55645fb110f403efbf6bff23186',
    'portal': {
        "portal_url": "http://u.sit.jyblife.com/out/", //用户中心接口地址
        "portal_get_ticket_url": "http://u.sit.jyblife.com/system/getTicket", //获取ticketurl
        "portal_change_pwd_url": "http://u.sit.jyblife.com/site/updatePwd", //用户中心修改密码url
        "portal_notify_url": "http://u.sit.jyblife.com/site/login", //用户中心回调url
        "portal_set_login_url": "http://u.sit.jyblife.com/site/setLoginState", //用户中心设置登录
        "portal_set_logout_url": "http://u.sit.jyblife.com/site/setLogOutState" //用户中心设置退出
    }
};