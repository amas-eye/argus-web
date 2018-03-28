
//登录服务
let { Response_status } = require('../models/httpcode')
let connections = require('../db_connect') //连接
let mongoose = require('mongoose')
let users = require('../models/user') //用户模型
let crypto = require('crypto');

module.exports ={
    login: function(username, epassword){
      return new Promise((resolve, reject) => {
       //最后返回的是resolve(200)或者reject(错误码)
        let query = {'username': username}
        users.findOne(query, 'username password').then(function(item){
            if(item === null){
                reject(new Response_status('250','fail','登录失败：此用户不存在'))   // 没用此用户
            }
            else if(item.password != undefined){
                if(item.password == epassword){
                    resolve(new Response_status('200','success','登录成功')) //
                } else {
                    reject(new Response_status('250','fail','登录失败：用户密码错误'))  //密码错误
                }
            }
          })
        })
    },

    wechat_login:function(openid){
        return new Promise((resolve,reject)=>{
            let query = {'wechat_id':openid}
            console.log("query is",query)
            users.findOne(query).then(function(items){
                console.log("items", items)
                if(items === null){
                    reject(new Response_status('250','fail','此微信未绑定用户'))
                } else {
                    resolve(items.username)
                }
            },(err)=>{
                reject(new Response_status('350','fail','Mongodb fail'))
            })
        })
    },

    wechat_binding_phone:function(user,oid){
        return new Promise((resolve,reject)=>{
            let query = {'username':username}
            let set = {'$set':{'wechat_id':oid}}
            users.update(query,set).then((item)=>{
                  resolve('300','success','用户微信绑定成功')
            },(err)=>{
                  reject(new Response_status('350','fail','Mongodb fail'))  
            }),(err)=>{
                reject(new Response_status('350','fail','Mongodb 失败'))
            }
        })
    }

}