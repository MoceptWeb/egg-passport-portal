# egg-passport-jyb

通用的和用户中心交互， 以及获取在运用中心的配置的用户菜单权限

- 用户中心
  - 用户中心登录
    登录完后重定向到用户中心同步登录
  - 新的用户中心用户用该npm的处理
    新用户登录： 如果直接通过user_center_id 找不到， 则再次用email验证， 如果email都找不到对应的人， 则在用户中心中查找这个用户的信息，并在运营中心中增加这个user
    
- 运营中心菜单获取
前端使用 @jyb/common-menu 进行配合使用


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

  - 前端需要更改md5方式登录， 以及使用 @jyb/common-menu 包格式化菜单展示， 以及路由文件的显示
  
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
    'userDBClient': null,     //  运营中心的user数据库所对应数据库连接, 不配置则默认连接的那个就是
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
    const menu = （await this.ctx.passportGetMenuData(this.ctx.session.userId)） || [];

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
        host: '172.16.1.13',
        port: 3306,
        user: 'jiayoubao',
        password: 'root1234',
        database: "db_jyb_test"
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




## todo

- 从哪里失效就从哪里去用户中心验证后回来
- 其他登出了， 该系统的session还在还是先用自己的， 没有被动登出（被动登录做了）




