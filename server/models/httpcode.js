//自定义请求返回码标准

class Response_status {
    constructor(code, status, text) {
        this.code = code
        this.status = status  
        this.text = text
    }
}
// status is "success" or "fail"

exports.Response_status = Response_status