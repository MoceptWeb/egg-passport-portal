'use strict';

const debugPassportJyb = require('debug')('passportJyb')

const Service = require('egg').Service;

class MenuService extends Service {
  
  /**
   * 获取用户基本信息
   * @param {*} user 
   * @param {*} pwd sha1 版本的password
   */
  async getMenu1(userId, menu_code) {
    menu_code = menu_code || this.app.config['passportJyb'].menu_code;
    // const {menu_code} = this.app.config['passportJyb']
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const sql = `select * from t_sys_menu menu where exists (
      select 1 from t_sys_menu menu1 join t_privilege priv 
        on menu1.menu_code = priv.priv_code
        join t_role_priv r_priv on priv.priv_id= r_priv.priv_id
        join t_user_role role on role.role_id = r_priv.role_id
        where role.user_id =? and menu1.menu_code = priv.priv_code
        and menu1.menu_status=1 and sys_code=? and menu1.menu_type=2
        and menu.menu_id= menu1.p_menu_id	
    ) and menu_status=1 and sys_code=? and menu_type=1  order by menu_order;`
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const queryResult = await this.ctx.helper.passportMysqlQuery(sql, [userId, menu_code, menu_code]);
    debugPassportJyb('通过运营用户id获取用户中心一级菜单, 结果是 %s', JSON.stringify(queryResult))
    
    return queryResult;
  }

  async getMenu2(userId, menu_code) {
    menu_code = menu_code || this.app.config['passportJyb'].menu_code
    const sql = `select * from t_sys_menu menu where exists(
      select 1 from t_privilege priv join t_role_priv r_priv on priv.priv_id= r_priv.priv_id
        join t_user_role role on role.role_id = r_priv.role_id
         where role.user_id =? and menu.menu_code = priv.priv_code
        ) and menu_status=1 and sys_code=? and menu_type=2  order by menu_order;`
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const queryResult = await this.ctx.helper.passportMysqlQuery(sql, [userId, menu_code]);
    debugPassportJyb('通过运营用户id获取用户获取用户中心二级菜单, 结果是 %s', JSON.stringify(queryResult))
    return queryResult;
  }


}

module.exports = MenuService;
