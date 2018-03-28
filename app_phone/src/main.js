// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {
    HOST
} from 'service/HOST'
import {
    AlertPlugin,
    ToastPlugin
} from 'vux'
import MintUi from 'mint-ui' // 移动样式组件库
import 'mint-ui/lib/style.css' // 移动样式组件库样式表
// import VueResoure from 'vue-resource' //vue ajax请求库
import Vuex from 'vuex' // vue 模块管理
import VueTouch from 'vue-touch'
import store from './store'
import router from './routers' // vue路由
import * as modules from 'modules' // 所有模块
import {
    router_config
} from 'routers' //路由配置
import App from './App'

Vue.use(MintUi)


// Vue.use(VueResoure)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
    // VueTouch.config.swipe = {
    //     threshold: 5
    // }
Vue.use(VueTouch, {
    name: 'v-touch'
})


// const store = new Vuex.Store({ 
//     state: { 
//         HOST: HOST 
//     },
//     modules: modules 
// })


new Vue({
    router,
    store,
    el: '#app',
    template: '<App/>',
    components: {
        App
    }
})