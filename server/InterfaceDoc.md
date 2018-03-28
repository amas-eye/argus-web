# 所有操作
1. 对于用户的操作
2. 对于用户组的操作


###对于用户的操作：
0. 获取该登陆用户的权限和个人信息
URL: /argus/user/get_user_info
HTTP_method: GET

#####返回值
{
    "user": {
        "_id": "5a12488e1caa570007f7f626",
        "username": "root",
        "name": "管理员",
        "password": "56b9ef33ce377d936414017220e55d1beb915c5697af91fc4f112546234338619c100b781955dd6287f732e8eef60b84ba6278de7cbc45f343d8031a43b3f22d",
        "is_admin": true,
        "group_name": "admin",
        "mail": "163@63.com",
        "cell_phone": "123-88888",
        "wechat_id": "88888",
        "__v": 1,
        "update_time": "2017-11-20T03:04:00.000Z",
        "create_time": "2017-11-20T03:04:00.000Z"
    },
    "pri": [
        {
            "_id": "5a17c6971caa570007f7f62a",
            "group_name": "admin",
            "group_privilieged": {
                "dashboard": "rw",
                "jk": "rw",
                "alert": "rw",
                "caiji": "rw",
                "chain": "rw"
            }
        }
    ]
}

user字段为该用户的所有信息
pri 为该用户对应的用户组的权限

1. 微信登陆
URL: /argus/login/wechat_login
HTTP_method: GET
参数：
1. openid 

#####返回值
正常: {'200','success','用户微信登录成功'}
异常：{'250,'fail','该微信未绑定用户'}

2. 登录
URL: /argus/login/login 
HTTP_method: POST

发送格式：FORM
参数：
1. username 用户名
2. password 密码

#####返回值
正常：200
异常: 250
      251

3. 登出
URL: /argus/login/logout
HTTP_method: GET
发送内容：空

#####返回值
正常：201
异常: 500

4. 查询自己的信息(用户中心的个人中心)
URL: /argus/user/userinfo
HTTP_method: GET


#####返回值
正常：个人信息
异常: 
{'350','fail',具体提示}
{'500','fail','用户未登录'}

5. 修改个人信息
URL: /argus/user/userinfo
HTTP_method:POST

发送格式：FORM
参数：
1. name #用户名
2. mail #邮箱地址
3. wechat_id # 微信ID
4. slack_hook # slack 钩子
5. old_password # 旧密码
6. new_password # 新密码

#####返回值
正常：{'300','success','修改个人信息成功'}
异常: 
{'350','fail',具体提示}
{'500','fail','用户未登录'}

6. 添加用户（需要权限才能进行)
URL: /argus/user/addUser
HTTP_method: POST
发送格式： FORM
参数：
1. username #用户用于登录系统的账户
2. name #用户名
3. mail #邮箱
4. wechat_id #微信ID
5. slack_hook # slack钩子
6. password # 密码
7. group_name # 所属用户组
注意：除了所属用户组为ARRRY以外，其他都是string类型

#####返回值
正常： {'300','success','添加用户成功'}
异常： 
{'350','fail',具体提示}
{'500','fail','用户未登录'}
      

7. 获取所有用户列表(需要权限才能进行)
URL: /argus/user/showUser
HTTP_method: GET
参数（附在URL中）
1. page 页数
2. items_num 每页的条数
3. compare  匹配的条件
4. group 用户组

#####返回值
正常： 用户的数据信息（条数为每页的条数）
异常:  
{'350','fail',具体提示}
{'500','fail','用户未登录'}



8. 删除用户
URL: /argus/user/deleteuser
HTTP_method: POST
发送格式：FORM

extra: 支持批量删除
参数：
1. deleteuser # 被删除的账号(用户的username)， 可能为string 可能为一个string的数组

#####返回值
正常： {'300','success','删除用户成功'}
异常： {'350','fail',具体提示}

9. 获取所有页数 (需要管理员权限 >= admin 组级别)
URL: /argus/user/show_all_pages
HTTP_method: GET
参数：
1. group 用户组
2. compare 匹配条件
3. items_num 每页的条数

#####返回值
正常： 页数数据(String)
异常： 
{'350','fail',具体提示}

