<template>
    <!-- 个人中心 -->
    <div class="personalCenter">
        <div class="title">基本资料（请完善以下资料，方便我们更好服务）</div>
        <form>
            <div class="textgroup">
                <div class="userinfotext phwhite">
                    <div class="infoname">昵称</div>
                    <input v-model="userinfo.name" type="text" placeholder="请输入......" />
                </div>
                <div class="userinfotext phwhite">
                    <div class="infoname">账号</div>
                    <input readonly v-model="userinfo.username" type="text" placeholder="请输入......" />
                </div>
                <div class="userinfotext phwhite">
                    <div class="infoname">电话</div>
                    <input v-model="userinfo.cell_phone" type="number" placeholder="请输入......" />
                </div>
                <div class="userinfotext phwhite">
                    <div class="infoname">原始密码</div>
                    <input v-model="old_password" type="password" placeholder="请输入......" />
                </div>
                <div class="userinfotext phwhite">
                    <div class="infoname">邮箱</div>
                    <input v-model="userinfo.mail" type="text" placeholder="请输入......" />
                </div>
                <div class="userinfotext phwhite">
                    <div class="infoname">新密码</div>
                    <input v-model="new_password" type="password" placeholder="请输入......" />
                </div>
              <div class="userinfotext phwhite">
                <div class="infoname">Slack Hook</div>
                <input v-model="userinfo.slack_hook" type="text" placeholder="请输入......" />
              </div>
                <div class="userinfotext phwhite">
                    <div class="infoname">确认密码</div>
                    <input v-model="password_confirm" type="password" placeholder="请输入......" />
                </div>
                <div class="userinfotext phwhite">
                    <div class="infoname">微信</div>
                    <!-- 微信二维码验证 -->
                    <div class="wxyz_sign" :class="{'yz_not':userinfo.wechat_id=='','yz_succeed':userinfo.wechat_id!=''}"><i class="icon" :class="{'icon-notice':userinfo.wechat_id=='','icon-wxyz_ok':userinfo.wechat_id!=''}"></i>{{userinfo.wechat_id==''?'尚未验证':'已经验证'}}</div>
                    <el-button class="wx_unbind" type="button" :disabled="userinfo.wechat_id==''" @click="wxyz_unbind">解绑</el-button>
                    <el-button class="wxyz_start" type="button" :disabled="userinfo.wechat_id!=''" @click="get_qr_code">开始验证</el-button>
                    <div v-show="yzmshow" class="comf_bg">
                        <i @click="yz_cancel" class="el-icon-close cancel clickable"></i>
                        <img :src="wx_yzm" class="wx_yzm" />
                    </div>
                    <!-- <input v-model="userinfo.wechat_id" type="text" placeholder="请输入......" /> -->
                </div>
            </div>
            <button @click="updateinfo" class="save clickable" type="button">保存</button>
        </form>
    </div>
