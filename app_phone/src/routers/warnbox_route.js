import warnbox_view from 'view/warnbox'
import {
	warning_route
} from './warning_route'
import {
	strategy_route
} from './strategy_route'
export const warnbox_route = {
	path: 'warnbox',
	component: warnbox_view,
	children: [ //子路由写法
		warning_route,
	strategy_route
	]
}