10. 编辑用户时获取该那用户信息 (需要管理员权限 >= admin 组级别)
URL: /argus/user/getoneUser
HTTP_method: GET
参数
1. username #需要被修改的用户的账号名
#####返回值
正常： 用户信息（一条完整的用户记录）
异常： 
{'350','fail',具体提示}


11. 编辑用户后提交信息  (需要管理员权限 >= admin 组级别)

URL: /argus/user/changeUserByadmin
HTTP_method: POST
发送格式： FORM
参数：
1. username
2. name 
3. mail
4. wechat_id
5. cell_phone
6. slack_hook
7. password (如果不需要修改密码，传递Undefind)
8. group_name

#####返回值
正常：{'300','success','编辑用户成功'}
异常：
{'350','fail',具体提示}
{'500','fail','用户未登录'}

12. 手机版进行微信绑定
URL: /argus/login/wechat_binding_phone
HTTP_method: GET

#####返回值
正常：{'300','success','手机微信绑定成功'}
异常： {'350','fail',提示信息}

###对于组的操作
-1. 获得组并且订阅的用户名
URL: /argus/user/GrouptoUser
HTTP_METHOD: GET
######返回值
正常：

[{
        "_id": "5a1fa98960a8314d5a1eeab5",
        "group_name": "AAA",
        "users": [
            {
                "_id": "5a2d3a41b1480a1fb4b96afc",
                "username": "hhh_test"
            }
        ]
    }]
    

0. 获得所有组的权限
URL: /argus/user/get_all_group
HTTP_method: GET
#####返回值
正常：
[
    {
        "_id": "5a1b86417d86775344a23248",
        "group_name": "管理员123",
        "__v": 0,
        "group_privilieged": {
            "dashboard": {
                "read": true,
                "_id": "5a1b87c749fbf32558a28870"
            },
            "jk": {
                "read": true,
                "write": true,
                "_id": "5a1b87c749fbf32558a2886f"
            },
            "caiji": {
                "read": true,
                "write": false,
                "_id": "5a1b87c749fbf32558a2886e"
            },
            "alert": {
                "read": true,
                "write": true,
                "_id": "5a1b87c749fbf32558a2886d"
            },
            "chain": {
                "read": true,
                "write": false,
                "_id": "5a1b87c749fbf32558a2886c"
            },
            "_id": "5a1b87c749fbf32558a2886b"
        },
        "users": []
    },
    {
        "_id": "5a1b885449fbf32558a28889",
        "group_name": "admin",
        "group_privilieged": {
            "dashboard": {
                "read": true,
                "_id": "5a1b885449fbf32558a2888f"
            },
            "jk": {
                "read": true,
                "write": true,
                "_id": "5a1b885449fbf32558a2888e"
            },
            "caiji": {
                "read": true,
                "write": true,
                "_id": "5a1b885449fbf32558a2888d"
            },
            "alert": {
                "read": true,
                "write": true,
                "_id": "5a1b885449fbf32558a2888c"
            },
            "chain": {
                "read": true,
                "write": true,
                "_id": "5a1b885449fbf32558a2888b"
            },
            "_id": "5a1b885449fbf32558a2888a"
        },
        "__v": 0,
        "users": []
    }...
    
]

异常： 361

1. 展示组名
URL: /argus/user/showGroup
HTTP_method: GET

#####返回值
正常： 所有的组名
异常： 
{'350','fail',具体提示}
{'500','fail','用户未登录'}


2. 获得该组所拥有权限
URL: /argus/user/getgroupPrivilieged
HTTP_method: GET
参数：
1. groupname #需要获得权限用于展示的组名

#####返回值
正常： 权限数据，每个权限可能值为r、rw、w或者空
异常： 
{'350','fail',具体提示}
{'500','fail','用户未登录'}


      
3. 修改用户组(包括了删除)
URL: /argus/user/changeGroup
HTTP_method: POST
格式： FORM
参数：
0. changeGroup  # 需要进行修改操作的组（传参值为数组，里面存放的是对象）
1. delGroup  ##需要进行删除操作的组 （传参值为数组，存放的是删除组的id）


