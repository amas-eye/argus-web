// const easyMonitor = require('easy-monitor');
// easyMonitor('argus_web');

// import the setiing of redis_session
let session_host = require('./start_config').session_redis_host
let session_port = require('./start_config').session_redis_port
let session_db = require('./start_config').session_redis_db

// third part module
let express = require('express')
let path = require('path')
let cors = require('cors') //跨域插件
let favicon = require('serve-favicon')
let proxy = require('express-http-proxy') //express http代理
let express_session = require('express-session')
let compression = require('compression')

let history = require('connect-history-api-fallback'); //vue h5模式中间件
let cookieParser = require('cookie-parser') //cookie解析中间件
let bodyParser = require('body-parser') //请求体中间件
let winston = require('winston'), //node日志插件
    expressWinston = require('express-winston') //express日志中间件 
// let MongoStore = require('connect-mongo')(express_session)// express-session in mongo
let RedisStore = require('connect-redis')(express_session)//express-session in redis
let moment = require('moment')

// router module
let indexRoute = require('./routes/index') //根路由(base_route)
let jk = require('./routes/jk') //监控模块路由(route for monitor module)
let survey = require('./routes/survey') //总体概况路由(route for dashboard)
let alert = require('./routes/alert') //告警路由(route for alert)
let login = require('./routes/login')//登录路由(route for login)
let user = require('./routes/user')//用户相关路由(route for user-related)

let app = express() //app是express框架的根应用对象 根节点

// view engine setup
app.set('views', path.join(__dirname, 'views')) //设置视图目录
app.set('view engine', 'ejs');
// app.engine('.html', require('ejs').__express);
//设置视图模板的默认后缀名为.html,避免了每次res.Render("xx.html")的尴尬
// app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))) //网站logo路o径

//middlewares
app.use(cors())//using the cors middlewares to handle to cors problem 
app.use(bodyParser.json()) //将请求体解析成json格式
app.use(bodyParser.urlencoded({ extended: false })) //解析url
app.use(compression())
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public'))) //配置静态资源目录
app.use('/argusphone', express.static(path.join(__dirname, 'phoneapp'))) // 配置手机版项目目录

app.use(history({ //vue 路由h5 histroy 地址模式 (PC版地址)  h5模式会让后台的404失效
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'], //过滤请求头 html格式
        verbose: true,
        // index: 'app/index.html'
        rewrites: [
            // { from: /\/argusapp/, to: 'app/index.html' }
            // {
            //     from: /.*/,
            //     to: '/'
            // },
            {
                from: /.*/,
                to: '/argusapp/index.html' //路由重定向
            }
        ]
    }))
    // app.get('/', indexRoute)
app.use('/argusapp', express.static(path.join(__dirname, 'app'))) //配置前端项目目录

app.use(expressWinston.logger({ //请求日志
    transports: [
        new(winston.transports.File)({
            name: 'req-info',
            filename: './logs/req.log',
            level: 'info',
            timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        })
    ]
}))

// 使用session进行保存
let mongodb_host = require('./start_config').mongodb_host
let mongodb_port = require('./start_config').mongodb_port
app.use(express_session({
    name: 'argus_login',
    secret: 'argus_monitor',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000
    },
    // store: new MongoStore({
    //     url: 'mongodb://'+mongodb_host+':'+mongodb_port+'/session',
    //     // url: 'mongodb://192.168.0.253/session',
    //     ttl: 7 * 24 * 60 * 60 * 1000
    // })
    store: new RedisStore({
        host: session_host,
        port: session_port,
        db: session_db,
        ttl: 7 * 24 * 60 * 60 * 1000
    })
}))

app.use('/argus/login', login)

app.use(function(req, res, next) {
    if (req.session.Islogin) {
        next()
    } else {
        res.send('500')
    }
})


app.use(function(req, res, next) {
    if (req.session.wechat_login == undefined || req.session.wechat_login == 1){
        next()
    } else {
        res.send('500')
    }
})

// app.use(fu)

/*挂载路由*/
// app.use('/proxy', proxy('10.17.35.43:4242', { //内网
//     //   proxyReqPathResolver: function(req) {
//     //             //代理路径重写函数
//     //         console.info('代理',req)
//     //     return require('url').parse(req.url).path;
//     //   }
// }))
// app.use('/proxy8001', proxy('10.17.35.43:8001', { //内网 采集模块
//     //   proxyReqPathResolver: function(req) {
//     //             //代理路径重写函数
//     //         console.info('代理',req)
//     //     return require('url').parse(req.url).path;
//     //   }
// }))

// app.use('/proxy', proxy('localhost:4242', { //服务器本地
//     //   proxyReqPathResolver: function(req) {
//     //             //代理路径重写函数
//     //         console.info('代理',req)
//     //     return require('url').parse(req.url).path;
//     //   }
// }))
// app.use('/proxy8001', proxy('localhost:8001', { //服务器本地
//     //   proxyReqPathResolver: function(req) {
//     //             //代理路径重写函数
//     //         console.info('代理',req)
//     //     return require('url').parse(req.url).path;
//     //   }
// }))

let opentsdb_host = require('./start_config').opentsdb_host
let opentsdb_port = require('./start_config').opentsdb_port
app.use('/proxy', proxy(opentsdb_host+":"+opentsdb_port, { //公司本部本地
    //   proxyReqPathResolver: function(req) {
    //             //代理路径重写函数
    //         console.info('代理',req)
    //     return require('url').parse(req.url).path;
    //   }
}))

let collector_api_host = require('./start_config').argus_collector_api_host
let collector_api_port = require('./start_config').argus_collector_api_port

app.use('/proxy8001', proxy(collector_api_host+":"+collector_api_port, { //公司本部本地
    //   proxyReqPathResolver: function(req) {
    //             //代理路径重写函数
    //         console.info('代理',req)
    //     return require('url').parse(req.url).path;
    //   }
}))

let chain_api_host = require('./start_config').chain_collector_api_host
let chain_api_port = require('./start_config').chain_collector_api_port
app.use('/proxy9999', proxy(chain_api_host+":"+chain_api_port, { //公司本部本地（调用链接口服务）
    //   proxyReqPathResolver: function(req) {
    //             //代理路径重写函数
    //         console.info('代理',req)
    //     return require('url').parse(req.url).path;
    //   }
}))

// app.use('/proxy', proxy('http://183.3.139.134:4242', { //外网
//     //   proxyReqPathResolver: function(req) {
//     //             //代理路径重写函数
//     //         console.info('代理',req)
//     //     return require('url').parse(req.url).path;
//     //   }
// }))
// app.use('/proxy8001', proxy('http://183.3.139.134:8001', { //外网
//     //   proxyReqPathResolver: function(req) {
//     //             //代理路径重写函数
//     //         console.info('代理',req)
//     //     return require('url').parse(req.url).path;
//     //   }
// }))

// app.use('/argus', routes)
app.use('/argus/jk', jk)
app.use('/argus/survey', survey)
app.use('/argus/alert', alert)
app.use('/argus/user', user)

app.use(expressWinston.errorLogger({ //错误日志
    transports: [
        new(winston.transports.File)({
            name: 'sys-error',
            filename: './logs/err.log',
            level: 'error',
            timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        })
    ]
}))



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    //获取环境是开发环境返回错误给下面的节点 正式环境直接不返回
    app.use(function(err, req, res, next) {
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: err
        })
    })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {

    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})

// app.use(function(req,res,next){
//     if(req.session.Islogin){
//         res.cookie('argus_Islogin',1)
//     } else {
//         res.cookie('argus_Islogin', 0)
//     }
// })


module.exports = app