</template>
<script>
    import {
        Loading
    } from 'element-ui'; //加载动效
    import {
        Message
    } from 'element-ui'; //信息弹窗
    import http from 'service/myhttp'
    import urls from 'service/url'
    import simdate from 'service/simdate'
    export default {
        name: 'personalCenter',
        head: {
            title: {
                inner: '个人中心'
            }
        },
        components: {},
        data() {
            return {
                yzmshow: false, //验证码显示
                wx_yzm: '', //微信验证码地址
                check_id: null, //确认认证定时器id
                old_password: '', //旧密码
                new_password: '', //新密码
                password_confirm: '', //密码确认
                isSubmiting:false,//是否正在提交，正在提交禁止按钮重复点击
            }
        },
        computed: {
            userinfo: function() {
                return this.$store.state.login_module.userinfo
            }
        },
        watch: {},
        methods: {
            get_user_info: function() {
                //获取用户数据
                http.get(urls.HQYHSYXX).then(res => {
                    //登录判断码
                    let userinfo = res.data.user
                    if (userinfo.is_admin) {
                        userinfo.pri = {
                            dashboard: 'rw',
                            jk: 'rw',
                            alert: 'rw',
                            caiji: 'rw',
                            chain: 'rw'
                        }
                    } else {
                        userinfo.pri = res.data.pri[0].group_privilieged
                    }
                    this.$store.commit('setuserinfo', userinfo)
                }, err => {})
            },
            get_qr_code: function() {
                //获取验证码
                http.get(urls.HQERYZM).then(res => {
                    console.info('验证码', res)
                    this.wx_yzm = res.data
                    this.yzmshow = true
                    this.check_wx_bind()
                })
            },
            check_wx_bind: function() {
                //确认微信是否绑定
                // let currentLoad = Loading.service({ //加载特效
                //     text: '加载中。。。'
                // })
                this.check_id = setInterval(() => {
                    http.get(urls.QDBDCG).then(res => {
                        console.info('确认', res)
                        let data = res.data
                        if (data.status == 'success') {
                            // currentLoad.close()
                            clearInterval(this.check_id)
                            this.yzmshow = false
                             this.get_user_info()
                            // Message({
                            //     message: '微信绑定成功',
                            //     type: 'success',
                            //     showClose: true
                            // })
                        } else if (data.status == 'fail') {
                            // currentLoad.close()
                            clearInterval(this.check_id)
                            // Message({
                            //     message: '微信绑定失败',
                            //     type: 'error',
                            //     showClose: true
                            // })
                        }
                    })
                }, 1000)
            },
            yz_cancel: function() {
                //取消验证
                this.yzmshow = false
                clearInterval(this.check_id)
            },
            wxyz_unbind: function() {
                //微信验证解绑
                http.get(urls.WXJB).then(res => {
                    console.info('微信解绑', res)
                    this.get_user_info()
                })
            },
            updateinfo: function() {
                if(this.isSubmiting) return;
                this.isSubmiting = true;
                if(this.new_password != this.password_confirm){
                  this.$message({
                    message: '新密码和确认密码不一致！',
                    type: 'error',
                    showClose: true
                  })
                  return;
                }
                //更新个人信息
                http.post(urls.CZGRXX, {
                    name: this.userinfo.name, //用户名
                    mail: this.userinfo.mail, //邮箱地址
                    cell_phone: this.userinfo.cell_phone, // 电话
                    wechat_id: this.userinfo.wechat_id, // 微信ID
                    slack_hook: this.userinfo.slack_hook, // slack 钩子
                    old_password: this.old_password, // 旧密码
                    new_password: this.new_password, // 新密码
                }).then(res => {
                    this.isSubmiting = false;
                    this.get_user_info()
                    this.$router.go(0);
                    console.info('更改信息', res)
                }).catch((error) => {
                    this.isSubmiting = false;
                })
            }
        },
        mounted() {
            //挂载时
            console.info('userinfo', this)
            // this.initInfo()
        },
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .personalCenter {}
    .personalCenter .title {
        text-align: left;
        font-size: 0.8rem;
        color: #41404e;
        margin-bottom: 0.5rem;
    }
    .personalCenter form {
        width: 100%;
        height: 25.85rem;
        border-radius: 0.3rem;
        background: rgba(12, 17, 37, 0.25);
    }
    .personalCenter form .save {
        width: 4.5rem;
        height: 2rem;
        font-size: 0.9rem;
        color: #fff;
        text-align: center;
        background: #518DD7;
        border-radius: 0.2rem;
    }
    .textgroup {
        width: 50rem;
        height: 17rem;
        margin: auto;
        padding-top: 3rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 1.5rem;
    }
    .userinfotext {
        width: 22rem;
        display: table;
        margin-bottom: 1.5rem;
    }
    .userinfotext .infoname {
        float: left;
        width: 6rem;
        height: 1.8rem;
        font-size: 0.8rem;
        color: #fff;
        line-height: 1.75rem;
        text-align: center;
        background: rgba(8, 18, 20, 0.2);
        border-radius: 0.2rem;
    }
    .userinfotext input {
        float: right;
        width: 15rem;
        height: 1.8rem;
        border-radius: 0.2rem;
        background: rgba(75, 77, 82, 0.3);
        font-size: 0.8rem;
        color: #fff;
        box-sizing: border-box;
        padding-left: 0.4rem;
    }
    /*----微信验证----*/
    .comf_bg {
        position: fixed;
        left: 0;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
    }
    .comf_bg .cancel {
        position: absolute;
        left: 49rem;
        top: 3rem;
        color: #fff;
    }
    .comf_bg .cancel:hover {
        color: red;
    }
    .wxyz_start {
        float: right;
        width: 5rem;
        height: 1.8rem;
        color: #fff;
        font-size: 0.8rem;
        background: #39b4a8;
        border-radius: 0.2rem;
        margin-right: 0.5rem;
        border: 0;
    }
    .wx_unbind {
        float: right;
        width: 5rem;
        height: 1.8rem;
        color: #fff;
        font-size: 0.8rem;
        background: #aa5753;
        border-radius: 0.2rem;
        margin-right: 0.5rem;
        border: 0;
    }
    .wxyz_sign {
        float: right;
        font-size: 0.7rem;
        padding: 0.3rem 0rem;
    }
    .wxyz_sign .icon {
        vertical-align: middle;
        font-size: 1rem;
        margin-right: 0.1rem;
    }
    .yz_succeed {
        color: #13c59d;
    }
    .yz_not {
        color: #aa5753;
    }
    .wx_yzm {
        width: 16rem;
        height: 16rem;
    }
</style>
