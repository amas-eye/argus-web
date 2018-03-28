//概览路由

let express = require('express')
let router = express.Router()
let _ = require('lodash')
let { isExist } = require('../services/tools')
let { Response_status } = require('../models/httpcode')
let alert_services = require('../services/alert')


router.all(function(req, res, next) {
    //该路由下全请求

    next()
})


router.get('/get_warn_label', function(req, res, next) {
    //获取告警策略标签 列表

    let option = req.query

    alert_services.get_warn_label().then(rep => {
        res.send(rep)
    }).catch(err => {
        res.send(err)
    })

})

router.get('/get_warn_strategy',

    function(req, res, next) {
        //获取告警策略 列表

        let option = req.query

        alert_services.get_warn_strategy(
            option.text,
            option.label,
            parseInt(option.page),
            parseInt(option.onepagecount),
            option.level
        ).then(rep => {
            res.send(rep)
        }).catch(err => {
            res.send(err)
        })

    })

router.get('/get_strategy_count', function(req, res, next) {
    //获取告警策略数

    let option = req.query
    alert_services.strategycount(
        option.text,
        option.label,
        option.exact_text,
        option.level,
    ).then(rep => {
        res.send({ count: rep })
    }).catch(err => {
        res.send(err)
    })
})

router.post('/add_warn_strategy',
    function(req, res, next) {
        //告警策略表单验证
        let option = req.body.option
            // console.info('告警策略', option)
        let tsd_rule = option.tsd_rule

        if (!isExist(option.property.name)) {
            res.send(new Response_status('', 'fail', '请填写策略名！'))
        } else if (!isExist(option.tsd_rule.metric)) {
            res.send(new Response_status('', 'fail', '请填写指标名！'))
        } else if (!isExist(option.interval)) {
            res.send(new Response_status('', 'fail', '请填写检查间隔！'))
        } else if (isNaN(parseInt(option.interval)) || option.interval < 1 || /^\d+\.\d\d$/.test(option.interval)) {
            res.send(new Response_status('', 'fail', '检查间隔必须大于0的整数！'))
        }  else if (isNaN(parseInt(tsd_rule.time_duration)) || tsd_rule.time_duration < 1 || /^\d+\.\d\d$/.test(tsd_rule.time_duration)) {
            res.send(new Response_status('', 'fail', '规则描述，时间必需为正整数！'))
        }
        //  else if (isNaN(parseFloat(tsd_rule.threshold))) {
        //     res.send(new Response_status('', 'fail', '规则描述，阀值必需为数值！'))
        // } 
        else {
            //阈值保留千位
            
            if (option.type == 'basic') {
                if(!(isExist(tsd_rule.time_duration) && isExist(tsd_rule.time_unit) && isExist(tsd_rule.sample) && isExist(tsd_rule.comparison) && isExist(tsd_rule.threshold))){
                res.send(new Response_status('', 'fail', '请按规范填写完善规则描述！'))
                }
                option.tsd_rule.threshold = parseFloat(option.tsd_rule.threshold).toFixed(3) 
            } 
            else {
                    if(!(isExist(tsd_rule.time_duration) && isExist(tsd_rule.time_unit) && isExist(tsd_rule.sample) && isExist(tsd_rule.hb_interval) && isExist(tsd_rule.hb_unit))){
                    res.send(new Response_status('', 'fail', '请按规范填写完善规则描述(环比错误)！'))
                    }
            }          
            
            next()
        }


    },
    function(req, res, next) {
        //添加告警策略
        let option = req.body.option

        // console.info('添加',option)
        alert_services.add_warn_strategy(option).then(rep => {
            res.send(rep)
        }).catch(err => {
            res.send(err)
        })

    })

router.post('/update_warn_strategy',
function(req, res, next) {
    //告警策略表单验证
        let option = req.body.option
            // console.info('告警策略', option)
        let tsd_rule = option.tsd_rule

        if (!isExist(option.property.name)) {
            res.send(new Response_status('', 'fail', '请填写策略名！'))
        } else if (!isExist(option.tsd_rule.metric)) {
            res.send(new Response_status('', 'fail', '请填写指标名！'))
        } else if (!isExist(option.interval)) {
            res.send(new Response_status('', 'fail', '请填写检查间隔！'))
        } else if (isNaN(parseInt(option.interval)) || option.interval < 1 || /^\d+\.\d\d$/.test(option.interval)) {
            res.send(new Response_status('', 'fail', '检查间隔必须大于0的整数！'))
        }  else if (isNaN(parseInt(tsd_rule.time_duration)) || tsd_rule.time_duration < 1 || /^\d+\.\d\d$/.test(tsd_rule.time_duration)) {
            res.send(new Response_status('', 'fail', '规则描述，时间必需为正整数！'))
        }else {
            //阈值保留千位
            
            if (option.type == 'basic') {
                if(!(isExist(tsd_rule.time_duration) && isExist(tsd_rule.time_unit) && isExist(tsd_rule.sample) && isExist(tsd_rule.comparison) && isExist(tsd_rule.threshold))){
                res.send(new Response_status('', 'fail', '请按规范填写完善规则描述！'))
                } 
            } 
            else {
                    if(!(isExist(tsd_rule.time_duration) && isExist(tsd_rule.time_unit) && isExist(tsd_rule.sample) && isExist(tsd_rule.hb_interval) && isExist(tsd_rule.hb_unit))){
                    res.send(new Response_status('', 'fail', '请按规范填写完善规则描述(环比错误)！'))
                    }
            }          
            option.tsd_rule.threshold = parseFloat(option.tsd_rule.threshold).toFixed(3)
            next()
        }


    } ,
    function(req, res, next) {
        //更改告警策略
        let option = req.body.option
        alert_services.update_warn_strategy(option).then(rep => {
            res.send(rep)
        }).catch(err => {
            res.send(err)
        })

    })

router.post('/del_warn_strategy', function(req, res, next) {
    //删除告警策略
    let id = req.body.id
    alert_services.del_warn_strategy(id).then(rep => {
        res.send(rep)
    }).catch(err => {
        res.send(err)
    })

})
router.post('/toggle_warn', function(req, res, next) {
    //切换告警开关
    let option = req.body
    alert_services.toggle_warn(option.id, option.val).then(rep => {
        res.send(rep)
    }).catch(err => {
        res.send(err)
    })

})
router.get('/get_warn_history', function(req, res, next) {
    //获取告警历史

    let option = req.query
    // console.log('option',option)

    alert_services.get_warn_history(
        option.exact_text,
        option.text,
        parseInt(option.page),
        parseInt(option.onepagecount),
        JSON.parse(option.date),
        option.is_recover,
        option.level
    ).then(rep => {
        res.send(rep)
    }).catch(err => {
        res.send(err)
    })

})

router.get('/get_history_count', function(req, res, next) {
    //获取告警历史数

    let option = req.query

    alert_services.historycount(
        option.exact_text,
        option.text,
        JSON.parse(option.date),
        option.is_recover,
        option.level
    ).then(rep => {
        res.send({ count: rep })
    }).catch(err => {
        res.send(err)
    })

})



module.exports = router