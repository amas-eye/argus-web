let opentsdb_host = 'opentsdb'  // the opentsdb that agent tranfer data to
let opentsdb_port = '4242'       // the opentsdb that agent tranfer data to
let argus_collector_api_host = 'collector' // the argus-collecor api in argus-collector
let argus_collector_api_port = '8001'      // the argus-collecor api in argus-collector
let chain_collector_api_host = 'chain' //the argus-chain api in argus-collector
let chain_collector_api_port = '9999'      //the argus-chain api in argus-collector
let mongodb_host = 'mongo'         // the mongodb for saving the user config and usage
let mongodb_port = '27017'                 // the mongodb for saving the user config and usage
let mongodb_password = ''                 // the mongodb for saving the user config and usage
let mongodb_user = ''
let redis_host = 'redis'               // the redis for alert
let redis_port = '6379'                    // 
let redis_password = ''                    // 
let redis_db = 0                    // 

let wechat_redis_host = 'redis'   // the redis connected to wechat service
let wechat_redis_port = '6379'            // the redis connected to wechat service
let wechat_redis_db = 1                    //
let wechat_redis_password = 'a$gns_wechat' //
let wechat_api_host = 'alert'     // the wechat web service ip
let wechat_qrcode_path = '/argus-internal/controller/create_qrcode?username='
let wechat_redis_channel = 'wechat_binding_4_dev'

let session_redis_host = 'redis'
let session_redis_port = 6379
let session_redis_db = 2

module.exports = {
    opentsdb_host: opentsdb_host,
    opentsdb_port: opentsdb_port,
    argus_collector_api_host: argus_collector_api_host,
    argus_collector_api_port: argus_collector_api_port,
    chain_collector_api_host: chain_collector_api_host,
    chain_collector_api_port: chain_collector_api_port,
    mongodb_host: mongodb_host,
    mongodb_port: mongodb_port,
    mongodb_password: mongodb_password,
    mongodb_user: mongodb_user,
    redis_host: redis_host,
    redis_port: redis_port,
    redis_db : redis_db,
    redis_password: redis_password,
    wechat_redis_host: wechat_redis_host,
    wechat_redis_port: wechat_redis_port,
    wechat_api_host: wechat_api_host,
    wechat_redis_password: wechat_redis_password,
    wechat_redis_db: wechat_redis_db,
    wechat_qrcode_path: wechat_qrcode_path,
    wechat_redis_channel: wechat_redis_channel,
    session_redis_host: session_redis_host,
    session_redis_port: session_redis_port,
    session_redis_db: session_redis_db
}