//get的基础自定义
import { Loading } from 'element-ui'; //加载动效
import { Message } from 'element-ui'; //信息弹窗
import { router } from 'routers' //配置完毕的路由
import { HOST } from 'service/HOST'

//import vue from 'vue'

function err_dispose(err) {
    //请求状态异常处理函数
    if (err.status == 500) {

        Message({
            message: '请求失败请检查网络',
            type: 'error',
            showClose: true
        })

    } else {

        Message({
            message: '未知错误',
            type: 'error',
            showClose: true
        })

    }
}

function res_dispose(res, resolve, reject) {
    //自定义业务返回信息判断
    let data = res.data
    switch (data.code) {
        case 500:
            // router.push('/login')
            Message({
                message: '未登录或过期',
                type: 'error',
                showClose: true
            })
            reject('失败')
            break;
        case 200:
            //登录成功
            resolve(res)

            break;
        case 201:
            //登出成功

            Message({
                message: '登出成功',
                type: 'error',
                showClose: true
            })
            resolve(res)
            break;
        case 250:
            //登录失败，密码错误
            Message({
                message: '登录失败，密码错误',
                type: 'error',
                showClose: true
            })
            reject('失败')
            break;
        case 251:
            //登录失败，查无此用户
            Message({
                message: '登录失败，查无此用户',
                type: 'error',
                showClose: true
            })
            reject('失败')
            break;

        default:

            if (data.status == 'success') {
                Message({
                    message: data.text,
                    type: 'success',
                    showClose: true
                })
                resolve(res)
            } else if (data.status == 'fail') {
                Message({
                    message: data.text,
                    type: 'error',
                    showClose: true
                })
                reject('失败')
            } else {
                resolve(res)
            }

            break

    }

}

//import qs from 'qs'; //请求参数处理库
import axios from 'axios' //请求库
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'; //请求头
axios.defaults.baseURL = HOST; //url公共前缀

export default {
    get: function(url, info) {
        //get请求    
        return new Promise(function(resolve, reject) {
            // let currentLoad = Loading.service({ //加载特效
            //         text: '加载中。。。'
            //     })
            //get请求
            axios.get(url, { params: info }).then(
                res => {

                    res_dispose(res, resolve, reject)
                        // console.log(res)
                        // currentLoad.close()

                }
            ).catch(
                err => {
                    err_dispose(err) //错误处理
                    reject(err)
                        // currentLoad.close()
                }
            )

        })

    },
    post: function(url, info) {
        //post请求
        return new Promise(function(resolve, reject) {

            // let currentLoad = Loading.service({ //加载特效
            //     text: '加载中。。。'
            // })

            //get请求
            axios.post(url, info, { //qs序列化参数 做成stringformdate格式(java后台需要)
                headers: { //头部配置
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //(java后台需要)
                },
                // params: info,
                // paramsSerializer: function(params) {
                //     return Qs.stringify(params, { arrayFormat: 'brackets' })
                // },
            }).then(
                res => {
                    res_dispose(res, resolve, reject)
                    resolve(res) //解析结果为json
                        // currentLoad.close()
                }
            ).catch(
                err => {
                    // currentLoad.close()
                    err_dispose(err)
                    reject(err)
                }
            )
        })

    }
}

// export default function(type, url, info) {
//     return new Promise(function(resolve, reject) {

//         Indicator.open({
//             text: '加载中...',
//             spinnerType: 'fading-circle'
//         })

//         if (type == 'get') {
//             //get请求
//             axios.get(url, { params: info }).then(
//                 res => {
//                     resolve(res)
//                         // console.log(res)
//                     Indicator.close()

//                 }
//             ).catch(
//                 err => {
//                     err_dispose(err) //错误处理
//                     reject(err)
//                     Indicator.close()
//                 }
//             )
//         } else if (type == 'post') {
//             //post请求
//             axios.post(url, qs.stringify(info), {
//                 headers: {
//                     'Accept': 'application/json, text/javascript, */*; q=0.01',
//                     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//                 },
//                 // params: info,
//                 // paramsSerializer: function(params) {
//                 //     return Qs.stringify(params, { arrayFormat: 'brackets' })
//                 // },
//             }).then(
//                 res => {
//                     resolve(res) //解析结果为json
//                     Indicator.close()
//                 }
//             ).catch(
//                 err => {
//                     Indicator.close()
//                     err_dispose(err)
//                     reject(err)
//                 }
//             )

//         }

//     })
// }