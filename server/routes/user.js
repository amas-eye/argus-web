let express = require('express');
let user_services = require('../services/users')
let group_services = require('../services/login')
let {Response_status} = require('../models/httpcode')
let router = express.Router();

//TODO for all 需要对所有path都添加权限管理， except /userinfo 路径


// router.all(function(req, res, next) {
//     //该路由下全请求
//     if(req.session.Islogin){
//         next()
//     } else {
//         res.send('500')
//     }
//     console.info('请求', res)
//     // next(res)
// })

router.get('/userinfo',(req, res)=>{
    //读取改用户信息
    //Done
    var username = req.session.username;
    console.info(username);
    user_services.get_user_data(username).then(function(result){
        console.log(result)
        res.send(result)
    })
})


router.post('/userinfo',(req,res)=>{
   //修改用户信息
   let username = req.session.username;
   let name = req.body.name;
   let mail = req.body.mail;
   let wechat_id = req.body.wechat_id;
   let slack_hook = req.body.slack_hook;
   let old_password = req.body.old_password;
   let new_password = req.body.new_password;
   let cell_phone = req.body.cell_phone;
   console.info(username, name, mail, wechat_id, slack_hook, old_password, new_password);
   if(new_password && old_password == ""){
       var post_data = {"name":name, "mail":mail, "slack_hook":slack_hook,"wechat_id":wechat_id,
                        "cell_phone":cell_phone
                       }
   } else {
       var post_data = {"name":name, "mail":mail, "slack_hook":slack_hook,
                    "wechat_id":wechat_id, "old_password":old_password,
                    "new_password":new_password,"cell_phone":cell_phone
       }
   }
   console.info(post_data);
   user_services.save_user_data(username, post_data).then(function(result){
     res.send(result)
   },(err)=>{
       res.send(err)
   })
})


router.get('/showUser',(req,res)=>{
    //读取用户管理信息
    var page = req.query.page //用于接收用户请求的页数,目前假设每页有10条
    var items_num = req.query.items_num // 用于确定获取的条数
    var compare = req.query.compare 
    var group = req.query.group
    user_services.show_user(page, items_num, compare, group).then(function(data){
        res.send(data)
    },function(err){
        res.send(err)
    })
})

// router.get('/get_all_user', (req,res)=>{
//     //这个接口是用于给前端获取所有用户信息到vue全局变量中
//     user_services.get_all_user().then(function(result){
//         res.send(result)
//     }, function(err){
//         res.send(err)
//     })
// })

router.get('/get_qr_code', (req,res)=>{
    var username = req.session.username
    user_services.get_qr_code(username).then(function(qr_code){
        res.send(qr_code)
    },function(err){
        res.send(err)
    })
})

router.get("/check_wechat_binding", (req,res)=>{
    var username = req.session.username
    user_services.check_wechat_binding(username).then((result)=>{
        res.send(result)
    }, (err)=>{
        res.send(err)
    })
})

router.get('/wechat_unbinding',(req,res)=>{
    var username = req.session.username
    user_services.wechat_unbinding(username).then((result)=>{
        req.session.wechat_login = 0;
        res.send(result)
    },(err)=>{
        res.send(err)
    })
})

router.get('/getoneUser', (req,res)=>{
    var username = req.query.username
    user_services.get_one_user(username).then(function(result){
        res.send(result)
    }, function(err){
        res.send(err)
    })
})


router.post('/changeUserByadmin', (req, res)=>{
    var id = req.body._id
    var username = req.body.username
    var name = req.body.name
    var mail = req.body.mail
    var wechat_id = req.body.wechat_id
    var password = req.body.password
    var cell_phone = req.body.cell_phone
    var groups = req.body.group_name
    console.info(name)
    new_data = {"username":username, "name":name, "mail":mail,
                "wechat_id":wechat_id, "password":password,
                "cell_phone":cell_phone, "groups":groups
               }
    console.info(new_data)
    user_services.change_user_admin(id, new_data).then(function(result){
        res.send(result)
        },function(err){
            res.send(err)
        })
})

router.get('/show_all_pages',(req,res)=>{
    var group = req.query.group
    var compare = req.query.compare
    var items = req.query.items_num
    user_services.show_all_pages(compare, group, items).then(function(result){
        res.send(result)
    },function(err){
        res.send(err)
    })
})


router.post('/addUser', (req,res)=>{
    //添加用户
    //DOne
    let username = req.body.username;
    let name = req.body.name;
    let mail = req.body.mail;
    let wechat_id = req.body.wechat_id;
    let slack_hook = req.body.slack_hook;
    let password = req.body.password;
    let cell_phone = req.body.cell_phone;
    let groups = req.body.group_name;
    // console.info(groups)
    if(username == '' | groups == '' | name == ''){
        res.send(new Response_status('350','fail','缺少信息必要信息，请补全'))
    } else {
        if(password == ''){
            password = '123456'
        }
        let post_data = {"name":name, "mail":mail, "slack_hook":slack_hook,
        "wechat_id":wechat_id, "password":password,
        "username":username, "groups":groups,
        "cell_phone":cell_phone
        }
        console.info(post_data)
        user_services.add_user(username, post_data).then(function(err,result){
        if(err){
            res.send(err)
        }
        res.send(result)
        })
    }
})

router.post('/deleteUser', (req,res)=>{
    let deleteuser = req.body.deleteuser
    user_services.delete_user(deleteuser).then(
        (result)=>{
            res.send(result)
        }, (err)=>{
            res.send(err)
        }
    )
})

router.get('/showGroup', (req,res)=>{
    //用户组首页
    var username = req.session.username;
    var privileged 
    user_services.get_group().then(function(result){
        res.send(result);
    },function(err){
        res.send(err)
    })
})

router.get("/get_user_info",(req,res)=>{
    username = req.session.username;
    user_services.get_user_info(username).then((result)=>{
        res.send(result)
    },(err)=>{
        res.send(err)
    })
})

router.get('/get_all_group', (req,res)=>{
    //这个接口是给前端获取所有组信息存放到vue全局变量当中
    user_services.get_all_group().then(function(result){
        res.send(result)
    },function(err){
        res.send(err)
    })
})

router.get("/getgroupPrivilieged", (req,res)=>{
    // DOne， 需要添加权限
    var groupname = req.query.groupname;
    console.info(groupname)
    user_services.get_group_Privilieged(groupname).then((result)=>{
        res.send(result)
    },(err)=>{
        res.send(err)
    })
})


router.post('/changeGroup', (req,res)=>{
  //修改用户组
  var changeGroup = req.body.changeGroup
  var delGroup = req.body.delGroup
  user_services.change_group(changeGroup, delGroup).then((result)=>{
    res.send(result)
   },(err)=>{
      res.send(err)
   })
})

router.get('/Grouptouser', (req,res)=>{
    user_services.GrouptoUser().then((result)=>{
        res.send(result)
    },(err)=>{
        res.send(err)
    })
})

module.exports = router