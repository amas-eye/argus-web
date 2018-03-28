// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui' //pc组件
import 'element-ui/lib/theme-default/index.css' //pc组件样式
// import VueResoure from 'vue-resource' //vue ajax请求库
import Vuex from 'vuex' // vue 模块管理
import VueHead from 'vue-head'

// import vClickOutside from 'v-click-outside'
// import VueTouch from 'vue-touch' //手势库
import {
    HOST
} from 'service/HOST' //主地址

import VueRouter from 'vue-router' // vue路由
import * as modules from 'modules' // 所有模块
import {
    router
} from 'routers' //配置完毕的路由
import App from './App'

Vue.use(ElementUI)
    // Vue.use(VueResoure)
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueHead)
    // Vue.use(vClickOutside)
    // VueTouch.config.swipe = {
    //     threshold: 5
    // }
    // Vue.use(VueTouch, { name: 'v-touch' })


// console.log(MintUi)
// console.log(modules)
// console.log(router_config)
/* eslint-disable no-new */
const store = new Vuex.Store({ // vuex状态管理
    state: { //根状态机
        HOST: HOST, //资源服务器
        fonsize: 0, //全局fonsize大小 代表整个应用页面比率
        callChain: { //调用链筛选参数
            service: '',
            limit: '',
            lookback: '',
            tag: '',
            maxduration: '',
            minduration: '',
            page: 1,
            lookbackPar: {
                hstimeunit: '分钟',
                lookback2: ''
            },
            maxdurationPar: {
                longtimeunit: '毫秒',
                maxduration2: '',
            },
            mindurationPar: {
                shorttimeunit: '毫秒',
                minduration2: ''
            },
        },
        overview: { //监控筛选参数
            text: '',
            tag: '',
            page: 1,
        }
    },

    mutations: {
        setfonsize(state, val) {
            // console.log(val)
            state.fonsize = val
        },
        setCallChainPar(state, val) {
            state.callChain = val;
        },
        clearCallChainPar(state) {
            state.callChain = {
                service: '',
                limit: '',
                lookback: '',
                tag: '',
                maxduration: '',
                minduration: '',
                page: 1,
                lookbackPar: {
                    hstimeunit: '分钟',
                    lookback2: ''
                },
                maxdurationPar: {
                    longtimeunit: '毫秒',
                    maxduration2: '',
                },
                mindurationPar: {
                    shorttimeunit: '毫秒',
                    minduration2: ''
                },
            }

        },
        setOverviewPar(state, val) {
            state.overview = Object.assign({}, val);
        },

    },
    getters: {},
    actions: {},

    modules: modules //状态机模块
})


new Vue({
    router,
    store,
    el: '#app',
    template: '<App/>',
    components: {
        App
    }
})