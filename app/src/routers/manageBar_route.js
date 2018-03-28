// const hello_view = resolve => require(['view/hello.vue'], resolve) //组件异步懒加载写法
import manageBar_view from 'view/manageBar'
import { personalCenter_route } from './personalCenter_route'
import { userManage_route } from './userManage_route'
import { powerManage_route } from './powerManage_route'




export const manageBar_route = { //manageBar 管理模块路由
    path: '/manageBar',
    component: manageBar_view,
    children: [
        personalCenter_route, //个人中心
        userManage_route, //用户管理
        powerManage_route //权限管理
    ]
}