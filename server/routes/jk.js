//监控路由
let { isExist } = require('../services/tools')
let { Response_status } = require('../models/httpcode')
let moment = require('moment')
let express = require('express')
let router = express.Router()
let jk_services = require('../services/jk_services')


router.all(function(req, res, next) {
    //该路由下全请求

    next()
})


router.get('/getdatetimeconfigs', function(req, res, next) {
    //获取视图数据获取时间配置

    let option = req.query

    jk_services.get_datetime_configs(option.viewid).then(rep => {
        res.send(rep)
    }).catch(err => {
        res.send(err)
    })

})
router.post('/updatedatetimeconfigs',
    function(req, res, next) {
        //时间配置表单验证
        let option = req.body.datatimeconfig
        // console.info('时间配置', option)
        if (isExist(option.start) && isExist(option.end)) {
            console.info('存在2')
            if (moment(option.start).isBefore(moment(option.end))) {
                console.info('比大小')
                next()
            } else {
                res.send(new Response_status('', 'fail', '结束时间小于开始时间'))
            }
        } else {
            console.info('存在1')
            next()
        }

    },
    function(req, res, next) {
        //更新视图数据获取时间配置

        let option = req.body

        jk_services.update_datetime_configs(option.viewid, option.datatimeconfig).then(rep => {
            res.send(rep)
        }).catch(err => {
            res.send(err)
        })

    })

router.get('/gettags', function(req, res, next) {
    //获取主机分组列表

    // let option = req.query

    jk_services.gettages().then(rep => {
        res.send(rep)
    }).catch(err => {
        res.send(err)
    })

})


router.get('/search', function(req, res, next) {
    //搜索视图

    let option = req.query

    // console.info('查找时间', option) //查询参数

    jk_services.search(
        option.text,
        option.tag,
        parseInt(option.page),
        parseInt(option.onepagecount)
    ).then(rep => {
        res.send(rep)
    }).catch(err => {
        res.send(err)
    })

})

router.get('/viewcount', function(req, res, next) {
    //视图数统计
    let option = req.query
        // console.info('查找时间', option) //查询参数
    jk_services.viewcount(
        option.text,
        option.tag
    ).then(rep => {
        console.info('总数', req)
        res.send({ count: rep })
    }).catch(err => {
        res.send(err)
    })

})


router.post('/addview',
    function(req, res, next) {
        //添加视图表单验证
        let form = req.body
        if (!isExist(form.name)) {
            res.send(new Response_status('', 'fail', '请填写视图名！'))
        } else {
            next()
        }

    },
    function(req, res, next) {
        //添加视图

        console.info('发送消息', req.body.tags)

        jk_services.add(req.body).then(rep => {
            res.send(new Response_status('', 'success', '添加成功！'))
        }).catch(err => {
            // res.send(new Response_status('', 'fail', '添加失败！'));
            res.send(err)
        })


    })

router.post('/update',
    function(req, res, next) {
        //添加视图表单验证
        let form = req.body
        if (!isExist(form.option.name)) {
            res.send(new Response_status('', 'fail', '请填写视图名！'))
        } else {
            next()
        }

    },
    function(req, res, next) {
        //更新视图

        console.info('发送消息', req.body)
        let data = req.body

        jk_services.update(data.id, data.option).then(rep => {
            res.send(rep)
        }).catch(err => {
            res.send(err);
        })


    })


router.post('/remove', function(req, res, next) {
    //删除视图

    console.info('发送消息', req.body)
    let data = req.body

    jk_services.remove(data.id).then(rep => {
        res.send(rep)
    }).catch(err => {
        res.send(err);
    })


})


