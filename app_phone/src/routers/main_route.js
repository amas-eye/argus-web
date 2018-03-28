//const login_view = resolve => require(['view/login.vue'], resolve) //组件异步懒加载写法

// import { exhibition_route } from './exhibition_route'
// import { brand_route } from './brand_route'
// import { flow_route } from './flow_route'
// import { heatmap_route } from './heatmap_route'
// import { portrayal_route } from './portrayal_route'
// import { rank_route } from './rank_route'
import {
	survey_route
} from './survey_route'
import {
	test_route
} from './test_route'
import {
	generalOverview_route
} from './generalOverview_route'
import {
	collect_route
} from './collect_route'
import {
	warnbox_route
} from './warnbox_route'
import main_view from 'view/main'

export const main_route = {
	path: '/navBar',
	component: main_view,
	children: [ //子路由写法
		survey_route,
		generalOverview_route,
		collect_route,
		warnbox_route,
		test_route
	]
}