//自定义请求返回码标准

class Host_value {
    constructor(value, host, timestamp) {
        this.value = value
        this.host = host  
        this.last_timestamp = timestamp 
    }
}
// status is "success" or "fail"

class Data_value {
    constructor(metric,alert_status,host_value){
        this.metric = metric
        this.alert_status = alert_status
        this.host_value = host_value
    }
}

exports.Host_value = Host_value
exports.Data_value = Data_value
