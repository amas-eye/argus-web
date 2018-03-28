//  const hello_view = resolve => require(['view/hello.vue'], resolve) //组件异步懒加载写法
// 总体概况
import exhibition_view from 'view/exhibition'

export const exhibition_route = {
    path: '/exhibition',
    component: exhibition_view
}