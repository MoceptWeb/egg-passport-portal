以lego为例
# 数据类
- 脚本portShell 同步

- 菜单的新增
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

# vue

- 路由拆分
为路由数据和引入两个文件
- 菜单格式化
 walkroute
- 登录
  - 使用 md5
  - 登录成功之后调到 /

- node

  - 引入 @node/passportjyb插件
    - 用户中心
      相关人员的在“运营系统”这个领域

    - 运营管理对应配置
     数据库， 以及系统sys_code
     
     ```javascript
    'userDBClient': null,     //  运营中心的user数据库所对应数据库连接, 不配置则默认连接的那个就是
    'menu_code': null,       // 运营中心所配置的系统的 sys_code 
    'client_id': null,        // 用户中心对应的系统的的sys_code 
    'secret_key': null,       //  用户中心对应的系统的secret_key
     ```

  - 登录更改
 
  ```javascript
      const match = await this.ctx.passportLogin({
      username: user,
      password: pwd
    })
  ```

  - 菜单获取和基本信息的返回给vue前端
  home.js
  ```javascript
      const operateUser = this.ctx.session.passportJyb.operateUser;

    const menu = (await this.ctx.passportGetMenu(operateUser.userId)) || []; 
    
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

