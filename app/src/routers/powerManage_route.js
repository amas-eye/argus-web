// const hello_view = resolve => require(['view/hello.vue'], resolve) //组件异步懒加载写法
import powerManage_view from 'view/powerManage'
export const powerManage_route = { //权限管理
    path: 'powerManage',
    component: powerManage_view
}