一个changeGroup的数据实例：
{"changeGroup":[
   {
    "_id": "5a1d23877761310006e68d1f",
    "group_name": "change6",
    "group_privilieged": {
        "dashboard": "rw",
        "caiji": "rw",
        "alert": "rw",
        "chain": "rw",
        "jk": "rw"
    },
    "users": [],
    "__v": 0
  },
  {
    "_id": "5a1d1c217761310006e68d2a",
    "group_name": "change5",
    "group_privilieged": {
        "dashboard": "r",
        "caiji": "r",
        "alert": "r",
        "chain": "r",
        "jk": "r"
    },
    "users": [],
    "__v": 0
  }
]}
一个delGroup的数据示例：
{"delGroup":[5a1d5dde7761310006e68d12, 5a1d5dde7761310006e68d11]}

注意：权限可以接受值为{read:true/false, write:true/false}
#####返回值
正常： {'900','success','用户组修改成功'}
异常： 
{'350','fail',具体提示}
{'500','fail','用户未登录'}



###微信登陆相关
0. 获取二维码图片
URL: /argus/user/get_qr_code
HTTP_METHOD: GET

#####返回值
正常： 一个微信的URL(https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQGu8DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAybmpxYXNLSThlMDMxYVFLRWhxYzcAAgSIrShaAwQsAQAA)

异常： 358

1. 微信绑定查询
URL: /argus/user/check_wechat_binding
HTTP_METHOD: GET
#####返回值
待确定绑定成功
{
    "code": "350",
    "status": "waiting",
    "text": ""
}

已绑定成功哦那个
{
    "code": "310",
    "status": "success",
    "text": "微信绑定成功"
}

绑定失败
{
    "code": "360",
    "status": "fail",
    "text": "db fail"
}


2. 微信解绑
URL: /argus/user/wechat_unbinding
HTTP_METHOD: GET

#####返回值
正常
{
    "code": "300",
    "status": "success",
    "text": "微信解绑成功"
}

异常：
{
    "code": "360",
    "status": "fail",
    "text": "微信解绑失败，数据库错误"
}

{
    "code": "350",
    "status": "fail",
    "text": "微信解绑失败，插入错误"
}


## 表格展示形式
0. 表格数据接口
URL: /argus/jk/tablequery
HTTP_METHOD: POST

##### 参数
metrics

metrics事例：
metrics = [{metric:$metric,host=$host},......]

realE.g :{"metrics":[{"metric":"cluster.cpu.usage","host":"*"},{"metric":"cluster.net.dev.transmit","host":"cdh180"}]}

##### 返回值
正常

[
    {metric:$metric,alert:Boolean,values:[{value:$value,host=$host,last_update_time:$time},....]},
    ....

]

Real E.g:
[
    {
        "metric": "cluster.cpu.usage",
        "alert_status": "alert",
        "host_value": [
            {
                "value": "0.07999999821186066",
                "host": "ArgusHost",
                "last_timestamp": 1515510100000
            },
            {
                "value": "0.6299999952316284",
                "host": "cdh182",
                "last_timestamp": 1515509700000
            },
            {
                "value": "0.3799999952316284",
                "host": "cdh180",
                "last_timestamp": 1515509700000
            }
        ]
    },
    {
        "metric": "cluster.net.dev.transmit",
        "alert_status": "ok",
        "host_value": [
            {
                "value": "1428.02001953125",
                "host": "cdh180",
                "last_timestamp": 1515509700000
            }
        ]
    }
]


1. 视图告警相关阈值获取
URL: /argus/jk/strategyRelated
http_method: GET

##### 参数：
metric  指标名

##### 返回值：
[
    {
        "relateAlertName": "规则名:CPU 阈值:0.500"
    },
    {
        "relateAlertName": "规则名:ttt 阈值:0.400"
    },
    {
        "relateAlertName": "规则名:add 阈值:0.500"
    },
    {
        "relateAlertName": "规则名:test_latest 阈值:0.500"
    }
]





视图相关接口：
0. 删除视图
URL: /argus/jk/removechart
http_method: GET

##### 参数
id   需要删除图的id

##### 返回值
{‘success'}



