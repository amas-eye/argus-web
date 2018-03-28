<template>
  <div @keypress.enter="login()" class="login">
    <img class="logo" src="../img/logo_login.png">
    <div class="form">
      <div class='headtab'>
        <div class="ch-title">
          大数据智能监控平台
        </div>
        <!-- <div class="en-title">
                                      WiFi Bid Data Platform
                                    </div> -->
      </div>
      <!-- <div class="welcom">
                                    欢迎使用WiFi大数据平台</br>请输入用户信息
                                  </div> -->
      <div class="login-form">
        <div class="login-text">
          <i class="icon-account"></i>
          <input v-model="login_info.username" type='text' placeholder="用户名" />
        </div>
        <div style='margin-bottom:0;' class="login-text">
          <i class="icon-password"></i>
          <input v-model="login_info.password" type='password' placeholder="密码" />
        </div>
        <!-- <div class="core">
                                <div class="core-text">
                                  <input v-model="login_info.yzm" type='text' placeholder="请输入验证码" />
                                </div>
                                <img style="width:7rem; height:3rem;" @click="getcore()" :src="coresrc"></img>
                                 <span v-on:click="$router.push('forget_password')">忘记密码?</span> 
                              </div> -->
        <div class="login-buttonground">
          <!--mt-button class='login-button' v-on:click="login">登录</mt-button-->
          <button class='login-button clickable' type="button" @click="login()">登 录</button>
        </div>
      </div>
    </div>
    <div class="copyright">广州优亿信息科技有限公司</div>
  </div>
</template>

<script>
  import http from 'service/myhttp'
  import urls from 'service/url'
  export default {
    name: 'login',
    components: {},
    data() {
      return {
        msg: '登录',
        coresrc: '',
        login_info: {
          username: null,
          password: null,
          // yzm: null
        }
      }
    },
    methods: {
      // getcore: function() {
      //   //更改地址获取验证码
      //   this.coresrc = '/wifi/login_Login_getIdCode?time=' + Math.random()
      // },
      login: function() {
        // 登录
        http.post(urls.LOGIN, this.login_info).then(
          res => {
             console.info('登录',res)
             this.$router.push('/navBar/generalOverview')
            
          },
          err=>{
            
          }
        )
      }
    },
    mounted() {},
    beforeRouteEnter: function(to, from, next) {
      //路由钩子
      // console.log('enter')
      next(vm => {
        // //获取验证码
        // vm.getcore()
      });
    },
    beforeRouteLeave: function(to, from, next) {
      // console.log('leave')
      next();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  input::-webkit-input-placeholder {
    color: #fff;
  }
  .headtab {
    background-color: transparent !important;
    color: #fff !important;
    text-align: left;
    padding: 1.8rem 0rem;
    /* border-bottom: 1px solid #ddd !important; */
  }
  .headtab .ch-title {
    /* border-bottom: 1px solid #ddd !important; */
    font-size: 1.2rem;
    /* padding-bottom: 1.5rem; */
    text-align: center;
  }
  .headtab .en-title {
    font-size: 3.8rem;
    padding-top: 2px;
  }
  .login-text {
    width: 18.2rem;
    height: 1.8rem;
    border-radius: 0rem;
    margin: 0rem auto 1.4rem auto;
    text-align: center;
    padding: 1px 0%;
    background-color: rgba(0, 0, 0, 0.2);
    color: #fff;
    position: relative;
  }
  .core-text {
    /*border: 1px solid #999; */
    border-radius: 0rem;
    /* margin: 0rem 0 6rem 0; */
    text-align: center;
    /* padding: 1px 0%; */
    width: 12rem;
    float: left;
    background-color: #3C6792;
    color: #fff;
  }
  .core-text input {
    outline: 0;
    border: 0;
    padding: 1rem 1rem;
    width: 10rem;
    background: transparent;
    font-size: 1rem;
  }
  .login-text i{
        position: absolute;
    left: 0.4rem;
    top: 0.4rem;
    font-size: 1rem;
  }
  .login-text input,
  .verification_code .text input {
    outline: 0;
    border: 0;
    box-sizing: border-box;
    padding-left: 1.8rem;
    width: 100%;
    height: 100%;
    font-size: 0.7rem;
    background-color: transparent;
    color: #fff;
  }
  .verification_code {
    display: table;
    width: 100%;
    margin: 0rem 0 6rem 0;
  }
  .verification_code .text input {
    width: 80%;
  }
  .verification_code .text {
    float: left;
    width: 56%;
    padding: 1px;
    border: 1px solid #999;
    border-radius: 2rem;
    text-align: center;
  }
  .verification_code button {
    float: right;
    border: 1px solid #999;
    padding: 3rem 4rem;
    font-size: 4rem;
    border-radius: 2rem;
    color: #999;
    background-color: #fff;
    outline: 0;
  }
  .login {
    background: url('../img/bg_login.png');
    background-size: cover;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .login-form {
    /* margin-bottom: 2.8rem; */
    text-align: center;
  }
  .core {
    text-align: right;
    /* font-size: 3rem; */
    margin-top: 2rem;
    color: #999;
  }
  .login-buttonground {
    width: 18.2rem;
    height: 2.1rem;
    margin: 2.6rem auto 0rem auto;
  }
  .login-button {
    width: 100%;
    font-size: 0.8rem;
    height: 100%;
    margin-bottom: 0rem;
    background: linear-gradient(to right, #83d8ee, #90B1E0);
    color: #fff;
    box-shadow: none;
    border: 0;
  }
  .login .form {
    width: 23.1rem;
    height: 17.55rem;
    background-color: rgba(0, 0, 0, 0.35);
  }
  .login .logo {
    width: 4.65rem;
    height: 3.9rem;
    margin-bottom: 1.3rem;
  }
  .welcom {
    margin: 50px 0px;
    text-align: center;
    color: #fff;
    font-size: 4rem;
  }
  .copyright {
    color: #ffffff;
    margin-top: 3.4rem;
    font-size: 0.65rem;
  }
</style>