router.post('/addchart',
    function(req, res, next) {
        //添加图表单验证
        let option = req.body.option
        let pass = true //是否通过

        console.info('图表配置验证', option)
        for (let i = 0; i < option.pfm_index.length; i++) {
            let item = option.pfm_index[i]
                //指标配置数组
            if (!isExist(item.zbname)) {
                //指标名
                res.send(new Response_status('', 'fail', '请填写指标名！'))
                pass = false
                break;
            } else if (!isExist(item.aggfun)) {
                //聚合函数
                res.send(new Response_status('', 'fail', '请填写聚合函数！'))
                pass = false
                break;
            } else if (isExist(item.qytime) || isExist(item.qytimed) || isExist(item.qyfun)) {
                if (!(isExist(item.qytime) && isExist(item.qytimed) && isExist(item.qyfun))) {
                    res.send(new Response_status('', 'fail', '请填写完善取样所有信息！'))
                    pass = false
                    break;
                } else if (item.qytime < 0) {
                    res.send(new Response_status('', 'fail', '取样时间必须大于0！'))
                    pass = false
                    break;
                }
            } else {
                for (let j = 0; j < item.tag.length; j++) {
                    //遍历tag配置
                    let tag = item.tag[j]
                    if (!(isExist(tag.key) && isExist(tag.value))) {
                        res.send(new Response_status('', 'fail', '请完善TAG！'))
                        pass = false
                        break;
                    }
                }
            }
        }
        if (pass) {
            next()
        }

    },
    function(req, res, next) {
        //添加图表

        // console.info('发送消息', req.body)
        let data = req.body

        jk_services.addchart(data.viewid, data.option).then(rep => {
            res.send(rep)
        }).catch(err => {
            res.send(err);
        })

    })

router.post('/editchart',

    function(req, res, next) {
        //添加图表单验证
        let option = req.body.option
        let pass = true //是否通过

        // console.info('图表配置验证', option)
        for (let i = 0; i < option.pfm_index.length; i++) {
            let item = option.pfm_index[i]
                //指标配置数组
            if (!isExist(item.zbname)) {
                //指标名
                res.send(new Response_status('', 'fail', '请填写指标名！'))
                pass = false
                break;
            } else if (!isExist(item.aggfun)) {
                //聚合函数
                res.send(new Response_status('', 'fail', '请填写聚合函数！'))
                pass = false
                break;
            } else if (isExist(item.qytime) || isExist(item.qytimed) || isExist(item.qyfun)) {
                if (!(isExist(item.qytime) && isExist(item.qytimed) && isExist(item.qyfun))) {
                    res.send(new Response_status('', 'fail', '请填写完善取样所有信息！'))
                    pass = false
                    break;
                } else if (item.qytime <= 0) {
                    res.send(new Response_status('', 'fail', '取样时间必须大于0！'))
                    pass = false
                    break;
                }
            } else {
                for (let j = 0; j < item.tag.length; j++) {
                    //遍历tag配置
                    let tag = item.tag[j]
                    if (!(isExist(tag.key) && isExist(tag.value))) {
                        res.send(new Response_status('', 'fail', '请完善TAG！'))
                        pass = false
                        break;
                    }
                }
            }
        }
        if (pass) {
            next()
        }

    },
    function(req, res, next) {
        //编辑图表
        // console.info('发送消息', req.body)
        let data = req.body

        jk_services.editchart(data.option).then(rep => {
            res.send(rep)
        }).catch(err => {
            res.send(err);
        })

    })

router.get('/searchart', function(req, res, next) {
    //搜索获取图表

    // console.info('发送消息', req.body)
    let data = req.query

    jk_services.searchart(data.viewid).then(rep => {
        res.send(rep)
    }).catch(err => {
        res.send(err);
    })

})


router.get('/removechart',function(req,res,next){
    let id = req.query.id
    // console.log('delete chart id is ',id)
    jk_services.remove_chart(id).then((rep)=>{
        res.send(rep)
    }
    ).catch((err)=>{
        res.send(err)
    })
})

router.post('/tablequery',function(req,res,next){
    let metrics = req.body['metrics']
    // console.info("metrics is ",metrics)
    jk_services.table_query_data(metrics).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})

router.get('/strategyRelated',function(req,res,next){
    let metric = req.query.metric
    // console.log('receive metric is ',metric)
    jk_services.query_strategy_for_view(metric).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err)
    })
})

module.exports = router