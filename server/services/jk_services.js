//消息服务
let connections = require('../db_connect') //连接
let mongoose = require('mongoose')
let moment = require('moment')
let ObjectId = require('mongodb').ObjectId
let http = require('http')
let request = require('request')
let redis = require('../db_connect').alert_redis;
// 数据库模型
let jk_viewlists = require('../models/jk_viewlists') //视图模型
let jk_tags = require('../models/jk_tags') //视图tag模型
let jk_charts = require('../models/jk_charts') //图表模型
let survey = require('../models/survey') //概览
let bulkable = require('./bulkable')
let {Response_status} = require('../models/httpcode')
let strategy = require('../models/alert').strategy
let Response_strategy = require('../models/jk_alert').Response_strategy

//配置文件读取
let opentsdb_host = require('../start_config').opentsdb_host
let opentsdb_port = require('../start_config').opentsdb_port
let Host_value = require('../models/table_query').Host_value
let Data_value = require('../models/table_query').Data_value


function count_tag(){
    return new Promise((resolve,reject)=>{
        console.log('in count tag')
        let query = {}
        let tags_array = new Array()
        let set_array = new Set()
        jk_viewlists.find(query).then((items)=>{
            // console.log('count tag items is',items)
            items.forEach((item)=>{
                // console.log('kitems is')
                // console.log(items)
                let tags = item.tags
                tags.forEach((tag)=>{
                    if(tag != ''){
                        tags_array.push(tag)
                    }
                })
            })
            // console.info('tags_array',tags_array)
            tags_array.map(x=>set_array.add(x))
            // console.info('set_array is',set_array)
            redis.llen('jk_tag',(err,length)=>{
                console.log(length)
                if(err){
                    reject(new Response_status('360','fail','Redis_fail'))
                } else {
                    if(length != 0){
                        // redis.ltrim('jk_tag',1,0)
                        redis.ltrim('jk_tag', 1,0)
                        console.log('redis list key clear')
                    }
                    let push_array = Array.from(set_array)
                    redis.lpush('jk_tag',push_array)
                    console.log('监控tag修改完成')
                    resolve('success')
                }
            })
        },(err)=>{
            reject(new Response_status('350','fail','Mongodb_fail'))
        })
    })
}



function get_all_host_query_url(metric){
    return new Promise((resolve,reject)=>{
        var q_url = 'http://'+opentsdb_host+":"+opentsdb_port+'/api/query/last?timeseries='+metric
        var tsuids =  new Array();
        // console.info("q_url",q_url)
        request.get(q_url,(err,res,body)=>{
            if(err){
                reject("making url fail")
            }
            else if(res.statusCode == 200){
                let content = JSON.parse(body)
                // console.info("content is ", content)
                content.forEach((item)=>{
                    tsuids.push(item['tsuid'])
                })
                let uid_string = tsuids.toString();
                // console.log("uid_string",uid_string)
                var return_url = 'http://'+opentsdb_host+":"+opentsdb_port+'/api/query/last?tsuids='+uid_string+'&back_scan=24&resolve=true'
                // console.info("return url is ",return_url)
                resolve(return_url)
            }
        })
    })
} 


function public_query(query_url,type,metric,host){
    return new Promise((resolve,reject)=>{
        var r_data = {}
        var host_value = {}
        var r_data_array = new Array()
        request.get(query_url,(err,res,body)=>{
            if(err){
                reject('query fail,url error')
            }
            else if (res.statusCode == 200){
                if(type == 'not_star'){
                    var res_content = JSON.parse(body)
                    console.info('not star res_content',res_content)
                }
                else{
                    var res_content = JSON.parse(body)
                }
                let query = {'status':'alert'}
                var alert_status = 'ok'
                var r_data_array = new Array()
                // console.info("res_content",res_content)
                // console.info('query is ',query)
                strategy.find(query).then((mongo_items)=>{
                    // console.info('mongo items',mongo_items)
                    if(type == "star" && host == '*'){
                        res_content.forEach((i)=>{
                            console.info('single res is ',i)
                            mongo_items.forEach((item)=>{
                                console.info("mongo single item",item)
                                if(item['tsd_rule']['metric'] == metric){
                                    item['tsd_rule']['group'].forEach((mi)=>{
                                            alert_status = 'alert'
                                    })
                                }
                            })
                            let hv = new Host_value(i['value'],i['tags']['host'],i['timestamp'])
                            // console.info('hv is ',hv)
                            r_data_array.push(hv)
                        })
                    }
                    else{
                        res_content = res_content[0]
                        let hv = new Host_value(res_content['value'],host,res_content['timestamp'])
                        // console.info('not star hv ',hv)
                        mongo_items.forEach((item)=>{
                            if(item['tsd_rule']['metric'] == metric){
                                item['tsd_rule']['group'].forEach((i)=>{
                                    if(i['value'] == host){
                                        alert_status = 'alert'
                                    }
                                })
                            }
                        })
                        r_data_array.push(hv)
                    }
                    // console.log('r_data_array is',r_data_array)
                    // console.log('alert_status',alert_status)
                    // console.log('metric',metric)
                    var dv = new Data_value(metric,alert_status,r_data_array)
                    // console.log('dv is',dv)
                    // console.info('host='+host+'dv is ',dv)
                    resolve(dv)
                }).catch((err)=>{
                    // reject(new Response_status('350','fail','数据库错误'))
                    reject(err)
                })
            }
        })
    })
}

