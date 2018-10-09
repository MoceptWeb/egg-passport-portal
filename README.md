# egg-passport-jyb

- 代码修改部分

  - 前端需要更改md5方式登录
  
  - egg部分配置config和plugin， 注意各个config的意思

## Install

```bash
$ npm i @node/egg-passport-jyb --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.passportJyb = {
  enable: true,
  package: 'egg-passport-jyb',
};
```


## Configuration

- 配置用户中心的某些属性
```js
/**
 * 主要配置    'menu_code': null,       // 运营中心所配置的系统的 sys_code 
    'client_id': null,        // 用户中心对应的系统的的sys_code 
    'secret_key': null,       //  用户中心对应的系统的secret_key
  其次 是 各种跳转的连接  selfSystem
 */

exports.passportJyb = {
    useMiddleware:   false //是否使用中间件
    clients: {
        mysqlOperate: {
             app: false,   // 是否使用passport插件的mysql连接 来连接运营中心数据库
            'userDBClient': null,     // 如果原系统已经使用连接了运营中心的数据库， 且只有一个连接， 则不配置； 有多个连接则指定db； 且只有在app = true 生效
            type: 'mysqlOperate',
            default: {
                database: null,
                connectionLimit: 5,
            },
            agent: false,
        }
    },
    'menu_code': null,       // 运营中心所配置的系统的 sys_code 
    'client_id': null,        // 用户中心对应的系统的的sys_code 
    'secret_key': null,       //  用户中心对应的系统的secret_key
    'selfSystem': {  
        'notify_uri': '/login',   // 在通过getTicket方法中，自身系统检生成Ticket之后的通知（回调）地址 或者未登录的回跳地址
        'redirect_uri': '/',    //在通过getTicket方法中，自身系统检测用登陆成功后返回的url参数中的redirect_uri
        'getLogin': '/login',    // 系统登录url
        'postlogin' : '/login/doLogin',  // 本系统登出地址
        'getLoginOut': '/login/loginOut',  // 本系统登出地址
        'noAuth': [] // 路由中间件支持配置可不用验证的 path 正则数组
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
```

- 数据库相关的配置
因为{app_root}/service/portal/user.js 和 menu.js 都直接操作了数据库， 所以用户需要配置对应的数据

see [config/config.default.js](config/config.default.js) for more detail.




