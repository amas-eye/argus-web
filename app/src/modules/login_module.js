// 登录模块
export const login_module = {
    state: {
        userinfo: null
    },
    mutations: {
        setuserinfo(state, val) {
            //设置用户信息
            state.userinfo = val
        },
    },
    getters: {},
    actions: {}
}