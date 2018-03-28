// const hello_view = resolve => require(['view/hello.vue'], resolve) //组件异步懒加载写法
import personalCenter_view from 'view/personalCenter'
export const personalCenter_route = { //视图列表页

    path: 'personalCenter',
    component: personalCenter_view

}