## 其他说明
[用户中心后台文档](https://ones.ai/wiki/#/team/Tnb2S5Qj/space/AK7zckpi/page/Wke7F6cE)

- extend/context.js
 - passportLogin 进行用户中心登录
 - passportGetMenu 获取菜单

- service/portal
  - portal.js
    > 用户中心相关
    getTicket  ticket生成（重定向接口）
    verifyTicket ticket校验
    getTokenByUsername 用户名密码校验

    getUserByUseId  用户基本信息获取
    getTicketByUserId  根据identifier获取ticket

    setLoginState 同步登录状态
    setLogOutState  同步登出状态

    获取业务系统授权用户列表
    修改密码
  - user.js
    - 直接操作user数据表获取user信息
  - menu.js
    - 获取菜单相关


## Example

- login

```javascript
    const match = await this.ctx.passportLogin({
      username: user,
      password: pwd
    }, {setLoginState: true})

    if(match) {
      // 刷新csrftoken的值
      this.ctx.rotateCsrfSecret();
      // 写session
      this.ctx.session.userId = match.userId;
      this.ctx.session.userName = match.userName;
      // 登录成功
      // 看情况是否要进行全部用户登录，如果要，则需要前端自行跳转同步用户中心登录界面
      // const setLoginState = await this.service.portal.portal.setLoginState(match.ticket)
      this.ctx.body = errCode.LOGIN_SUCCESS;   

    } else {
      // 登录失败，用户名密码错误
      this.ctx.body = errCode.LOGIN_INVALID_PARAM;
    }

```

- menu
nodejs入口页 home.js
```javascript
    const menu = await this.ctx.passportGetMenuData();

    await this.ctx.render('layout/layout', {
      keywords: '加油宝,小贷,管理系统',
      description: '加油宝小贷管理系统',
      title: '小贷管理系统',
      menuList: JSON.stringify(menu),
      userInfo: JSON.stringify({
        userid: this.ctx.session.userId,
        userName: this.ctx.session.userName
      })
    });
```

- 数据库连接（多数据库）

配置(如果是单数据库直接连接了运营中心的表， 则不需要指定连接的数据库)
```javascript

config.mysql = {
    clients: {
      user: {
        host: '',
        port: 3306,
        user: '',
        password: '',
        database: ""
      }
    },
    app: true
  }

      // 'userDBClient': null,  
  config.passportJyb = {
    'userDBClient': 'user',     //  运营中心的user数据库所对应数据库连接, 不配置则默认连接的那个就是
  };

```

npm中 处理
```javascript
    const portalConfig= this.app.config['passportJyb']
    let mysqlConnect = null;
    if(portalConfig.userDBClient) {
      mysqlConnect = this.app.mysql.get(portalConfig.userDBClient)
    } else {
      mysqlConnect = this.app.mysql
    }
```


# 接入流程

- 用户中心对应client_id和secret_key的生成
请在用户中心对应环境新增自己的系统， 并在passport的config中对应配置
  - 如果不配置登录url则全部登录在用户中心， 所以如果要使用自身的登录页面请配置这个入口

## 代码类
### vue

- 登录
  - 使用 md5 加密密码登录
  - 登录成功之后调到 /

### node

  - 引入 @node/passportjyb插件
    - 用户中心
      在用户中心不通环境添加对应的client_id， 并将对应信息填写在config

    - 运营管理对应配置
     数据库， 以及系统sys_code
     
     ```javascript
    config.passportJyb = {
      isLoginRelatedOperate: true,   // 在用户中心登录后是否要去在运营中心找相关用户, 默认相关
       clients: {
        mysqlOperate: {
             app: false,   // 是否使用passport插件的mysql连接 来连接运营中心数据库
            'userDBClient': null,     // 如果原系统已经使用连接了运营中心的数据库， 且只有一个连接， 则不配置； 有多个连接则指定db； 且只有在app = true 生效
        }
    },
    'menu_code': 'lego_manage',  // 运营中心所配置的系统的 sys_code
    'client_id': 'lego_manage',         // 用户中心对应的系统的的sys_code 
    'secret_key': 'aa12b55645fb110f403efbf6bff23186',       //  用户中心对应的系统的secret_key
    'selfSystem': {  
      'noAuth': [/^\/lego\/syncCallback/]
    }
     ```
    - 关于数据库配置强调说明
    如果没有使用连接运营中心数据的数据库， 则 

    clients: {
        mysqlOperate: {
             app: true
        }

    如果使用方已经连接运营中心数据， 则 需要看时候是哪个userDBClient 是连接的db， 如果只有一个唯一的数据库连接， 则无需配置任何数据库选项
    clients: {
        mysqlOperate: {
            'userDBClient': null,     // 如果原系统已经使用连接了运营中心的数据库， 且只有一个连接， 则不配置； 有多个连接则指定db； 且只有在app = true 生效
        }

   - 关于用户中心配置子系统登录url问题, 以及自身系统和登录相关的url配置
     - 如果用户中心配置子系统url， 则跳转用户中心登录
     - 否则
     ```javascript
     'selfSystem': {  
        'notify_uri': '/',   // 在通过getTicket方法中，如果登录则是在用户中心生成Ticket之后的通知（回调）地址 ， 没有登录则是跳转到用户中心配置的login或用户中心登录页面输入用户名密码登录后的回调地址
        'redirect_uri': '/',    //在通过getTicket方法中，透传返回的url参数中的redirect_uri
        'loginOut_redirect_uri': '/',    //同步登出后的重定向地址redirect_uri
        'getLoginOut': '/login/loginOut',  // 本系统登出地址
        'loginIn_redirect_uri': '/',    // 同步登录后的重定向地址redirect_uri
        'noAuth': [/\/login\/doLogin/], // 无需auth验证的api， 默认加入post登录， 否则无法进行自身系统的登录post
        'getLogin': '/login',    // 本身系统页面登录url, 一般和用户中心配置的登录一致,
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
            },
            /**
             * 返回true则不继续执行
             * @param {} ctx 
             * @param {*} next 
             * @param {*} errMsg 
             */
            async errorPage(ctx, next, errMsg) {
                await ctx.render('error/error', {
                    errMsg: errMsg
                })
                return true;
            }
        },
        }
    },
    ```

  - 登录更改
   controller/login
  ```javascript
      const match = await this.ctx.passportLogin({
      username: user,
      password: pwd
    })

    if(match) {
      const operateUser = match.operateUser;
      try {
        const roleList = await this.service.login.loginService.findRole(operateUser.userId);
        if(roleList) {
          // 刷新csrftoken的值
          this.ctx.rotateCsrfSecret();
          // 写session， 兼容老版本中用的session; 如果修改不多， 尽量把所有的session改成使用passport中已经有的数据， 不用多余增加
          this.ctx.session.userid = operateUser.userId;
          this.ctx.session.userName = operateUser.userName;
          this.ctx.session.userAccount = operateUser.userAccount;
          this.ctx.session.userEmail = operateUser.email;
          this.ctx.logger.info('用户信息：'+ JSON.stringify(match));
          this.ctx.session.roles = roleList.map(role => {
            return role.role_id;
          });
          // 登录成功
          this.ctx.body = errCode.LOGIN_SUCCESS;
        }
  ```

  - 关于在其他页面清空session后本页面的无session控制
  
  ```javascript
  'hook': {
        async logoutCallbackbefore(ctx) {
          const {path} = ctx.request;
          const rules = [/^\/$/, /\/login/, /\/login\/loginOut/]
          
          const state = rules.find(rule => {
            if(rule.test(path)) {
              return true;
            }
          })

          if(!state) {
            ctx.body = {
              code: '1601000014',
              msg: '用户未登录'
            }
            return true;

          } else {
            return false;
          }

        }
      }
  ```

  然后对应前端service.js
  
  ```javascript
   if (code == "1601000014" || code == "1601000013") {
      Message({
        message: response.data.msg,
        type: 'error',
        duration: 3 * 1000
      });
      // 跳转去登录页
      // location.replace("/login?redirect=" + encodeURIComponent(location.href));
      location.replace("/login");
      return Promise.reject();
    }

  ```

  - 关于https访问等nginx
     - 需要在nginx中https部分中配置

       proxy_set_header is_https  1; 来识别跳转https
     - 需要配置nginx  host
     
       来正确识别访问的host
  - 关于登录页面已经有session

  自行在登录控制器中加入重定向， 因为插件默认如果有session则全部await next()， 否则登录页面还是可以直接访问

  ```javascript
    async loginPage() {
      if(this.ctx.session.passportJyb && this.ctx.session.passportJyb.user_id) {
        this.ctx.redirect('/');
        return;
      }

      await this.ctx.render('login/login', {
        keywords: '加油宝,管理系统',
        description: '加油宝管理系统',
        title: '登录'
      });
    }
  ```

  - 菜单获取和基本信息的返回给vue前端
  home.js
  ```javascript
    const operateUser = this.ctx.session.passportJyb.operateUser;

    const menu = await this.ctx.passportGetMenu(); 
    // 使用portUserId进行获取菜单 const menu = await this.ctx.passportGetMenu('', '', 3, portUserId)
    // 被动登录的session.useid 赋值
    if(!this.ctx.session.userid) {
      this.ctx.session.userid = operateUser.userId;
      this.ctx.session.userName = operateUser.userName;
      this.ctx.session.userAccount = operateUser.userAccount;
      this.ctx.session.userEmail = operateUser.email;
    }
    const userInfo = {
      userid: operateUser.userId,
      userName: operateUser.userName,
      userAccount: operateUser.userAccount,
      email: operateUser.email
    };
    await this.ctx.render('layout/layout', {
      keywords: '加油宝,小贷,管理系统',
      description: '加油宝小贷管理系统',
      title: '小贷管理系统',
      menuList: JSON.stringify(menu),
      userInfo: JSON.stringify(userInfo)
    });
  ```

## 辅助数据
用户中心用户数据结构

```javascript
user_id:"99"
user_name:"canye"
name:"刘XXX"
create_time:null
create_user_id:"0"
email:"xx.wu@jyblife.com"
identifier:"129"
is_oa_user:"1"
phone:"xxxxxx"
remark:""
right_codes:null
role_ids:null
update_time:"2018-04-13 18:48:58"
```

## todo

- 从哪里失效就从哪里去用户中心验证后回来
- 其他登出了， 该系统的session还在还是先用自己的， 没有被动登出（被动登录做了）


# 权限管理




