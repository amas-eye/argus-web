import moment from 'moment' //时间处理库(建议后台做时间处理)
// console.log(moment().days(-1).format('Y-M-D'))



export default {

    YMD: function(date) {
        //日期转化为YMD模式(2017/07/03-11:09:50)
        return moment(date).format('YYYY-MM-DD')
    },
    SJCtoTime: function(date) {
        //时间戳转默认时间格式
        // console.log(date)
        if (date != '' && date != null && typeof(date) != "undefined") {
            // console.info('时间戳', date)
            return moment.unix(date).format('YYYY-MM-DD HH:mm:ss')
        } else {
            return ''
        }
    },
    TimetoSJC: function(date) {
        //时间转时间戳
        if (date != '' && date != null && typeof(date) != "undefined") {
            return moment(date).format('X')
        } else {
            return ''
        }
    },
    TMDTime: function(date) {
        //热力图时间格式

        return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    TMDTime2: function(date) {
        //热力图时间格式

        return moment(date).format('YYYY-MM-DD HH:mm')
    },

    todayTime: function() {
        //今天
        return moment().format('YYYY-MM-DD HH:mm')

    },
    todayTimeZone: function() {
        //今天
        return moment().format('YYYY-MM-DD') + ' 0:00'

    },

    min5_ago: function() {
        //5分钟前
        return moment().subtract(5,'minutes').format('YYYY-MM-DD HH:mm:ss')
    },
    min10_ago: function() {
        //10分钟前
        return moment().subtract(10,'minutes').format('YYYY-MM-DD HH:mm:ss')
    },
    min30_ago: function() {
        //30分钟前
        return moment().subtract(30,'minutes').format('YYYY-MM-DD HH:mm:ss')
    },
    hour1_ago: function() {
        //1小时前
        return moment().subtract(1,'hours').format('YYYY-MM-DD HH:mm:ss')
    },
    hour6_ago: function() {
        //6小时前
        return moment().subtract(6,'hours').format('YYYY-MM-DD HH:mm:ss')
    },
    hour12_ago: function() {
        //12小时前
        return moment().subtract(12,'hours').format('YYYY-MM-DD HH:mm:ss')
    },
    day1_ago: function() {
        //1天前
        return moment().subtract(1,'days').format('YYYY-MM-DD HH:mm:ss')
    },
    day7_ago: function() {
        //7天前
        return moment().subtract(7,'days').format('YYYY-MM-DD HH:mm:ss')
    },
    day15_ago: function() {
        //15天前
        return moment().subtract(15,'days').format('YYYY-MM-DD HH:mm:ss')
    },
    today: function() {
        //今天
        return moment().format('YYYY-MM-DD HH:mm:ss')
    },
    yesterday: function() {
        //昨天
        return moment().subtract(1,'days').format('YYYY-MM-DD HH:mm:ss')
    },
    aweek: function() {
        //一周内
        return {
            start: moment().days(-7).format('YYYY-MM-DD'),
            end: moment().format('YYYY-MM-DD')
        }
    },
    amounth: function() {
        //一月内
        return {
            start: moment().days(-30).format('YYYY-MM-DD'),
            end: moment().format('YYYY-MM-DD')
        }
    }

}