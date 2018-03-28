import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({ // vuex状态管理
	state: { //根状态机
		userinfo: null
	},
	mutations: {
		setuserinfo(state, val) {
			//设置用户信息
			state.userinfo = val
		},
	},
})