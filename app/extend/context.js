'use strict';
const debugPassportJyb = require('debug')('passportJyb')

module.exports = {

  async passportLogin(user, options) {

    let portalResult = await this.service.portal.portal.getTokenByUsername(user)

    if(!portalResult) {
      return false;
    }
    const userDb = await this.passportGetUserByIdentifier(portalResult, options)
    return userDb;
  },
  async passportLoginByTicket(ticket, user, options) {
    const verifyTicket = await this.service.portal.portal.verifyTicket(ticket);
    if(!verifyTicket) {
      return false;
    }
    verifyTicket.ticket = ticket;
    const dbUser = await this.passportGetUserByIdentifier(verifyTicket, options)
    return dbUser;
  },

  async passportGetUserByIdentifier (portalResult, options) {
      debugPassportJyb('通过用户中心id找运营用户， 用户中心用户信息 %s', JSON.stringify(portalResult))
      if(this.app.config.passportJyb.isLoginRelatedOperate) {
        // t_user
        let dbUserResult = await this.service.portal.user.findByPortalUserId( portalResult.identifier)

        // 新用户登录： 如果直接通过user_center_id 找不到， 则再次用email验证， 如果email都找不到对应的人， 则在用户中心中查找这个用户的信息，并在运营中心中增加这个user
        if(!dbUserResult) {
          dbUserResult = await this.service.portal.user.find2add(portalResult.identifier);
          debugPassportJyb('新建用户登录 %s', JSON.stringify(dbUserResult))
        }
    
        if(!dbUserResult) {
          // todo 显示更新用户失败？
          return false;
        }
      }
      

      // 获取用户中心用户信息
      const portalUser = await this.service.portal.portal.getUserByUseId(portalResult.identifier)
      if(!portalResult) {
        return false;
      }
      // 将基本信息和ticket结合
      portalResult = Object.assign({}, portalUser, {
        ticket: portalResult
      })
      
      // 真正登录

      let loginUser = Object.assign({}, portalResult, {
        operateUser: {
          userAccount: dbUserResult.user_account,
          userName: dbUserResult.user_name,
          userId: dbUserResult.user_id,
          email: dbUserResult.mail,
          tel: dbUserResult.tel
        }
      })
  
/*       if(options && options.setLoginState) {
        loginUser.setLoginState = await this.service.portal.portal.setLoginState(portalResult.ticket, options.redirect_uri)
      } */
      // await ctx.login(loginUser);
  
      this.session.passportJyb = Object.assign({}, this.session.passportJyb,  loginUser)
      
      return loginUser;
  },
  
  /**
   * 
   * @param {*} userId 
   * @param {*} type  
   * 1 全部是一级的键值对  {menu_code: {}} 
   * 2 区分父子的键值对{
      parent： []
      children: []
    } 
    3 是tree， 区分父子  [{menu_code: '', children: []}]
   */
  async passportGetMenu(userId, type = 3) {
    if(!userId) {
      if(this.session.passportJyb && this.session.passportJyb.operateUser) {
        userId = this.session.passportJyb.operateUser.userId
      } else {
        return [];
      }
    }
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const menuLevel1 = await this.service.portal.menu.getMenu1(userId)
    const menuLevel2 = await this.service.portal.menu.getMenu2(userId)
    let menuMain = [];
    if(type === 1) {
      let  itemMain = {};
      menuLevel1.forEach(item => {
        itemMain[item.menu_code] = item
      })
      menuLevel2.forEach(item => {
        itemMain[item.menu_code] = item
      })
      return itemMain;
    }
    if(type === 2) {
      let  parent = {}, children = {};
      menuLevel1.forEach(item => {
        parent[item.menu_code] = item
      })
      menuLevel2.forEach(item => {
        children[item.menu_code] = item
      })
      return {
        parent,
        children
      }
    }
    if(type === 3) {
    menuLevel1.forEach(menu1 => {
      let temp = menu1;
      temp.children = [];
      menuLevel2.forEach(menu2 => {
        if(menu2.p_menu_id === menu1.menu_id) {
          temp.children.push(menu2);
        }
      })
      menuMain.push(temp);
    })
    }
    return menuMain
  },

};

