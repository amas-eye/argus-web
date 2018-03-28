//权限用户管理模型
let mongoose = require('mongoose');
let connections = require('../db_connect')
let Schema = mongoose.Schema

let users = new Schema({ //监控项目用户信息表
    username: String, //账号
    name: String, //用户名(昵称)
    password: String, //密码
    create_time: { type: Date, default: Date.now }, //创建时间
    update_time: { type: Date, default: Date.now }, //更新时间
    mail: String, //邮件
    cell_phone: String, //手机
    wechat_id: String, //微信
    slack_hook: String, //Slack
    is_admin: Boolean, //是否超级管理员
    group_name: [{ type: String, ref: 'groups' }] //分组名(联表分组)
})

let qxs = new Schema({ //监控项目模块权限模型
    dashboard: String, //总体概况
    jk: String, //监控
    alert: String, //告警
    caiji: String, //采集
    chain: String //调用链   
        // users: [{ type: Schema.Types.ObjectId, ref: 'users' }] //用户id
})

let groups = new Schema({ //监控项目用户分组
    group_name: String, //分组名
    qxs: { //权限
        type: qxs,
        required: true
    }
    // users: [{ type: Schema.Types.ObjectId, ref: 'users' }] //用户id
})


module.exports = {
    users: connections.argus.model('users', users), //用户模型
    groups: connections.argus.model('groups', groups) //用户分组操作模型
}