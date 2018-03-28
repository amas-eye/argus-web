// 根路由配置
import Vue from 'vue'
import VueRouter from 'vue-router' // vue路由
import store from '../store'
import http from '../service/myhttp'
import urls from '../service/url'
import Cookies from 'js-cookie'
import { setStore, getStore } from '../service/mUtils'

import {
    Toast
} from 'mint-ui';
import {
    main_route
} from './main_route'
import {
    login_route
} from './login_route'
import {
    hello_route
} from './hello_route'
import {
    survey_route
} from './survey_route'
import {
    test_route
} from './test_route'
import {
    strategy_route
} from './strategy_route'
import {
    strategyDetail_route
} from './strategyDetail_route'
import {
    monitorView_route
} from './monitorView_route'


Vue.use(VueRouter)


const routes = [
    hello_route,
    login_route,
    strategy_route,
    strategyDetail_route,
    monitorView_route,
    main_route, {
        path: '*',
        redirect: '/navBar/survey'
    }
]






const router_config = { //路由配总配置
    // mode: 'history', //h5路由模式
    routes: routes //路由地址配置数组
}

const router = new VueRouter(router_config)




const getQueryStringArgs = function () {
    const qs = window.location.search.length > 0 ? window.location.search.substring(1) : '';
    const args = {};
    const items = qs.length ? qs.split("&") : [];
    let item = null;
    let name = null;
    let value = null;
    let i = 0;
    let len = items.length;
    for (i = 0; i < len; i++) {
        item = items[i].split("=");
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        if (name.length) {
            args[name] = value;
        }
    }
    return args;
}


const pushFunc = function (to,next) {

    let userinfo = store.state.userinfo;
    if (to.path != '/login') {
        //登录页不用判断权限

        if (userinfo != null) {

            next()

        } else {
            http.get(urls.HQYHSYXX).then(res => {

                // console.log('res', res);
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
                    //Toast('请登录')
                    router.push('/login')
                    // next()
                }

            }, err => {
                //Toast('请检查网络')
                router.push('/login')
                // next()
            })


        }
    } else {
        let islogin = Cookies.get('argus_Islogin') //判断是否已经登录
        if (islogin == '1') {
            //Toast('您已登录')
            //登录了
            router.push('/navBar/survey')
        } else {
            next()
        }

    }

}




router.beforeEach((to, from, next) => {
    //全局守卫
    const obj = getQueryStringArgs();
    const hasOpenid = obj.openid && obj.openid.length > 0 ? true : false;
    const hasv = getStore('hasVertify');
    if (hasOpenid && hasv !== 'yes') {

        http.get(urls.WXDL,{openid:obj.openid}).then(res => {
            setStore('hasVertify','yes');
            next();
        },err => {
            Cookies.set('argus_Islogin','0');
            setStore('hasVertify','yes');
            pushFunc(to,next);
        })
    }else {
        pushFunc(to,next);
    }

})

export default router
