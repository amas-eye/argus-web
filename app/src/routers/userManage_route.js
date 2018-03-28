// const hello_view = resolve => require(['view/hello.vue'], resolve) //组件异步懒加载写法
import userManage_view from 'view/userManage'
export const userManage_route = { //用户管理

    path: 'userManage',
    component: userManage_view

}