'use strict';

const Service = require('egg').Service;

const sha1 = require('sha1')

class UserService extends Service {
  
  /**
   * 获取用户基本信息
   * @param {*} user 
   * @param {*} pwd sha1 版本的password
   */
  async findByPwd(user, pwd) {
    const mysqlConnect = await this.ctx.helper.passportMysqlConnect();
    
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const queryResult = await mysqlConnect.get('t_user', {user_account: user, user_pwd: pwd});
    return queryResult;
  }

  async findByPortalUserId(portalUserID) {
    const mysqlConnect = await this.ctx.helper.passportMysqlConnect();
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const queryResult = await mysqlConnect.get('t_user', {user_center_id: portalUserID});
    // const queryResult = await this.app.mysql.get('t_user', {portal_userID: portalUserID});
    return queryResult;
  }

  async findByMail(portalUser) {
    const {email} = portalUser
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const sql = "select user_id from t_user where mail = ?";
    const queryResult = await this.ctx.helper.passportMysqlQuery(sql, [email]);
    // 只能有一个邮箱匹配上， 不然log
    if(queryResult) {
      if(queryResult.length > 1) {
        this.ctx.logger.error(JSON.stringify(portalUser) + '根据邮箱匹配有超过两条数据');
        return false;
      } else {
         return queryResult[0];
      }
    } else {
      return false;
    }
  }
  
  /**
   * 1、如果有对应portalUserId  直接登录，没有则获取对应用户信息
   * 2、根据用户中心的邮箱进行匹配， 只有匹配到一个的时候才进行更新 mail和portalUserId； 找到多个邮箱error
   * 3、没有邮箱或邮箱一个都没找到新增
   * @param {*} portalUserId 
   */
  async find2add(portalUserId) {
    const portalUser = await this.service.portal.portal.getUserByUseId(portalUserId)

    let newUser = null;
    if(portalUser.email) {
      const isFindByMail = await this.findByMail(portalUser)
      if(isFindByMail) {
        newUser = await this.updateUserByEmail(isFindByMail, portalUser)
      } else {
        // 邮箱没匹配直接新增
        newUser = await this.addUser(portalUser)
      }
    } else {
      // 没有邮箱直接新增
      newUser = await this.addUser(portalUser)
    }
    return newUser;
    
  }

  async addUser(portalUser) {
    const {default_pwd} = this.app.config['passportJyb']['user']
    const {name, user_name, phone, email, user_id } = portalUser
    const sql = "INSERT INTO t_user(user_name, user_account, tel, mail, user_pwd, user_center_id) VALUES (?, ?, ?, ?, ?, ?)";
    // const queryResult = await this.ctx.helper.passportMysqlQuery(sql, [name, user_name, email, sha1(default_pwd)]);    
    const queryResult = await this.ctx.helper.passportMysqlQuery(sql, [name, user_name, phone, email, default_pwd, user_id]);
    if(queryResult && queryResult.affectedRows == 1) {
      return {
        user_name: name,
        user_id: queryResult.insertId,
        user_account: user_name,
        mail: mail,
        tel: phone
      }
    } else {
      return false;
    }
    
  }
  // 通过邮箱更新
  async updateUserByEmail(dbUser, portalUser) {
    // update usercenter id  by  mail
    const {user_id: portalUserId, name, phone, email, user_name } = portalUser;
    const {user_id: userId} = dbUser;
    
    let sql = "UPDATE  t_user SET user_center_id = ? WHERE user_id = ?";
    let data = [portalUserId, userId]
    if(phone) {
      sql = "UPDATE  t_user SET user_center_id = ?, tel = ? WHERE user_id = ?";
      data = [portalUserId, phone, userId]
    }
    const queryResult = await this.ctx.helper.passportMysqlQuery(sql, data);
    if(queryResult && queryResult.affectedRows == 1) {
      return {
        user_name: name,
        user_id: userId,
        user_account: user_name,
        mail: mail,
        tel: phone
      }
    } else {
      return false;
    }
    
  }
  
}

module.exports = UserService;
