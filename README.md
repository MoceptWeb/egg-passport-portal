# egg-passport-jyb

## 如果需要使用该npm接入用户中心，请直接看下方 ```接入流程``` 步骤

- 调试
```
    "debug": "DEBUG=passportJyb egg-bin debug",
```

通用的和用户中心交互， 以及获取在运用中心的配置的用户菜单权限
- 用户中心
  - 用户中心登录
    登录完后重定向到用户中心同步登录
  - 新的用户中心用户用该npm的处理
    新用户登录： 如果直接通过user_center_id 找不到， 则再次用email验证， 如果email都找不到对应的人， 则在用户中心中查找这个用户的信息，并在运营中心中增加这个user
    
- 运营中心菜单获取



## 准备工作

- 菜单数据的生成
1. 先让运营中心对应负责人(刘永康)增加该系统的sys_code
- 'loan_manage' => '后台管理系统'

2. 新增一级和二级菜单
*** 新增的菜单的menu_code 请确保在单个系统内部是唯一的！！！， 而且该信息请必须和前端配置的路由信息一致！！！！***

menu_type:    1 父菜单  2 子菜单    3 按钮
menu_status   1 显示   2 隐藏    
menu_order:    
menu_code:  只有16个char


- 一级菜单

```sql
USE db_jyb_test;
DELETE FROM `db_jyb_test`.`t_sys_menu` WHERE sys_code='loan_manage';

INSERT INTO `db_jyb_test`.`t_sys_menu`( `p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) VALUES (NULL, 'lmfqhkgl', '#', '分期还款管理', '1', '1', 0, 'loan_manage', NULL);
INSERT INTO `db_jyb_test`.`t_sys_menu`(`p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) VALUES (NULL, 'lmfqxsgl', '#', '分期信审管理', '1', '1', 1, 'loan_manage', NULL);
INSERT INTO `db_jyb_test`.`t_sys_menu`(`p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) VALUES (NULL, 'lmfqyhgl', '#', '分期用户管理', '1', '1', 2, 'loan_manage', NULL);

```

- 二级菜单
```sql
INSERT INTO `db_jyb_test`.`t_sys_menu`(`p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) SELECT menu_id, 'lmddlb', '/order/orderList', '订单列表', '2', '1', 0, 'loan_manage', NULL FROM t_sys_menu WHERE menu_code ='lmfqhkgl' AND sys_code='loan_manage';

INSERT INTO `db_jyb_test`.`t_sys_menu`(`p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) SELECT menu_id, 'lmxslb', '/credit/list', '信审列表', '2', '1', 0, 'loan_manage', NULL FROM t_sys_menu WHERE menu_code ='lmfqxsgl' AND sys_code='loan_manage';

INSERT INTO `db_jyb_test`.`t_sys_menu`(`p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) SELECT menu_id, 'lmyhlb', '/user/list', '用户列表', '2', '1', 1, 'loan_manage', NULL FROM t_sys_menu WHERE menu_code ='lmfqyhgl' AND sys_code='loan_manage';
INSERT INTO `db_jyb_test`.`t_sys_menu`(`p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) SELECT menu_id, 'lmsxlb', '/user/creditList', '授信列表', '2', '1', 2, 'loan_manage', NULL FROM t_sys_menu WHERE menu_code ='lmfqyhgl' AND sys_code='loan_manage';

