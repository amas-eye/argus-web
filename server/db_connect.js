/**
 * Created by Administrator on 2017/4/13.
 * mongodb 数据库的连接们
 */
// 读取外部配置
// Reading configuration from conf
var dbconfigs = require('./start_config')
var MONGO_HOST = dbconfigs.mongodb_host;
var MONGO_PORT = dbconfigs.mongodb_port;
var MONGO_PASSWORD = dbconfigs.mongodb_password;
var MONGO_USER = dbconfigs.mongodb_user;
var REDIS_HOST = dbconfigs.redis_host;
var REDIS_PORT = dbconfigs.redis_port;
var REDIS_DB = dbconfigs.redis_db;
var REDIS_PASSWORD = dbconfigs.redis_password;
var WECHAT_REDIS_HOST = dbconfigs.wechat_redis_host;
var WECHAT_REDIS_PORT = dbconfigs.wechat_redis_port;
var WECHAT_REDIS_PASSWORD = dbconfigs.wechat_redis_password;
var WECHAT_REDIS_DB = dbconfigs.wechat_redis_db;

// import third party db client
var REDIS = require('ioredis');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise; //原生es6 promise

// import name of databases 
var argus_web = 'argus-web';
var argus_statistic = 'argus-statistics';
var argus_alert = 'argus-alert';
var argus_users = 'argus-users';
var session_db = 'session'


function connect_redis(host,port,password,db){
    // get the connection object to redis
    if(db == 0 && password == ''){
        var redis_connection = new REDIS({host:host,port:port});
    }
    else if(db != 0 && password == ''){
        var redis_connection = new REDIS({host:host,port:port,db:db})
    }
    else if(db == 0 && password != ''){
        var redis_connection = new REDIS({host:host,port:port,password:password})
    }
    else{
        var redis_connection = new REDIS({host:host,port:port,password:password,db:db})
    }

    return redis_connection;
}

function connect_mongo(db){
    console.log('HOSt',MONGO_HOST)
   if( MONGO_USER != '' && MONGO_PASSWORD != ''){
        var dburl = 'mongodb://'+ MONGO_USER + ":" + MONGO_PASSWORD +'@'+ MONGO_HOST+":"+MONGO_PORT+'/'+db
    } else {
        var dburl = 'mongodb://'+ MONGO_HOST +':'+MONGO_PORT+'/'+ db
    }
    // console.log('dburl',dburl)
    var dbConnection = mongoose.createConnection(
        // "mongodb://"+ MONGO_HOST + ":" +"/" + db,{
         dburl,{
            config: {
                autoIndex: false //不自动创建索引
            },
            server: {
                auto_reconnect: true //自动重连
            }
        }
    )

    dbConnection.on('open',()=>{
        console.log(db+'连接成功')
    })  

    dbConnection.on('error',()=>{
        console.log(db+'连接失败')
    })

    dbConnection.on('close',()=>{
        console.log(db+'连接关闭')
    })

    return dbConnection;
}

let connect_alert_redis = ()=>{ return connect_redis(REDIS_HOST,REDIS_PORT,REDIS_PASSWORD,REDIS_DB) }
let connect_wechat_redis = ()=>{ return connect_redis(WECHAT_REDIS_HOST,WECHAT_REDIS_PORT,WECHAT_REDIS_PASSWORD,WECHAT_REDIS_DB) }

let connect_argus = ()=>{
    console.log('connect_argus_users,db is'+argus_web)
    return connect_mongo(argus_web)
}

let connect_argus_statistics = ()=>{
    console.log('connect_argus_users,db is'+argus_statistic)
    return connect_mongo(argus_statistic)
}

let connect_argus_alert = ()=>{
    console.log('connect_argus_users,db is'+argus_alert)
    return connect_mongo(argus_alert)
}

let connect_argus_users = ()=>{
    console.log('connect_argus_users,db is'+argus_users)
    var b = connect_mongo(argus_users)
    console.log('b type is ',typeof(b))
    return b
}

module.exports = {
    // test: connect_Test(), // test数据库的链接
    argus: connect_argus(), //argus-web数据库 监控
    argus_statistics: connect_argus_statistics(), //argus-statistics数据库 总体概况
    argus_alert: connect_argus_alert(), //argus-alert数据库 告警
    argus_users: connect_argus_users(), //arugs-users数据库 用户数据库
    alert_redis: connect_alert_redis(),
    wechat_redis: connect_wechat_redis()
}