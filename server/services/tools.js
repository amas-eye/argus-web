//工具服务

let isExist = function(item) {
    //判断变量是否存在
    if (item != '' && typeof(item) != 'undefined' && item != null) {
        return true
    } else {
        return false
    }
}
exports.isExist = isExist