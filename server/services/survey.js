let connections = require('../db_connect') //连接
let mongoose = require('mongoose')
let survey = require('../models/survey') //概览模型
let jk_charts = require('../models/jk_charts')


module.exports = {
    get_overall_health: function() {
        //获取健康度数据
        return new Promise((resolve, reject) => {

            let findQure = {

            }

            survey.overall_health.findOne(findQure).sort({ check_time: -1 }).
            then(rep => { //查询
                console.info('查询结果', rep)
                resolve(rep)
            }).catch(err => {
                //console.info('查询结果', err)
                reject(err)
            })

        })
    },
    get_host_stat: function() {
        //获取主机信息数据
        return new Promise((resolve, reject) => {


            let findQure = {

            }

            survey.host_stat.findOne(findQure).sort({ check_time: -1 }).
            then(rep => { //查询
                console.info('查询结果', rep)
                resolve(rep)
            }).catch(err => {
                //console.info('查询结果', err)
                reject(err)
            })

        })
    },
    get_alert_stat: function() {
        //获取告警统计数据
        return new Promise((resolve, reject) => {


            let findQure = {

            }

            survey.alert_stat.findOne(findQure).sort({ check_time: -1 }).
            then(rep => { //查询
                console.info('查询结果', rep)
                resolve(rep)
            }).catch(err => {
                //console.info('查询结果', err)
                reject(err)
            })

        })
    },
    get_metric_stat: function() {
        //获取指标统计数据
        return new Promise((resolve, reject) => {


            let findQure = {

            }

            survey.metric_stat.findOne(findQure).sort({ check_time: -1 }).
            then(rep => { //查询
                console.info('查询结果', rep)
                resolve(rep)
            }).catch(err => {
                //console.info('查询结果', err)
                reject(err)
            })

        })
    },
    get_alert_trend: function(start, end) {
        //获取告警趋势
        return new Promise((resolve, reject) => {

            let findQure = {
                start_time: { //开始时间
                    $gte: parseInt(start)
                },
                end_time: { //结束时间
                    $lte: parseInt(end)
                }
            }
            // console.info('告警趋势配置', findQure)

            survey.alert_trend.find(findQure).then(res => {
                // console.info('结果', res)
                resolve(res)
            }).catch(err => {
                reject(err)
            })



        })
    },
    get_sys_resource: function() {
        //获取指所有Top5及基础资源使用量 
        return new Promise((resolve, reject) => {
            
            
            let findQure = {
            
                            }
            
            survey.sys_resource.findOne(findQure).sort({ check_time: -1 }).
                    then(rep => { //查询
                        console.info('查询结果', rep)
                        resolve(rep)
                    }).catch(err => {
                        //console.info('查询结果', err)
                        reject(err)
                    })
            
                    })
    },
    add_mychart: function(id) {
        //添加自定义指标概览
        return new Promise((resolve, reject) => {
            let findQure = { //查询条件
                    chart: id
                }
                // let mychart = new survey.overview_indexs({ chartid: id })
                // console.info('操作对象', survey.overview_indexs)
            survey.overview_indexs.updateOne(findQure, { $set: { chart: id } }, { upsert: true }).then(res => { //更新没有就添加莫名奇妙和bulk不一样
                //查找没有此项添加有就更改
                // console.info('添加', res)
                resolve(res)
            }).catch(err => {
                reject(err)
                console.info(err)
            })
        })

    },
    remove_mychart: function(id) {
        //移除自定义指标概览
        return new Promise((resolve, reject) => {

            let findQure = { //查询条件
                chart: id
            }

            survey.overview_indexs.remove(findQure, function(err) {
                if (err) {
                    reject(err)
                    console.info(err)
                } else {
                    resolve('suceed')
                }

            })

        })
    },
    get_mycharts: function() {
        //获取自定义指标概览
        return new Promise((resolve, reject) => {

            let findQure = { //查询条件
                // _id: id
            }
            let viewids = [] //视图id数组
            let resArry = [] //返回数组


            // console.log('in service get_mychart')
            survey.overview_indexs.find(findQure).populate({
                path: 'chart',
                populate: [{ path: 'xnzbs' }, { path: 'yconfig' }]
            }).then(res => {
                // console.log('res is ',res)
                let charts = res //图表数组
                charts.forEach(item => {

                    let viewid = item.chart.viewid
                    viewids.push({ viewid: viewid })
                })

                // console.log('viewids is ',viewids)
                if(viewids.length == 0){
                    reject(new Response_status('300','success','用户无自定义视图'))
                } else {
                    jk_charts.jk_datatime_configs.find({ "$or": viewids }).then(res => {
                        let datatime_configArry = res //时间配置数组

                        // console.info('时间配置数据', datatime_configArry)

                        charts.forEach((item, index) => {
                            let viewid = item.chart.viewid
                            datatime_configArry.forEach((datatime_config) => {

                                if (viewid.toString() == datatime_config.viewid.toString()) {
                                    console.info('数据', item)

                                    resArry.push({
                                        chart: item.chart,
                                        datatime_config: datatime_config
                                    })

                                }
                            })

                        })
                        resolve(resArry)
                        // console.info('获取自定义指标概览', resArry)
                    }
                ).catch(err => {
                    reject(err)
                })

            }}).catch(err => {
                // console.log(err)
                reject(err)
            })

        })
    }

}