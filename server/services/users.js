let { Response_status } = require('../models/httpcode')
let connections = require('../db_connect');
let moogoose = require('mongoose');
let user = require('../models/user');
let group = require('../models/groups');
let strategy = require('../models/alert').strategy
let crypto = require('crypto')
    // let http = require('http')
let request = require('request')
let lodash = require('lodash')
let redis = require('redis')
let bulkable = require('./bulkable')
let ObjectId = require('mongodb').ObjectId
// let strategy_connection = require('../db_connect').argus_alert


let wechat_service_host = require('../start_config').wechat_api_host
let wechat_qr_code_path = require('../start_config').wechat_qrcode_path
let wechat_redis_channel = require('../start_config').wechat_redis_channel
let redis_client = require('../db_connect').wechat_redis


// redis_client.auth('a$gns_wechat', function(){
//     console.log('redis is authed and connected')
// })

// redis_client.on("subscribe", function(channel) {
//     redis_client.psubscribe("channel:wechat_binding")
//     console.log("subscibe success")
// })

redis_client.subscribe(wechat_redis_channel,function(err,count){
    console.log('subscibe finish,channel is ',wechat_redis_channel)
})


redis_client.on("message", function(channel, message) {
    console.log("sub channel " + channel + ": " + message);
    var json_msg = JSON.parse(message)
    var username = json_msg['username']
    var open_id = json_msg['open_id']
    query = { "username": username }
    user.findOne(query).then((item) => {
        item.wechat_id = open_id
        item.save().then((result) => {
            console.log("微信绑定成功")
        }, (err) => {
            console.log("微信绑定失败")
        })
    }, (err) => {
        console.log("db fail")
    })
})

redis_client.subscribe('wechat_binding') // redis订阅的频道为wechat_binding

function update_user_to_group(groupname, username){
    // 公共模块，用于补充用户与组的联系，把用户添加到组的数组中
    return new Promise(function(resolve,reject){
        let group_query = {"group_name":groupname}
        group.find(group_query).then((group_items)=>{
            group_item = group_items[0]
            let group_users = group_item["users"]
            user.findOne({"username":username},"_id").then((qid)=>{
                let numbers = group_users.push(qid)
                group_item.users = group_users
                console.log(group_item)
                group_item.save().then(()=>{
                    resolve('success')
                },(err)=>{
                    reject('360')
                })
            },(err)=>{
                reject('360')
            })
        },(err)=>{
            reject('360')
        })
    })
}

function deleteUserfromGroup(groupname, username){
    return new Promise((resolve,reject)=>{
        console.log("delete user from group function")
        query = {"group_name":groupname}
        group.findOne(query).then((item)=>{
            let users = item.users
            users.splice(users.indexOf(username),1)
            item.users = users
            item.save().then((doc)=>{
                response_status = new Response_status('300','success', '用户删除成功')
                resolve(response_status)
            },(err)=>{
                response_status = new Response_status('360','error', 'Mongodb插入失败')
                reject(response_status)
            })
        },(err)=>{
            response_status = new Response_status('360','error', 'Mongodb 读取失败')
            reject(response_status)
        })
    })
}

function union_group(newgrouplist){
    return new Promise((resolve,reject)=>{
        if(newgrouplist.length>0){
            console.log(newgrouplist)
            group.find({"group_name":{$in:newgrouplist}}).then((items)=>{
                var object_array = new Array()
                items.forEach(function(itema){
                    console.log(itema)
                    let gobject = {}
                    gobject["group_names_check"] = new Array()
                    gobject["group_name"] = itema.group_name
                    gobject["_id"] = itema._id
                    object_array.push(gobject)
                })
                let bulk = strategy.collection.initializeUnorderedBulkOp()
                if(bulkable(bulk)){
                    object_array.forEach(function(single_object){
                        bulk.find({}).upsert().update({$push:{"notify.notify_group":single_object}})
                    })
                    bulk.execute(function(error){
                        if(error){
                            reject(error)
                        } else {
                           resolve("success")
                        }
                    })
                }
            },(err)=>{
                reject(err)
            })
        } else {
            resolve('nothing insert')
        }
    })
}