function query_opentsdb_last_api(metric,host){
    return new Promise((resolve,reject)=>{
        console.info("in query opentsdb last")
        if(host == '*'){
            get_all_host_query_url(metric).then((query_url)=>{
                public_query(query_url,'star',metric,"*").then((datas)=>{
                    console.log('star datas',datas)
                    resolve(datas)
                }).catch((err)=>{
                    reject(err)
                })
            }).catch((err)=>{
                reject(err)
            })
        }
        else{
            var query_url = 'http://'+opentsdb_host+":"+opentsdb_port+'/api/query/last?timeseries='+metric+'{host='+host+'}'
            public_query(query_url,'not star',metric,host).then((datas)=>{
                // console.log('not star datas',datas)
                resolve(datas)
            }).catch((err)=>{
                reject(err)
            })
        }
    })
}


module.exports = {
    get_datetime_configs: function(id) {
        //获取视图时间日期配置
        return new Promise((resolve, reject) => {
            let findQure = {
                viewid: id
            }
            jk_charts.jk_datatime_configs.find(findQure).then(rep => {
                // console.info('查询结果', rep)
                resolve(rep)
            }).catch(err => {
                reject(err)
            })
        })
    },
    update_datetime_configs: function(id, option) {
        //更新视图时间日期配置 (option时间配置)
        return new Promise((resolve, reject) => {
            let findQure = {
                viewid: id
            }
            jk_charts.jk_datatime_configs.updateOne(findQure, { $set: option }, { upsert: true }).then(rep => {
                // console.info('查询结果', rep)
                resolve(rep)
            }).catch(err => {
                reject(err)
            })
        })
    },
    gettages: function() {
        //获取视图标签列表
        return new Promise((resolve, reject) => {

            //$regex 正则表达式查询

            //console.info(moment(endtime).add(1, 'days').format())
            redis.lrange('jk_tag',0,-1,(err,res)=>{
                if(err){
                    reject(err)
                } 
                let return_array = new Array()
                res.forEach((item)=>{
                    let tag_object= {}
                    tag_object['tag'] = item
                    return_array.push(tag_object)
                })
                resolve(return_array)
                // resolve(res)
            })
        })
    },

    viewcount: function(text, tag) {
        //视图数统计

        return new Promise((resolve, reject) => {
            let findQure = {
                name: text == "" ? { $regex: '/*' } : { $regex: text, $options: 'i' },
            }
            if (!(tag == "" || tag == "all")) {
                findQure["tags"] = { $all: [tag] }
            }


            jk_viewlists.find(findQure).count().
            then(rep => { //查询
                // console.info('查询结果', rep)
                resolve(rep)
            }).catch(err => {
                //console.info('查询结果', err)
                reject(err)
            })

        })

    },
    search: function(text, tag, page, onepagecount) {
        //查询监控列表
        return new Promise((resolve, reject) => {

            //$regex 正则表达式查询

            //console.info(moment(endtime).add(1, 'days').format())

            let findQure = {
                name: text == "" ? { $regex: '/*' } : { $regex: text, $options: 'i' }
            }
            if (!(tag == "" || tag == "all")) {
                findQure.tags = { $all: [tag] }
            }

            //console.info(findQure)
            let skipnum = (page - 1) * onepagecount


            jk_viewlists.find(findQure).limit(onepagecount).skip(skipnum).
            then(rep => { //查询
                // console.info('查询结果', rep)
                resolve(rep)
            }).catch(err => {
                //console.info('查询结果', err)
                reject(err)
            })


        })

    },
    add: function(option) {
        //添加监控视图进列表

        return new Promise((resolve, reject) => {
            // option.rdj='666'
            let tags = option.tags //视图标签数组 
            let bulk = jk_tags.collection.initializeUnorderedBulkOp() //批量操作构造器（批量操作有点像事务，但是单个集合的事务）
            // console.log('in add function')
            

            var now = moment().toISOString()
            console.info('now is ',now)
            var end = moment().add(7,'d').toISOString()
            console.info('end is ',end)

            let newview = new jk_viewlists({
                name: option.name, //视图名称
                tags: tags, //标签数组
                creater: option.creater, //创建者
            })

            let new_dateconfig = new jk_charts.jk_datatime_configs({
                viewid: newview._id,
                start: now,
                end: end,
                reloadhz: 0
            })
            console.log('new dateconfig is created')

            // console.info('标签', tags)

            if (bulkable(bulk) && tags.length > 0) {
                tags.forEach(function(item) {
                    // bulk.find( { tag: item } ).upsert().updateOne( { $set:{ tag: item }, $push: { viewids:newview._id } } ) //更新没数据就更新数组做push操作
                    bulk.find({ tag: item }).upsert().updateOne({ $set: { tag: item } }) //更新没数据就更新数组做push操作
                })

                bulk.execute() //批量操作开始
            }

            newview.save().then((result)=>{
                new_dateconfig.save().then(()=>{
                    count_tag().then((status)=>{
                        resolve(status)
                    },(err)=>{
                        reject(err)
                    })
                },(err)=>{
                    reject(err)
                })
            }).catch((err)=>{
                reject(err)
            })

            
        })
    },
    update: function(id, option) {
        //编辑更改监控视图进列表


        return new Promise((resolve, reject) => {

            let findQure = { //查询条件
                _id: id
            }
            let tags = option.tags //视图标签数组 

            let bulk = jk_tags.collection.initializeUnorderedBulkOp() //批量操作构造器（批量操作有点像事务，但是单个集合的事务）


            let newdata = { $set: option } //新数据

            if (bulkable(bulk) && tags.length > 0) {
                tags.forEach(function(item) {
                    // bulk.find( { tag: item } ).upsert().updateOne( { $set:{ tag: item }, $push: { viewids:newview._id } } ) //更新没数据就更新数组做push操作
                    bulk.find({ tag: item }).upsert().updateOne({ $set: { tag: item } }) //更新没数据就更新数组做push操作
                })

                bulk.execute() //批量操作开始
            }


            jk_viewlists.update(findQure, newdata, { "multi": true }, function(error) { //更新数据
                if (error) {
                    reject(error)
                } else {
                    // resolve('succeed')
                    console.log('update is in count tag')
                    count_tag().then((status)=>{
                        resolve(status)
                    },(err)=>{
                        reject(err)
                    })
                }
            })
        })
    },
    remove: function(id) {
        //删除监控视图


        return new Promise((resolve, reject) => {

            let dataArry = [] //数据数组
            let chartids = [] //图表id数组
            let charts = [] //图表数组
            let workarry = [] //数据库操作数组

            jk_charts.jk_chart_nomals.find({ viewid: id }).then(rep => { //查询图表获取信息

                let dataArry = rep //数据数组
                    // console.info('数据', dataArry)
                dataArry.forEach(item => {
                    //遍历数组
                    let chartid = item._id
                        // console.info('id', item)
                    // chartids.push({ chartid: chartid })
                    // charts.push({ chart: chartid })
                    chartids.push(chartid)
                    charts.push(chartid) 
                })

                // console.info('id数组', chartids)

                workarry = [ //数据库操作数组(删除关联数据)
                    // survey.overview_indexs.remove({ "$or": charts }),
                    // jk_charts.jk_chart_xnzbs.remove({ "$or": chartids }),
                    // jk_charts.jk_chart_ytypes.remove({ "$or": chartids }),
                    jk_charts.jk_chart_nomals.remove({ viewid: id }),
                    jk_charts.jk_datatime_configs.remove({ viewid: id }),
                    jk_viewlists.remove({ _id: id })
                ]
                if (charts.length>0){
                    // workarry.push(survey.overview_indexs.remove({ "$or": charts }))
                    workarry.push(survey.overview_indexs.deleteMany({chart:{ $in: charts }}))
                    workarry.push(jk_charts.jk_chart_xnzbs.deleteMany({chartid:{$in: charts}}))
                    workarry.push(jk_charts.jk_chart_ytypes.deleteMany({chartid:{$in: charts}}))
                }

                // if (chartids == []){
                //     workarry.push(jk_charts.jk_chart_xnzbs.remove({ "$or": chartids }))
                //     workarry.push(jk_charts.jk_chart_ytypes.remove({ "$or": chartids }))
                // }

                Promise.all(workarry).then(req => {
                    console.info('删除成功')
                    // console.log('rep is',rep)
                    // resolve(rep)
                    // console.log('update is in count tag')
                    count_tag().then((status)=>{
                        resolve(status)
                    }).catch((err)=>{
                        reject(err)
                    })
                }).catch(err => {
                    console.info('删除失败', err)
                    reject(err)
                })



            }).catch(err => {
                //console.info('查询结果', err)
                reject(err)
            })


        })
    },
    addchart: function(viewid, option) {
        //添加图表
        return new Promise((resolve, reject) => {

            let nomalinfo = option.nomalinfo //基础信息
            let pfm_index = option.pfm_index //性能指标
            let ystyle = option.ystyle //y轴样式
            let isRelateAlert = option.isRelateAlert
            let relateAlertValue = option.relateAlertValue

            nomalinfo.viewid = viewid
            let newchart_nomals = new jk_charts.jk_chart_nomals(nomalinfo)
            pfm_index.forEach(function(item) {
                let id = mongoose.Types.ObjectId() //手动生成id
                item._id = id
                newchart_nomals.xnzbs.push(id) //同步关联id
                item.chartid = newchart_nomals._id //同步关联id

            })
            // console.info('性能指标', pfm_index)
            ystyle.chartid = newchart_nomals._id //同步关联id
            let newchart_ystyle = new jk_charts.jk_chart_ytypes(ystyle)
            // console.info('y轴样式', ystyle)
            newchart_nomals.yconfig = newchart_ystyle._id //同步关联id
            newchart_nomals.isRelateAlert = isRelateAlert
            newchart_nomals.relateAlertValue = relateAlertValue
            // console.info('基础信息', newchart_nomals)

            let caozuo = [ //所有操作
                newchart_nomals.save(),
                newchart_ystyle.save(),
                jk_charts.jk_chart_xnzbs.insertMany(pfm_index)
            ]

            Promise.all(caozuo).then(
                function(posts) {
                    resolve('suceed')
                }).catch(
                function(reason) {
                    reject(reason)
                });



        })
    },
    editchart: function(option) {
        //编辑图表


        return new Promise((resolve, reject) => {

            let chartid = option.nomalinfo._id

            let nomalinfo = {
                    title: option.nomalinfo.title,
                    type: option.nomalinfo.type,
                    xnzbs: []
                } //基础信息
            let pfm_index = option.pfm_index //性能指标
            let ystyle = option.ystyle //y轴样式
            let isRelateAlert = option.isRelateAlert
            let relateAlertValue = option.relateAlertValue


            nomalinfo.xnzbs = [] //清空性能指标关联id

            pfm_index.forEach(function(item) {
                let id = mongoose.Types.ObjectId() //手动生成id
                item._id = id
                nomalinfo.xnzbs.push(id) //同步关联id
                item.chartid = chartid //同步关联id

            })

            // console.info('编辑图表', option)
                //直接删了再加过比更改简单

            let pfm_update = function() { //性能指标更新
                return new Promise((resolve, reject) => {
                    jk_charts.jk_chart_xnzbs.deleteMany({ chartid: chartid }).then(
                        res => {
                            jk_charts.jk_chart_xnzbs.insertMany(pfm_index).then(
                                res => {
                                    resolve('succeed')
                                }
                            ).catch(
                                err => {
                                    console.info('操作结果2', err)
                                    reject(err)
                                }
                            )
                        }
                    ).catch(
                        err => {
                            console.info('操作结果1', err)
                            reject(err)
                        })

                })
            }
            // console.info('调试', chartid)
            // console.info('调试xiangguan', isRelateAlert)
            // console.info('调试zhi',relateAlertValue)
            // console.info()
            let caozuo = [ //所有操作
                jk_charts.jk_chart_nomals.update({ _id: chartid },{ $set: nomalinfo }, { "multi": true }),
                jk_charts.jk_chart_nomals.update({ _id: chartid },{isRelateAlert: isRelateAlert}, { "multi": true }),
                jk_charts.jk_chart_nomals.update({ _id: chartid },{relateAlertValue:relateAlertValue}, { "multi": true }),
                jk_charts.jk_chart_ytypes.update({ chartid: chartid }, { $set: ystyle }, { "multi": true }),
                pfm_update()
            ]


            Promise.all(caozuo).then(
                function(posts) {
                    // console.log(posts)
                    resolve(new Response_status('1000','success','done'))
                }).catch(
                function(reason) {
                    console.info('操作结果all', reason)
                    reject(reason)
                });



        })
    },
    searchart: function(viewid) {
        //查询图表数据
        return new Promise((resolve, reject) => {
            let findQure = {
                viewid: viewid
                    // tag: tag == "" ? { $regex: '/*' } : tag,

            }

            //console.info(findQure)

            jk_charts.jk_chart_nomals.find(findQure, { '__v': 0 }).populate('xnzbs yconfig', '-_id -__v').
            then(rep => { //查询
                // console.info('查询结果', rep)
                resolve(rep)
            }).catch(err => {
                //console.info('查询结果', err)
                reject(err)
            })

        })
    },


    table_query_data: function(metrics){
        return new Promise((resolve,reject)=>{
            // console.info('in jk_service table_query_data')
            let promise_array = new Array()
            // console.log("metrics in table query data",metrics)
            // console.log("metrics type in table query data",typeof(metrics))
            // let metricss = JSON.parse(metrics)
            // console.log("metrics type in table query data",typeof(metricss))
            metrics.forEach((metric)=>{
                // console.log("origin metric",metric)
                // console.log("type of origin metric",typeof(metric))
                // console.info("metric is ",metric.metric)
                // console.info("host is ",metric.host)
                var singel_promise = query_opentsdb_last_api(metric['metric'],metric['host'])
                promise_array.push(singel_promise)
            })
            // console.log("promise_array",promise_array)
            Promise.all(promise_array).then((data)=>{
                resolve(data)
            }).catch((err)=>{
                reject(err)
            })
        })
    },
    
    remove_chart: function(id){
        return new Promise((resolve,reject)=>{
            let oid = ObjectId(id)
            let query = {_id:oid}
            jk_charts.jk_chart_nomals.findById(oid).then((data)=>{
                let xarray = new Array()
                let yconfig = data['yconfig']
                let yquery = {_id:yconfig}
                xarray = data['xnzbs']
                let action_array = new Array(
                   jk_charts.jk_chart_nomals.deleteOne(query),
                   jk_charts.jk_chart_ytypes.deleteOne(yquery),
                   jk_charts.jk_chart_xnzbs.deleteMany({_id:{$in:xarray}}),
                   survey.overview_indexs.deleteOne({chart:oid})
                )
                Promise.all(action_array).then((res)=>{
                   resolve(new Response_status('300','success','删除图表成功')) 
                }).catch((err)=>{
                   reject(new Response_status('350','fail','关联操作错误'))
                })
            }).catch((err)=>{
                reject(new Response_status('350','fail','数据库错误'))
            })
        })
    },

    query_strategy_for_view: function(metric){
        return new Promise((resolve,reject)=>{
            let strategy_array = new Array()
            // console.info('metric is ',metric)
            strategy.find().then((items)=>{
                // console.info('items is ',items)
                items.forEach((item)=>{
                    // console.info('s item is ',item)
                    // console.info('item type is ',typeof(item))
                    if(item['tsd_rule']['metric'] == metric){
                        console.log('s item is ',item)
                        let rule_name = item['property']['name']
                        let threshold = item['tsd_rule']['threshold']
                        // console.info('rule name is',rule_name)
                        // console.info('threshold is ',threshold)
                        return_str = '规则名:'+rule_name+' 阈值:'+threshold
                        var Return_object = {}
                        Return_object['relateAlertName'] = return_str
                        Return_object['value'] = threshold
                        // console.log('this Return_object is ',Return_object)
                        strategy_array.push(Return_object)
                    }
                })
                // console.info('strategy_array is',strategy_array)
                resolve(strategy_array)
            }).catch((err)=>{
                reject(new Response_status('350','fail','数据库错误'))
            })
        })
    }

    // check: function(ids, status) {
    //     //审核消息
    //     return new Promise((resolve, reject) => {

    //         // let message = new jk_viewlists({
    //         //     title: option.title,
    //         //     stype: option.stype,
    //         //     content: option.content,
    //         // })
    //         let obids = []

    //         ids.map(
    //             (id) => {
    //                 obids.push({
    //                     _id: mongoose.Types.ObjectId(id) //把字符串id转为objectid
    //                 })
    //             }
    //         )



    //         jk_viewlists.update({ "$or": obids }, { $set: { status: status } }, { "multi": true },
    //             err => {
    //                 if (err) {
    //                     reject(err)
    //                 } else {
    //                     resolve('审核成功')

    //                 }
    //             }
    //         )
    //     })

    // }



}