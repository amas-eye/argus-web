// This router is for system to login and logout
let { Response_status } = require('../models/httpcode')
let express = require('express');
let router = express.Router();
let login = require('../services/login');
// let user = require('../models/user')
let crypto = require('crypto');
router.all(function(req, res, next) {
    //该路由下全请求

    next()
})


router.post('/login', function(req, res, next) {
    // 接收登录的请求
    // 此处因为需要权限，所以需要进行同步加密
    //console.info("in login function")
    var username = req.body.username;
    var password = req.body.password;
    crypto.pbkdf2(password, 'argus', 5000, 64, 'sha256',function(err,encry_password){
        if(err){
            res.send(err)
        }
        let str_password = encry_password.toString('hex')
        login.login(username,str_password).then((status_num)=>{
            req.session.Islogin = 1;
            req.session.username = username;
            //console.info("welcome first time")
            res.cookie('argus_Islogin', 1, { expires: new Date(Date.now() + 60 * 60 * 1000) })
            if(req.session.wechat_login != undefined){
                req.session.wechat_login = 1;
            }
            res.send(status_num);
        }).catch((err)=>{
            res.send(err)
        })
    })
    
})

router.get('/wechat_login',function(req,res,next){
    // 使用openid进行登录的操作
    var openid = req.query.openid;
    console.log("openid is ", openid)
    login.wechat_login(openid).then(function(username){
        req.session.Islogin = 1;
        req.session.username = username;
        req.session.openid = openid;
        req.session.wechat_login = 1;
        console.log('wechat username is ',username)
        res.send(new Response_status('200','success','微信登陆成功'))
    }).catch(function(err){
        req.session.openid = openid;
        req.session.wechat_login = 0;
        res.send(err)
    })
})

router.get('/wechat_binding_phone',function(req,res,next){
    var username = req.session.username;
    var openid = req.session.openid;
    login.wechat_binding_phone(username,openid).then((bingding_state)=>{
        res.send(bingding_state)
    },(err)=>{
        res.send(err)
    })
})

router.get('/logout', (req, res) => {
    //接收登出的请求
    if (req.session.Islogin) {
        req.session.Islogin = 0
        res.cookie('argus_Islogin', 0, { expires: new Date(Date.now() + 60 * 1000) })
        res.send(new Response_status('201','success','logout success'))
    } else {
        res.cookie('argus_Islogin', 0, { expires: new Date(Date.now() + 60 * 1000) })
        res.send(new Response_status('500','fail','no logined'))
    }
})

// router.use(function(req,res,next){
//     console.log("in final router middleware")
//     console.log(req.session.Islogin)
//     if(req.session.Islogin){
//         res.cookie('argus_Islogin',1)
//     } else {
//         res.cookie('argus_Islogin',0)
//     }
//     next()
// })


module.exports = router