function deleteGroupfromStrategy(dGroup){
    return new Promise((resolve,reject)=>{
        console.log(dGroup)
        if(dGroup.length >0){
            var dgroup_objectid = new Array()
            dGroup.forEach(function(item){
                let ObjItem = ObjectId(item)
                dgroup_objectid.push(ObjItem)
            })
            var new_result = new Array()
            // var strategy_conn = strategy_connection.collection('strategy')
            strategy.find({}).then((results)=>{
                results.forEach(function(result){
                    // dGroup.forEach(function(dgroupitem){
                    dgroup_objectid.forEach(function(dgroupitem){
                        let index = lodash.findIndex(result['notify']['notify_group'],{"_id":dgroupitem})
                        if(index != -1){
                            result['notify']['notify_group'].splice(index,1)
                        }
                        new_result.push(result)
                    })
                })
                console.log("modified")
                strategy.remove({}).then((doc)=>{
                    strategy.insertMany(new_result).then((doc2)=>{
                        resolve(new Response_status('900','success',''))
                    },(err)=>{
                        reject(new Response_status('360','error','Mongodb插入错误'))    
                    })
                },(err)=>{
                    reject(new Response_status('360','error','Mongodb插入错误'))                
                })
            },(err)=>{
                reject(new Response_status('360','error','Mongodb读取错误'))   
            })
        } else {
            resolve('del nothing')
        }
    })
}

function cGnametouser(change_name_list){
    // 此函数目的是为了在修改组名之后，同步对user表中的group字段的更改
    // change_name_list 为数组， 每个元素为{old_name:String, new_name:String}
    return new Promise((resolve,reject)=>{
        let promise_array = new Array()
        change_name_list.forEach(function(name){
            let promise_Obj = new Promise((resolve,reject)=>{
                bulk = user.collection.initializeUnorderedBulkOp()
                if(bulkable(bulk)){
                    bulk.find({"group_name":name['old_name']}).update({"$set":{"group_name":name['new_name']}})
                }
                bulk.execute(function(r,error){
                    if(error){
                        reject(error)
                    } else {
                        resolve('done')
                    }
                })
            })
            promise_array.push(promise_Obj)
        })
        // console.log(promise_array.length)
        Promise.all(promise_array).then((result)=>{
            console.log('donedone')
            resolve(new Response_status('900','success','done'))
        },(err)=>{
            reject(err)
        })
    })
}