```
- 权限
```sql
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('loan_manage', '小贷管理系统', '1');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('lmfqhkgl', '分期还款管理', '1');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('lmddlb', '订单列表', '2');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('lmfqxsgl', '分期信审管理', '1');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('lmxslb', '信审列表', '2');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('lmfqyhgl', '分期用户管理', '1');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('lmyhlb', '用户列表', '2');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('lmsxlb', '授信列表', '2');
```
- 原始可回滚数据
```SQL
----- 下面是可以回滚的
SELECT menu_id FROM t_sys_menu WHERE menu_code ='lmfqhkgl' AND sys_code='loan_manage'
INSERT INTO `db_jyb_test`.`t_sys_menu`(`menu_id`, `p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) VALUES (471, NULL, 'lmfqhkgl', '#', '分期还款管理', '1', '1', 0, 'loan_manage', NULL);
INSERT INTO `db_jyb_test`.`t_sys_menu`(`menu_id`, `p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) VALUES (473, NULL, 'lmfqxsgl', '#', '分期信审管理', '1', '1', 1, 'loan_manage', NULL);
INSERT INTO `db_jyb_test`.`t_sys_menu`(`menu_id`, `p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) VALUES (475, NULL, 'lmfqyhgl', '#', '分期用户管理', '1', '1', 2, 'loan_manage', NULL);

----- 下面是可以回滚的
INSERT INTO `db_jyb_test`.`t_sys_menu`(`menu_id`, `p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) VALUES (472, 471, 'lmddlb', '/order/orderList', '订单列表', '2', '1', 0, 'loan_manage', NULL);
INSERT INTO `db_jyb_test`.`t_sys_menu`(`menu_id`, `p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) VALUES (474, 473, 'lmxslb', '/credit/list', '信审列表', '2', '1', 0, 'loan_manage', NULL);
INSERT INTO `db_jyb_test`.`t_sys_menu`(`menu_id`, `p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) VALUES (476, 471, 'lmyhlb', '/user/list', '用户列表', '2', '1', 1, 'loan_manage', NULL);
INSERT INTO `db_jyb_test`.`t_sys_menu`(`menu_id`, `p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) VALUES (477, 475, 'lmsxlb', '/user/creditList', '授信列表', '2', '1', 2, 'loan_manage', NULL);
```

                           
- 查询
  ```sql
  // 一级菜单
  select * from t_sys_menu menu where exists (
      select 1 from t_sys_menu menu1 join t_privilege priv 
        on menu1.menu_code = priv.priv_code
        join t_role_priv r_priv on priv.priv_id= r_priv.priv_id
        join t_user_role role on role.role_id = r_priv.role_id
        where role.user_id =186 and menu1.menu_code = priv.priv_code
        and menu1.menu_status=1 and sys_code='loan_manage' and menu1.menu_type=2
        and menu.menu_id= menu1.p_menu_id	
    ) and menu_status=1 and sys_code='loan_manage' and menu_type=1  order by menu_order;

   // 二级菜单
    select * from t_sys_menu menu where exists(
      select 1 from t_privilege priv join t_role_priv r_priv on priv.priv_id= r_priv.priv_id
        join t_user_role role on role.role_id = r_priv.role_id
         where role.user_id =186 and menu.menu_code = priv.priv_code
        ) and menu_status=1 and sys_code='loan_manage' and menu_type=2  order by menu_order;
  ```

- user_center_id的同步和使用
通过portaltShell 脚本


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
```javascript
    const menu = await this.ctx.passportGetMenuData(;

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
以lego为例
## 数据类
- 脚本portShell 同步（提前已经做好）
oa数据、用户中心、运营数据的同步

- 菜单的新增（可以使用sql新增， 也可以自行在运行系统中新增）
DELETE FROM `db_jyb_test`.`t_sys_menu` WHERE sys_code='lego_manage';

```SQL
 /* 一级菜单*/
INSERT INTO `db_jyb_test`.`t_sys_menu`( `p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) VALUES (NULL, 'act', '#', '活动配置管理', '1', '1', 0, 'lego_manage', 'iconfont icon-lihe');
INSERT INTO `db_jyb_test`.`t_sys_menu`( `p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) VALUES (NULL, 'legoFE', '#', '页面配置管理', '1', '1', 1, 'lego_manage', 'iconfont icon-lihe');
INSERT INTO `db_jyb_test`.`t_sys_menu`( `p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) VALUES (NULL, 'template', '#', '组件模板管理', '1', '1', 2, 'lego_manage', 'iconfont icon-guanzhu');
INSERT INTO `db_jyb_test`.`t_sys_menu`( `p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) VALUES (NULL, 'entry', '#', '活动入口配置', '1', '1', 3, 'lego_manage', 'iconfont icon-ziyouhuodong');

/* 二级菜单 */
/* 活动配置管理 /act act  : 活动列表 /act/list  actList  新增活动  /act/edit newAct 命令字列表 /act/cmdList cmdList 规则/动作列表 /act/paramsList  filterList
*/  

INSERT INTO `db_jyb_test`.`t_sys_menu`(`p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) SELECT menu_id, 'actList', '/act/list', '活动列表', '2', '1', 1, 'lego_manage', NULL FROM t_sys_menu WHERE menu_code ='act' AND sys_code='lego_manage';
INSERT INTO `db_jyb_test`.`t_sys_menu`(`p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) SELECT menu_id, 'newAct', '/act/edit', '新增活动', '2', '1', 2, 'lego_manage', NULL FROM t_sys_menu WHERE menu_code ='act' AND sys_code='lego_manage';
INSERT INTO `db_jyb_test`.`t_sys_menu`(`p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) SELECT menu_id, 'cmdList', '/act/cmdList', '命令字列表', '2', '1', 3, 'lego_manage', NULL FROM t_sys_menu WHERE menu_code ='act' AND sys_code='lego_manage';
INSERT INTO `db_jyb_test`.`t_sys_menu`(`p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) SELECT menu_id, 'filterList', '/act/paramsList', '规则/动作列表', '2', '1', 4, 'lego_manage', NULL FROM t_sys_menu WHERE menu_code ='act' AND sys_code='lego_manage';
/* 组件模板管理 /template template : 规则树模板列表 /template/templateList  templateList */ 

INSERT INTO `db_jyb_test`.`t_sys_menu`(`p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) SELECT menu_id, 'templateList', '/template/templateList', '规则树模板列表', '2', '1', 1, 'lego_manage', NULL FROM t_sys_menu WHERE menu_code ='template' AND sys_code='lego_manage';
/* 页面配置管理 /lego  legoFE  : 乐高页面列表  /lego/pageList  pageList   乐高组件集合  /lego/componentList componentList */ 
INSERT INTO `db_jyb_test`.`t_sys_menu`(`p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) SELECT menu_id, 'pageList', '/lego/pageList', '乐高页面列表', '2', '1', 1, 'lego_manage', NULL FROM t_sys_menu WHERE menu_code ='legoFE' AND sys_code='lego_manage';
INSERT INTO `db_jyb_test`.`t_sys_menu`(`p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) SELECT menu_id, 'componentList', '/lego/componentList', '乐高组件集合', '2', '1', 1, 'lego_manage', NULL FROM t_sys_menu WHERE menu_code ='legoFE' AND sys_code='lego_manage';
/* 系统设置  /system system  : 同步配置  /system/sync  systemSync */ 

/*活动入口配置  /entry entry : 入口配置 /entry/list entryList 入口活动列表 /entry/entryActList entryActList */
INSERT INTO `db_jyb_test`.`t_sys_menu`(`p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) SELECT menu_id, 'entryList', '/entry/list', '入口配置', '2', '1', 1, 'lego_manage', NULL FROM t_sys_menu WHERE menu_code ='entry' AND sys_code='lego_manage';
INSERT INTO `db_jyb_test`.`t_sys_menu`(`p_menu_id`, `menu_code`, `menu_url`, `menu_name`, `menu_type`, `menu_status`, `menu_order`, `sys_code`, `icon_name`) SELECT menu_id, 'entryActList', '/entry/entryActList', '入口活动列表', '2', '1', 2, 'lego_manage', NULL FROM t_sys_menu WHERE menu_code ='entry' AND sys_code='lego_manage';


/* 权限*/
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('lego_manage', '乐高管理系统', '1');

INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('act', '活动配置管理', '1');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('legoFE', '页面配置管理', '1');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('template', '组件模板管理', '1');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('entry', '活动入口配置', '1');

INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('actList', '活动列表', '2');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('newAct', '新增活动', '2');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('cmdList', '命令字列表', '2');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('filterList', '规则/动作列表', '2');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('templateList', '规则树模板列表', '2');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('pageList', '乐高页面列表', '2');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('componentList', '乐高组件集合', '2');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('entryList', '入口配置', '2');
INSERT INTO `db_jyb_test`.`t_privilege`(`priv_code`, `priv_name`, `priv_type`) VALUES ('entryActList', '入口活动列表', '2');

```

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
    如果使用方没有连接运营中心数据， 则 

    clients: {
        mysqlOperate: {
             app: true
        }

    如果使用方没有连接运营中心数据， 则 需要看时候是哪个userDBClient 是连接的db， 如果只有一个唯一的数据库连接， 则无需配置任何数据库选项
    clients: {
        mysqlOperate: {
            'userDBClient': null,     // 如果原系统已经使用连接了运营中心的数据库， 且只有一个连接， 则不配置； 有多个连接则指定db； 且只有在app = true 生效
        }

   - 关于用户中心配置子系统登录url问题, 以及自身系统和登录相关的url配置
     - 如果用户中心配置子系统url， 则跳转用户中心登录
     - 否则
     ```
     'selfSystem': {  
        'notify_uri': '/',   // 在通过getTicket方法中，如果登录则是在用户中心生成Ticket之后的通知（回调）地址 ， 没有登录则是跳转到用户中心配置的login或用户中心登录页面输入用户名密码登录后的回调地址
        'redirect_uri': '/',    //在通过getTicket方法中，透传返回的url参数中的redirect_uri
        'loginOut_redirect_uri': '/',    //同步登出后的重定向地址redirect_uri
        'getLoginOut': '/login/loginOut',  // 本系统登出地址
        'loginIn_redirect_uri': '/',    // 同步登录后的重定向地址redirect_uri
        'noAuth': [/\/login\/doLogin/], // 无需auth验证的api， 默认加入post登录， 否则无法进行自身系统的登录post
        'getLogin': '/login',    // 本身系统页面登录url, 一般和用户中心配置的登录一致
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

  - 菜单获取和基本信息的返回给vue前端
  home.js
  ```javascript
    const operateUser = this.ctx.session.passportJyb.operateUser;

    const menu = await this.ctx.passportGetMenu(); 
    
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

## todo

- 从哪里失效就从哪里去用户中心验证后回来
- 其他登出了， 该系统的session还在还是先用自己的， 没有被动登出（被动登录做了）




