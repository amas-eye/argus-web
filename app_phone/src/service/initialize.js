//初始化函数
export default function(store) {

    let currentW = window.innerWidth //当前窗口内大小
        // console.log('currentW', currentW)
    let defaultW = 750 //预设宽度分辨率
    let defaultF = 100 //预设文字大小
    let rat = currentW / defaultW //比率
    let currentF = defaultF * rat //当前需要的fonsize值

    let parentElement = document.getElementById('html') //根节点
    let styleString = '' + currentF + 'px' //样式字符串
        // console.log('styleString', styleString)
        // parentElement.style.overflowY = 'auto'

    if (currentW > 319) { //窗口大于320
        //窗口调整大小
        parentElement.style.overflowX = 'hidden'
        document.body.style.overflowX = 'hidden'
        parentElement.style.fontSize = styleString
        // console.log(store.state)
            // store.commit('setfonsize', currentF)
    } else {

        // parentElement.style.overflowX = 'auto'
    }


}