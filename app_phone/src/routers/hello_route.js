// const hello_view = resolve => require(['view/hello.vue'], resolve) //组件异步懒加载写法
import hello_view from 'view/hello'

export const hello_route = {
    path: '/hello',
    component: hello_view
}