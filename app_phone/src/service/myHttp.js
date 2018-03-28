//get的基础自定义
import { HOST } from './HOST'
import { Indicator } from 'mint-ui'; //加载动效
import { MessageBox,Toast } from 'mint-ui'; //信息弹窗
//import vue from 'vue'

function err_dispose(err) {
    //异常处理函数
    if (err.status == 500) {
        MessageBox.alert('请求失败请检查网络', '错误');
    } else {

        MessageBox.alert('未知错误', '错误');

    }
}



function res_dispose(res, resolve, reject) {
    //自定义业务返回信息判断
    let data = res.data
    switch (data.code) {
        case 500:
            Toast('未登录或过期');
            reject('失败')
            break;
        case 200:
            //登录成功
            resolve(res)

            break;
        case 201:
            //登出成功
            Toast('登出成功')
            //MessageBox.alert('登出成功');
            resolve(res)
            break;
        case 250:
            //登录失败，密码错误
            Toast('登录失败，密码错误');
            reject('失败')
            break;
        case 251:
            //登录失败，查无此用户
            Toast('登录失败，查无此用户');
            reject('失败')
            break;

        default:

            if (data.status == 'success') {
                Toast(data.text);
                //MessageBox.alert(data.text);
                resolve(res)
            } else if (data.status == 'fail') {
                Toast(data.text);
                reject('失败')
            } else {
                resolve(res)
            }

            break

    }

}


import qs from 'qs'; //请求参数处理库
import axios from 'axios' //请求库
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'; //请求头
axios.defaults.baseURL = HOST; //url公共前缀


export default {
    get: function(url, info) {

        if(info && info.loading){
            delete info.loading;
        }else{
            Indicator.open({
                text: '加载中...',
                spinnerType: 'fading-circle'
            })
        }


        //get请求
        return new Promise(function(resolve, reject) {




            //get请求
            axios.get(url, { params: info }).then(
                res => {
                    res_dispose(res, resolve, reject)
                    //resolve(res)
                        // console.log(res)
                    Indicator.close()

                }
            ).catch(
                err => {
                    err_dispose(err) //错误处理
                    reject(err)
                    Indicator.close()
                }
            )

        })

    },
    post: function(url, info) {

        if(info && info.loading){
            delete info.loading;
        }else{
            Indicator.open({
                text: '加载中...',
                spinnerType: 'fading-circle'
            })
        }
        //post请求
        return new Promise(function(resolve, reject) {




            //get请求
            axios.post(url, info, { //qs序列化参数 做成stringformdate格式
                headers: { //头部配置
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                // params: info,
                // paramsSerializer: function(params) {
                //     return Qs.stringify(params, { arrayFormat: 'brackets' })
                // },
            }).then(
                res => {
                    res_dispose(res, resolve, reject)
                    Indicator.close()
                }
            ).catch(
                err => {
                    Indicator.close()
                    err_dispose(err)
                    reject(err)
                }
            )
        })

    }
}

