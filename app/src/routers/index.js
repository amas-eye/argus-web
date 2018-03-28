// 根路由配置
import urls from 'service/url'
import http from 'service/myhttp'
import { Message } from 'element-ui';
import VueRouter from 'vue-router' // vue路由
import Cookies from 'js-cookie'
import { login_route } from './login_route'
import { navBar_route } from './navBar_route'
import { manageBar_route } from './manageBar_route'

// import { error_route } from './error_route'


const routes = [
    login_route,
    navBar_route,
    manageBar_route, //管理模块路由
    // error_route,
    { path: '*', redirect: '/navBar/generalOverview' } //重定向
]


const router_config = { //路由配总配置
     mode: 'history', //h5路由模式
    routes: routes //路由地址配置数组
}
const router = new VueRouter(router_config)
router.beforeEach((to, from, next) => {
    //全局守卫
    // console.info('地址', to)
    let store = router.app.$store //vuex 状态管理store
    let userinfo = store.state.login_module.userinfo
    if (to.path != '/login') {
        //登录页不用判断权限

        if (userinfo != null) {

            next()


        } else {
            http.get(urls.HQYHSYXX).then(res => {
                if (res.data != 500 && res.data != 361) {
                    //登录判断码
                    userinfo = res.data.user
                    if (userinfo.is_admin) {
                        userinfo.pri = {
                            dashboard: 'rw',
                            jk: 'rw',
                            alert: 'rw',
                            caiji: 'rw',
                            chain: 'rw'
                        }
                    } else {
                        userinfo.pri = res.data.pri[0].group_privilieged
                    }
                    store.commit('setuserinfo', userinfo)
                    next()

                } else {
                    Message({
                        message: '请登录',
                        type: 'error',
                        showClose: true
                    })
                    router.push('/login')
                        // next()
                }

            }, err => {
                Message({
                    message: '请检查网络',
                    type: 'error',
                    showClose: true
                })
                router.push('/login')
                    // next()
            })


        }
    } else {
        // Cookies.set('a', 1)
        let islogin = Cookies.get('argus_Islogin') //判断是否已经登录
        //console.info('islogin', islogin)
        if (islogin == '1') {
            //登录了
            Message({
                message: '您已登录',
                type: 'info',
                showClose: true
            })
            router.push('/navBar/generalOverview')
        } else {
            next()
        }

    }



})

export { router }