module.exports = {
    get_user_data: function(username) {
        //用于获取登录用户数据
        return new Promise((resolve, reject) => {
            var query = { "username": username };
            console.info(username)
            user.findOne(query, "username name cell_phone mail wechat_id slack_hook is_admin").then((item) => {
                console.info(item);
                resolve(item);
            }, (err) => {
                reject(new Response('360','error','Mongodb插入错误'))
            });
        })
    },

    save_user_data: function(username, p_data) {
        //保存该登录用户的修改后的信息
        /*p_data 这里是一个object
            可能会为p_data = {"name":name, "mail":mail, "slack_hook":slack_hook,"wechat_id":wechat_id}
            或者是p_data = {"name":name, "mail":mail, "slack_hook":slack_hook,
                       "wechat_id":wechat_id, "old_password":old_password,
                       "new_password":new_password
          }
        */
        //Done
        return new Promise((resolve, reject) => {
            var query = { "username": username }
            user.find(query).then(function(item) {
                var item = item[0]
                item.name = p_data["name"]
                item.mail = p_data["mail"]
                item.wechat_id = p_data["wechat_id"]
                item.slack_hook = p_data["slack_hook"]
                item.cell_phone = p_data["cell_phone"]
                console.info(p_data["old_password"])
                if (p_data["old_password"] != "" & p_data["new_password"] != "") {
                    crypto.pbkdf2(p_data["old_password"], 'argus', 5000, 64, "sha256", function(err, epass) {
                        epass_str = epass.toString('hex');
                        if (err) {
                            resolve(new Response('354','fail','加密失败'))
                        }
                        if (epass_str != item.password) {
                            resolve(new Response_status('350','fail','原始密码错误'))
                        } else {
                            crypto.pbkdf2(p_data["new_password"], 'argus', 5000, 64, "sha256", function(err, newepass) {
                                if (err) {
                                    resolve(new Response('354','fail','加密失败'))
                                } else {
                                    item.password = newepass.toString('hex')
                                    item.save().then((result) => {
                                        resolve(new Response_status('300','success','修改用户成功'))
                                    }, (err) => {
                                        reject(new Response_status('360','error','Mongodb插入失败'))
                                    })
                                }
                            })
                        }
                    })
                } else if (p_data["old_password"] == "" && p_data["new_password"] != "") {
                    resolve(new Response_status('350','fail','原始密码为空'))
                } else if (p_data["old_password"] != "" && p_data["new_password"] == "") {
                    resolve(new Response_status('350','fail','新密码为空'))
                } else {
                    console.info(item)
                    item.save().then((result) => {
                        resolve(new Response_status('300','success','修改用户成功'))
                    }, (err) => {
                        reject(new Response_status('360','error','Mongodb插入失败'))
                    })
                }
            }, function(err) {
                reject(new Response_status('360','error','Mongodb读取失败'))
            })
        })
    },

    show_user: function(page, items_number, compare_item, group) {
        //用于展示用户管理的
        //Todo
        return new Promise((resolve, reject) => {
            var skipnum = (parseInt(page) - 1) * items_number
            var items_num_int = parseInt(items_number)
            console.log(page)
            console.log(items_number)
            console.log(compare_item)
            console.log(group)
            if ((compare_item == "" & group == 'all') | (compare_item == "" & group == '')){
                query = { "username": { $not: { $in: ['root'] } } }
            } 
            else if (compare_item != "" &&( group != 'all' && group != '')) {
                query = {
                    "group_name": group,
                    username:{ $regex:compare_item ,$options:'i'}
                }
            } else if ( compare_item != "" && ( group == "all" || group =='')) {
                query = {
                    username: { $regex:compare_item,$options:'i'}
                }
            } else if(compare_item == "" & group != "all" & group != ''){
                query = {
                    "group_name": group,
                    "username": { $not: { $in: ['root'] } }
                }
            }
            console.info('query item',query)
            user.find(query).limit(items_num_int).skip(skipnum).then(function(item) {
                console.log(item.length)
                var index = lodash.findIndex(item,{"username":"root"})
                // if(index != -1){
                //     item.splice(index,1)
                // }
                resolve(item)
            }, function(err) {
                reject(new Response_status('360', 'error', 'Mongodb读取失败'))
            })
        })
    },

    get_user_info: function(username) {
        return new Promise(function(resolve, reject) {
            query = { "username": username }
            user.findOne(query).then((result) => {
                group.find({ 'group_name': { $in: result.group_name } }, "group_name group_privilieged", function(err, gresult) {
                    if (err) {
                        reject(new Response_status('360','error','Mongodb读取失败'))
                    }
                    var result1 = lodash.clone(result)
                    var gresult1 = lodash.clone(gresult)
                    var result2 = {}
                    result2.user = result1
                    result2.pri = gresult1
                        // console.info(result2)
                    resolve(result2)
                })
            }, (err) => {
                reject(new Response_status('360','error','Mongodb读取失败'))
            })
        })
    },

    show_all_pages: function(compare_item, group, items_num) {
        //TODo
        return new Promise((resolve, reject) => {
            if (compare_item != "" & group != "") {
                query = {
                    "group_name": group,
                    "username": {$regex:compare_item}
                }
            } else if (compare_item == "" && (group == ""| group == "all") ){
                query = {}
            } else if (compare_item != "" & group == "") {
                query = {
                    "username": {$regex:compare_item}
                }
            } else {
                query = {
                    "group_name": group
                }
            }
            user.find(query, "username").then(function(items) {
                var total_item = items.length - 1
                var total_page = parseInt(total_item / items_num)
                var remain_num = total_item % items_num
                if (remain_num != 0) {
                    total_page += 1
                }
                resolve(total_page.toString())
            }, function(err) {
                reject(new Response_status('360','error','Mongodb读取失败'))
            })
        })
    },

    GrouptoUser:function(){
        return new Promise((resolve, reject)=>{
            query = {}
            group.find(query, "group_name users").populate({path: 'users', select:'username'}).exec(function(err,groups){
                if(err){
                    reject(new Response_status('360','error','Mongodb读取失败'))
                }
                console.log(groups.users)
                resolve(groups)
            })
        })
    },


    add_user: function(username, p_data) {
        //用于进行系统用户添加
        //功能类似于用户信息修改
        //密码使用异步进行加密,因为不需要进行马上的权限认证
        return new Promise((resolve, reject) => {
            let query = { "username": username }
            let group_query = {"group_name": p_data['groups']}
            console.log("groups is ")
            console.log(p_data['groups'])
            user.findOne(query).then(function(item) {
                if (item == null) {
                    crypto.pbkdf2(p_data.password, 'argus', 5000, 64, "sha256", function(err, epass) {
                        var epass_string = epass.toString('hex');
                        var new_user = new user({
                            username: p_data["username"],
                            wechat_id: p_data["wechat_id"],
                            slack_hook: p_data["slack_hook"],
                            name: p_data["name"],
                            mail: p_data["mail"],
                            password: epass_string,
                            cell_phone: p_data["cell_phone"],
                            group_name: p_data["groups"]
                        });
                        console.info("new_user")
                        console.info(new_user)
                        new_user.save().then(function(doc) {
                            return('1')
                        }, function(err) {
                            reject(new Response_status('360','error','Mongodb插入失败'))
                        }).then((resulted)=>{
                            update_user_to_group(p_data['groups'], username).then((final)=>{
                                resolve('300')
                            },(err)=>{
                                reject(err)
                            })
                        },(err)=>{
                            reject(new Response_status('360','error','Mongodb读取失败'))
                        })
                    })
                } else {
                    resolve(new Response_status('350','fail','用户名已存在'))
                }
            }, (err) => {
                reject(new Response_status('360','error','Mongodb读取失败'))
            })
        })
    },

    get_one_user: function(username) {
        return new Promise(function(resolve, reject) {
            query = { "username": username }
            user.findOne(query).then((item) => {
                resolve(item)
            }, (err) => {
                reject(new Response_status('360','error','Mongodb读取失败'))
            })
        })
    },

    change_user_admin: function(id, data) {
        return new Promise(function(resolve, reject) {
        /// TODO 需要把关联删除用户功能加上
            query = { "_id": id }
            user.findOne(query).then((item) => {
                var origin_group = item.group_name
                if (data["password"] == "") {
                    item.username = data.username
                    item.name = data.name
                    item.mail = data.mail
                    item.cell_phone = data.cell_phone
                    item.wechat_id = data.wechat_id
                    item.group_name = data.groups
                    item.slack_hook = data.slack_hook
                    item.save().then(function(doc) {
                        return('1')
                    }, function(err) {
                        reject(new Response_status('360','error','Mongodb插入失败'))
                    }).then((resulted)=>{
                        if( origin_group != data["groups"]){
                            deleteUserfromGroup(origin_group, data['username']).then((doc)=>{
                                update_user_to_group(data['groups'], data['username']).then((final)=>{
                                    response_msg = new Response_status('305','success','修改用户个人信息成功')
                                    resolve(response_msg)
                                },(err)=>{
                                    reject(err)
                                })
                            },(err)=>{
                                reject(err)
                            })
                        } else {
                            resolve(new Response_status('305','success','修改用户个人信息成功'))
                        }
                    },(err)=>{
                        reject(new Response_status('360','error','Mongodb读取失败'))
                    })
                } else {
                    crypto.pbkdf2(data["password"], 'argus', 5000, 64, "sha256", function(err, epass) {
                        console.info(item)
                        str_epass = epass.toString('hex')
                        item.name = data.name
                        item.mail = data.mail
                        item.cell_phone = data.cell_phone
                        item.wechat_id = data.wechat_id
                        item.group_name = data.groups
                        item.slack_hook = data.slack_hook
                        item.password = str_epass
                        item.save().then(function(doc) {
                            return('1')
                        }, function(err) {
                            reject(new Response_status('360','error','Mongodb读取失败'))
                        }).then((resulted)=>{
                            if( origin_group != data["groups"]){
                                deleteUserfromGroup(origin_group, data['username']).then((doc)=>{
                                    update_user_to_group(data['groups'], data['username']).then((final)=>{
                                        response_msg = new Response_status('305','success','修改用户个人信息成功')
                                        resolve(response_msg)
                                    },(err)=>{
                                        reject(err)
                                    })
                                },(err)=>{
                                    reject(err)
                                })
                            }  else {
                                resolve(new Response_status('305','success','修改用户个人信息成功'))
                            }
                        },(err)=>{
                            reject('360')
                        })
                    })
                }
            }, (err) => {
                reject(new Response_status('360','error','Mongodb读取失败'))
            })
        })
    },

    delete_user: function(duser) {
        return new Promise(function(resolve, reject) {
            console.info(duser)
            console.info(typeof(duser))
            if (typeof(duser) == "string") {
                query = { "username": duser }
            } else {
                query = { "username": { $in: duser } }
            }

            user.remove(query, (err, doc) => {
                if (err) {
                    reject(new Response_status('360','error','Mongodb删除失败'))
                }
                resolve(new Response_status('300','success','删除用户成功'))
            })
        })
    },

    get_qr_code: function(user) {
        // 进行http请求的转发
        //todo
        return new Promise(function(resolve, reject) {
            var expire_time = 300
            // url = 'http://114.215.85.142/argus-dev/controller/create_qrcode?username=' + user + '&expire_seconds=300'
            url = 'http://'+wechat_service_host+ wechat_qr_code_path + user + '&expire_seconds=300'
            console.info(url)
            request(url, function(err, res, body) {
                if (err) {
                    reject(new Response_status('358','fail','二维码获取失败'))
                } else if (res.statusCode == 200) {
                    var json_body = JSON.parse(body)
                    resolve(json_body["qrcode_url"])
                }
            })
        })
    },

    check_wechat_binding: function(username){
        return new Promise(function(resolve, reject){
            query = { "username": username }
            user.findOne(query).then(function(item) {
                if (item.wechat_id == "") {
                    let response_msg = new Response_status('350', 'waiting', "")
                    console.log(response_msg)
                    reject(response_msg)
                } else {
                    let response_msg = new Response_status('310', 'success', "微信成功绑定")
                    console.log(response_msg)
                    resolve(response_msg)
                }
            }, function(err) {
                let response_msg = new Response_status('360', 'fail', "查询绑定失败，数据库错误")
                console.log(response_msg)
                reject(response_msg)
            })
        })
    },

    wechat_unbinding: function(username) {
        return new Promise((resolve, reject) => {
            query = { "username": username }
            user.findOne(query).then(function(item) {
                item.wechat_id = ""
                item.save().then((doc) => {
                    let response_msg = new Response_status('300', 'success', '微信解绑成功')
                    resolve(response_msg)
                }, (err) => {
                    let response_msg = new Response_status('350', 'fail', '微信解绑失败')
                    reject(response_msg)
                })
            }, (err) => {
                let response_msg = new Response_status('360', 'error', 'Mongodb读取失败')
                reject(response_msg)
            })
        })
    },

    get_group: function() {
        //用于获取所有组的信息
        //Done
        return new Promise((resolve, reject) => {
            group.find({}, "group_name").sort({ "_id": 1 }).then((data) => {
                resolve(data)
            }), (err) => {
                reject(new Response('360','error','Mongodb读取失败'))
            }
        })
    },

    get_all_group: function() {
        return new Promise(function(resovle, reject) {
            group.find().sort({ "_id": 1 }).then((result) => {
                resovle(result)
            }, (err) => {
                reject(new Response('360','error','Mongodb读取失败'))
            })
        })
    },

    get_group_Privilieged: function(groupname){
        //用于获取单个组的权限信息
        //Done
        return new Promise((resolve, reject) => {
            let query = { "group_name": groupname }
            group.find(query, "group_name group_privilieged").then((data) => {
                if (data.length == 0) {
                    resolve(new Response('950','fail','该用户组不存在'))
                } else {
                    resolve(data)
                }
            }), (err) => {
                reject(new Response('360','error','Mongodb读取失败'))
            }
        })
    },

    change_group: function(cGroup, dGroup) {
        //用于进行对组进行权限修改或者改名
        //?有一个问题如果获取原来的用户组名
        //TODO
        return new Promise((resolve, reject) => {
            var cglength = cGroup.length
            var range = 0
            var change_id_array = new Array()
            var cGroupObject = new Array()
            var Group_name_compare = new Array()
            var new_group = new Array()
            var change_name_group = new Array()
            for (range; range < cglength; range++) {
                var cGObj = cGroup[range]
                // 此处是对新增的组名进行判断
                if (Group_name_compare.indexOf(cGObj.group_name) == -1) {
                    Group_name_compare.push(cGObj["group_name"])
                    if (cGObj._id != undefined) {
                        change_id_array.push(cGObj["_id"])
                    } else {
                        new_group.push(cGObj["group_name"])
                    }
                    cGroupObject.push(cGObj)
                } else {
                    continue
                }
            }
            change_id_array = change_id_array.concat(dGroup)
            var query = { "_id": { $in: change_id_array } }
            group.find().then((total_groups)=>{
                console.log(cGroup)
                console.log("total group")
                console.log(total_groups)
                console.log(typeof(total_groups))
                cGroup.forEach(function(g){
                    // 此处的目的是为了处理修改组名的用户组
                        if(g['_id'] != undefined){
                            let Com_obj = {"_id":ObjectId(g["_id"]), "group_name":g['group_name']}
                            let indexx = lodash.find(total_groups,Com_obj)
                            if(indexx == undefined & g['_id'] != undefined){
                                let changeObj = {}
                                let origin_record_index = lodash.findIndex(total_groups,{"_id":ObjectId(g["_id"])})
                                console.log("origin_record_index")
                                console.log(origin_record_index)
                                let origin_record = total_groups[origin_record_index]
                                changeObj['old_name'] = origin_record['group_name']
                                changeObj['new_name'] = g['group_name']
                                change_name_group.push(changeObj)
                            }
                    }
                    console.log("change name group")
                    console.log(change_name_group)
                    // console.log("chane_name_group")
                    // console.log(change_name_group)
                    
                })
                group.remove(query).then((result) => {
                    var remove_result = 1
                    console.log(remove_result)
                    return (remove_result)
                }, (err) => {
                    reject(new Response_status('360','error','Mongodb删除失败'))
                }).then((ress) => {
                    if (ress == 1) {
                        group.insertMany(cGroupObject).then((result1)=>{
                            union_group(new_group).then((result2)=>{
                                // console.log("result2")
                                // console.log(result2)
                                deleteGroupfromStrategy(dGroup).then((r)=>{
                                    // resolve(new Response_status('900','success','修改组操作成a功'))
                                    if(change_name_group.length >0){
                                        cGnametouser(change_name_group).then((result3)=>{
                                            resolve(new Response_status('900','success','修改组操作成功'))
                                        },(err)=>{
                                            reject(err)
                                        })
                                    }
                                    resolve(new Response_status('900','success','修改组操作成功'))
                                },(err)=>{
                                    // reject(new Response_status('360',"fail",'delete relatte fail'))
                                    console.log("err in deleteGroupFS")
                                    reject(err)
                                }) 
                            },(err)=>{
                                reject(err)
                            }),(err) => {
                                reject(new Response_status('360','error','Mongodb读取失败'))
                            }
                        })
                    } else {
                        resolve('363')
                    }
                })
            },(err)=>{
                reject(new Response_status('360','fail','Mongodb 查询错误'))
            })
        })
    }


}