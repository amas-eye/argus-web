let connections = require('../db_connect') //连接
let mongoose = require('mongoose')
let alert = require('../models/alert') //告警模型
let bulkable = require('./bulkable')
// let Redis = require('ioredis')

let alert_channel = 'rebuild_strategy'

let redis = require('../db_connect').alert_redis;

function count_tag(){
    return new Promise((resolve,reject)=>{
        console.log('in count tag for alert')
        let query = {}
        let tags_array = new Array()
        let set_array = new Set()
        alert.strategy.find(query).then((items)=>{
            // console.log('count alert tag items is',items)
            //TODO 需要根据告警记录进行修改
            items.forEach((item)=>{
                let tags = item.property.labels
                // console.log('alert tag ',tags)
                tags.forEach((tag)=>{
                    // console.log('count tag is tag',tag)
                    if(tag != ''){
                        tags_array.push(tag)
                    }
                })
            })
            tags_array.map(x=>set_array.add(x))
            redis.llen('alert_tag',(err,length)=>{
                if(err){
                    reject(new Response_status('360','fail','Redis_fail'))
                } else {
                    if(length != 0){
                        redis.ltrim('alert_tag', 1,0)
                    }
                    
                    let push_array = Array.from(set_array)
                    console.log('pa',push_array)
                    if (push_array.length != 0){
                        redis.lpush('alert_tag',push_array)
                    }
                    resolve('success')
                }
            })
        },(err)=>{
            reject(new Response_status('350','fail','Mongodb_fail'))
        })
    })
}

function Redis_publish(type,id){
    if(type == "del"){
        var json_push_content = {"del":id}
        // json_push_content['del'] = id
        // console.log(json_push_content)
        var push_content = JSON.stringify(json_push_content)
    } 
    else if (type == "update"){
        var json_push_content = {"update":id}
        // json_push_content["update"] = id
        var push_content = JSON.stringify(json_push_content)
    }
    else if(type == "create"){
        var json_push_content = {"create":id}
        var push_content = JSON.stringify(json_push_content)
    }
    // console.log('push content is',push_content)
    redis.publish(alert_channel,push_content)
    console.log('redis publish comlete,action is:'+type+' id is'+id)
}

