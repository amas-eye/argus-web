//收录应用所有接口地址
export default {
    LQZBMLB: '/proxy/api/suggest', //拉取指标名列表
    LQTAGKEY: '/proxy8001/api/tsdb', //拉取TAG的key
    LQTAGVAL: '/proxy/api/query', //拉取TAG的value
    JHHS: '/proxy/api/aggregators', //聚合函数取样函数
    HQJKSJ: '/proxy/api/query', //获取监控数据
    // HQCJXX: '/test/api/collector/metric', //获取采集信息(测试)
    HQCJXX: '/proxy8001/api/collector/metric', //获取采集信息(部署)
    // GXCJXX: '/test/api/collector/metric', //更新采集信息(测试)
    GXCJXX: '/proxy8001/api/collector/metric', //更新采集信息(部署)
    HQSTSJPZ: '/argus/jk/getdatetimeconfigs', //获取视图数据的时间间隔配置
    GXSTSJPZ: '/argus/jk/updatedatetimeconfigs', //更新视图数据的时间间隔配置
    HQBQSZ: '/argus/jk/gettags', //获取视图标签数组
    XZJKST: '/argus/jk/addview', // 新增监控视图
    HQSTZS: '/argus/jk/viewcount', //获取视图总数
    CZJKST: '/argus/jk/search', // 搜索监控视图
    GXJKST: '/argus/jk/update', //更新监控视图
    SCJKST: '/argus/jk/remove', //删除监控视图
    XZSTTB: '/argus/jk/addchart', //新增监控视图图表
    BJSTTB: '/argus/jk/editchart', //编辑监控视图图表
    CXSTTB: '/argus/jk/searchart', //查询监控视图图表
    HQJKD: '/argus/survey/get_overall_health', //获取健康度
    HQZJXX: '/argus/survey/get_host_stat', //获取主机信息
    HQGJTJ: '/argus/survey/get_alert_stat', //获取告警统计信息
    HQGJQS: '/argus/survey/get_alert_trend', //获取告警趋势
    HQZBTJ: '/argus/survey/get_metric_stat', //获取指标统计信息
    HQSYL: '/argus/survey/get_sys_resource', //获取指所有Top5及基础资源使用量
    HQZDYGLTB: '/argus/survey/get_mycharts', //获取自定义概览图表
    XZZDYGLTB: '/argus/survey/add_mychart', //新增自定义概览图表
    SCZDYGLTB: '/argus/survey/remove_mychart', //删除自定义概览图表
    HQGJCL: '/argus/alert/get_warn_strategy', //获取告警策略列表
    HQGJBQSZ: '/argus/alert/get_warn_label', //获取告警标签数组
    HQCLZS: '/argus/alert/get_strategy_count', //获取历史总数
    TJGJCL: '/argus/alert/add_warn_strategy', //添加告警策略
    GXGJCL: '/argus/alert/update_warn_strategy', //更新告警策略
    SCGJCL: '/argus/alert/del_warn_strategy', //删除告警策略
    QHGJKG: '/argus/alert/toggle_warn', //切换告警开关
    HQGJLS: '/argus/alert/get_warn_history', //获取告警历史
    HQLSZS: '/argus/alert/get_history_count', //获取历史总数
    HDFWM: '/proxy9999/api/chain/services', //（调用链）回调服务名
    HDTAG: '/proxy9999/api/chain/tags/', //（调用链）回调TAG列表数据
    HDLIST: '/proxy9999/api/chain/traces', //（调用链）回调列表数据
    HDDETAIL: '/proxy9999/api/chain/traces/', //（调用链）回调详情页

    // 用户管理
    HQYHSYXX: '/argus/user/get_user_info', //获取该登陆用户的权限和个人信息
    HQSYZQX: '/argus/user/get_all_group', //获取所有组权限
    LOGIN: '/argus/login/login', //登录
    lOGOUT: '/argus/login/logout', //登出
    CZGRXX: '/argus/user/userinfo', //查询个人信息及修改个人信息
    TJYH: '/argus/user/addUser', //添加用户
    HQYHLB: '/argus/user/showUser', //获取用户列表
    SCYH: '/argus/user/deleteuser', //删除用户
    HQSYYS: '/argus/user/show_all_pages', //获取所有页数
    HQYHXX: '/argus/user/getoneUser', //获取用户信息
    BJYHXX: '/argus/user/changeUserByadmin', //编辑用户信息
    ZSZM: '/argus/user/showGroup', //展示获取所有组名
    HDZQX: '/argus/user/getgroupPrivilieged', //获得某组权限
    XGYHZ: '/argus/user/changeGroup', //删除修改用户组
    ZJYHZ: '/argus/user/addGroup', //添加用户组
    HDZJYHZ: '/argus/user/GrouptoUser', //获得组并且订阅的用户名

    HQERYZM: '/argus/user/get_qr_code', //获取二维验证码
    QDBDCG: '/argus/user/check_wechat_binding', //确定绑定成功
    WXJB: '/argus/user/wechat_unbinding', //微信解绑
    TableData: '/argus/jk/tablequery',//表格数据
    StrateRelated: '/argus/jk/strategyRelated',//视图告警值获取
    removechart: '/argus/jk/removechart',//删除视图
}
