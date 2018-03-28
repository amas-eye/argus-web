//告警
let mongoose = require('mongoose');
let connections = require('../db_connect')
let Schema = mongoose.Schema;

let labels = new Schema({ //告警label标签列表
    label: String, //标签
});

let property = new Schema({ //基础信息
    name: String, //告警策略名
    create_user: String, //创建用户
    create_time: { type: Date, default: Date.now }, //创建时间(时间戳)
    update_time: { type: Date, default: Date.now }, //更改时间(时间戳)
    note: String, //备注
    labels: [{ type: String }] //标签数组
});

let tsd_rule = new Schema({ // 规则
    metric: String, //指标名
    time_duration: Number, //时间长度
    time_unit: String, //时间单位
    sample: String, //取样方法
    comparison: String, //比较符
    chain_relation: String, // 用于存放环比的参数
    hb_interval: Number,  // 环比间隔
    hb_unit: String,      //  环比时间单位
    threshold: String, //阈值
    group: [{ //分组（TAGS）
        key: String, //键值
        value: String //值
    }]
});

let notify_group = new Schema({ // 通知用户组
    group_name: String, //通知方式（列表）
    group_names_check: [{ type: String }], //通知用户（列表）
});

let notify = new Schema({ // 通知
    notify_method: Array, //通知方式（列表）
    notify_group: [{
        type: notify_group,
        required: true
    }], //通知用户组
});

let strategy = new Schema({ // 告警策略
    property: { type: property }, //基础信息
    type: String, //告警类型
    aggregation: Boolean,          //是否聚合
    tsd_rule: { type: tsd_rule }, // 规则
    latest: Boolean,
    interval: Number, //检查间隔
    status: { type: String, default: 'no' }, //状态（on/off/alert）
    level: String, //告警级别重要程度
    notify: { type: notify } // 通知
});

let single_alert_history = new Schema({
    strategy_name: String, //策略名
    alert_time: Number, //告警时间戳
    alert_info: String, //告警内容（前端需支持换行符"\n"显示）
    recover_time: String, //对应前端部分恢复时间
    is_recover: Boolean, //对应前端部分恢复状态（如果为false，即为未回复）
    level: String, //告警级别重要程度
    group: String, //对应主机分组
})

let alert_history = new Schema({ // 历史记录
    strategy_name: String, //策略名
    alert_time: Number, //告警时间戳
    alert_info: String, //告警内容（前端需支持换行符"\n"显示）
    recover_time: String, //对应前端部分恢复时间
    is_recover: Boolean, //对应前端部分恢复状态（如果为false，即为未回复）
    level: String, //告警级别重要程度
    group: String, //对应主机分组
    alertInfos: [{type:single_alert_history}],  // 聚合告警详情
    aggregation: Boolean  //是否聚合
});


/* model第三个参数是自定义集合名 否则生成集合有s */

module.exports = {

    labels: connections.argus_alert.model('alert_labels', labels, 'alert_labels'), //告警策略标签label
    strategy: connections.argus_alert.model('strategy', strategy, 'strategy'), //告警策略
    history: connections.argus_alert.model('alert_history', alert_history, 'alert_history'), //历史记录

}