module.exports = {
    get_warn_label: function() {
        //获取告警标签列表
        return new Promise((resolve, reject) => {

            redis.lrange('alert_tag',0,-1,(err,res)=>{
                if(err){
                    reject(err)
                }
                // console.log('res',res)
                let return_array = new Array()
                res.forEach((item)=>{
                    let tag_object= {}
                    tag_object['label'] = item
                    return_array.push(tag_object)
                })
                resolve(return_array)
            })
        })
    },
    get_warn_strategy: function(text, label, page, onepagecount,level) {
        //获取告警策略信息
        return new Promise((resolve, reject) => {

            //$regex 正则表达式查询

            let findQure = {
                "property.name": text == "" ? { $regex: '/*' } : { $regex: text, $options: 'i' },
                'level': level == "" ? { $regex: '/*' } : { $regex: level, $options: 'i' }
            }
            if (!(label == "" || label == "all")) {
                findQure["property.labels"] = { $all: [label] }
            }

            console.info('调试', findQure)
            let skipnum = (page - 1) * onepagecount


            alert.strategy.find(findQure).limit(onepagecount).skip(skipnum).
            then(rep => { //查询
                console.info('查询结果', rep)
                resolve(rep)
            }).catch(err => {
                //console.info('查询结果', err)
                reject(err)
            })


        })
    },
    strategycount: function(text, label, e_text, level) {
        //策略数统计

        return new Promise((resolve, reject) => {

            let findQure = {
                "property.name": text == "" ? { $regex: '/*' } : { $regex: text, $options: 'i' },
                'level': level == "" ? {$regex : '/*'} : {$regex: level,$options: 'i' }             
            }
            console.log(label)
            if (!(label == "" || label == "all")) {
                findQure["property.labels"] = { $all: [label] }
            }

            console.log(findQure)
            alert.strategy.find(findQure).count().
            then(rep => { //查询
                // console.info('查询结果', rep)
                resolve(rep)
            }).catch(err => {
                //console.info('查询结果', err)
                reject(err)
            })

        })

    },
    add_warn_strategy: function(option) {
        //新增告警策略信息

        return new Promise((resolve, reject) => {

            // console.log('options',option)
            let labels = option.property.labels //视图标签数组 

            let bulk = alert.labels.collection.initializeUnorderedBulkOp() //批量操作构造器（批量操作有点像事务，但是单个集合的事务）

            let newWarn = new alert.strategy(option)
            // console.log('newWarn has created')

            if (bulkable(bulk) && labels.length > 0) {
                // console.info('调试', labels)
                labels.forEach(function(item) {
                    bulk.find({ label: item }).upsert().updateOne({ $set: { label: item } }) //更新没数据就更新数组做push操作
                })

                bulk.execute() //批量操作开始
            }


            newWarn.save(
                function(err) {
                    if (err) {
                        // console.log('error on save')
                        reject(err)
                    } else {
                        // resolve('succeed')
                        // console.log('ready to count_tag')
                        count_tag().then((status)=>{
                            resolve(status)
                        }).catch((err)=>{
                            reject(err)
                        })
                    }
                }
            )

        })
    },
    update_warn_strategy: function(option) {
        //更改告警策略信息
        return new Promise((resolve, reject) => {

            let newdata = { $set: option } //新数据
            let findQure = { //查询条件
                _id: option._id
            }

            let labels = option.property.labels //视图标签数组 

            let bulk = alert.labels.collection.initializeUnorderedBulkOp() //批量操作构造器（批量操作有点像事务，但是单个集合的事务）


            if (bulkable(bulk) && labels.length > 0) {
                console.info('调试', labels)
                labels.forEach(function(item) {
                    bulk.find({ label: item }).upsert().updateOne({ $set: { label: item } }) //更新没数据就更新数组做push操作
                })

                bulk.execute() //批量操作开始
            }

            alert.strategy.update(findQure, newdata, { "multi": true }, function(error) { //更新数据
                if (error) {
                    reject(error)
                } else {
                    if(option["status"] =='ok' | option['status'] == 'alert'){
                        Redis_publish('update',option['_id'])
                    }
                    // resolve('succeed')
                    count_tag().then((status)=>{
                        resolve(status)
                    },(err)=>{
                        reject(err)
                    })
                }
            })


        })
    },
    del_warn_strategy: function(id) {
        //删除告警策略信息

        return new Promise((resolve, reject) => {
            let findQure = { //查询条件
                _id: id
            }

            alert.strategy.remove(findQure, function(error) { //删除数据
                if (error) {
                    reject(error)
                } else {
                    Redis_publish('del',id)
                    // resolve('succeed')
                    count_tag().then((status)=>{
                        resolve(status)
                    },(err)=>{
                        reject(err)
                    })
                }
            })
        })
    },
    toggle_warn: function(id, val) {
        //切换告警开关
        return new Promise((resolve, reject) => {
            let findQure = { //查询条件
                _id: id
            }

            alert.strategy.updateOne(findQure, { $set: { status: val } }).then(req => {
                if(val == 'ok'){
                    Redis_publish('create',id)
                } else if(val == 'no'){
                    Redis_publish('del',id)
                }
                resolve(req)
            }).catch(err => {
                reject(err)
            })
        })
    },
    get_warn_history: function(e_text, text, page, onepagecount, date,recoverd,level) {
        //获取告警策略历史信息
        return new Promise((resolve, reject) => {
            //$regex 正则表达式查询
            if (recoverd == 'all'){
                recoverd = ''
            }
            if(level == 'all'){
                level = ''
            }
            let findQure = {
                strategy_name: text == "" ? { $regex: '/*' } : { $regex: text, $options: 'i' },
                level: level == "" ? { $regex: '/*' } : { $regex: level, $options: 'i' },
                is_recover: recoverd == "" ? {$type:8} : {$eq:recoverd}
            }
            if (e_text !== ''){
                findQure['strategy_name'] = {$eq: e_text}
            }
            // console.log(findQure)

            if (date.start != "" || date.end != ""){ //判断时间查询条件
                if (date.end == "") {
                    findQure.alert_time = {
                        $gte: parseInt(date.start),
                    }
                } else if (date.start == "") {
                    findQure.alert_time = {
                        $lte: parseInt(date.end),
                    }
                } else {
                    findQure.alert_time = {
                        $gte: parseInt(date.start),
                        $lte: parseInt(date.end)
                    }
                }
            }

            //console.info(findQure)
            let skipnum = (page - 1) * onepagecount


            alert.history.find(findQure).limit(onepagecount).skip(skipnum).sort({ alert_time: -1 }).
            then(rep => { //查询(按时间倒序)
                console.info('查询结果', rep)
                resolve(rep)
            }).catch(err => {
                //console.info('查询结果', err)
                reject(err)
            })

        })
    },
    historycount: function(e_text, text, date,recoverd,level) {
        //历史记录数统计
        return new Promise((resolve, reject) => {
            if (recoverd == 'all'){
                recoverd = ''
            }
            // console.log(e_text)
            if(level == 'all'){
                level = ''
            }
            let findQure = {
                strategy_name: text == "" ? { $regex: '/*' } : { $regex: text, $options: 'i' },
                level: level == "" ? { $regex: '/*' } : { $regex: level, $options: 'i' },
                is_recover: recoverd == "" ? {} : {$eq:recoverd}
            }

            if (e_text !== ''){
                findQure['strategy_name'] = {$eq: e_text}
            }
            console.log(findQure)
            if (date.start != "" || date.end != "") { //判断时间查询条件
                if (date.end == "") {
                    findQure.alert_time = {
                        $gte: parseInt(date.start),
                    }
                } else if (date.start == "") {
                    findQure.alert_time = {
                        $lte: parseInt(date.end),
                    }
                } else {

                    findQure.alert_time = {
                        $gte: parseInt(date.start),
                        $lte: parseInt(date.end)
                    }
                }
            }



            alert.history.find(findQure).count().
            then(rep => { //查询
                // console.info('查询结果', rep)
                resolve(rep)
            }).catch(err => {
                //console.info('查询结果', err)
                reject(err)
            })

        })

    },

}