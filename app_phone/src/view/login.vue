<template>
  <div class="login" :style="{height:height,backgroundImage:'url(' + require('../img/bg.png') +')'}">
    <div class="form">
      <img class="logo" src="../img/logo.png" alt="">
      <div class="welcom">
        大数据智能监控平台
      </div>

      <div class="login-form">
        <div class="login-text">
          <div class="img_box" :style="{backgroundImage:'url(' +require('../img/account.png')+ ')'}">

          </div>
          <!-- <img src="../img/account.png" alt=""> -->
          <input v-model.trim="login_info.username" type='text' placeholder="请输入用户名" />
        </div>
        <div style='margin-bottom:0;' class="login-text">
          <!-- <img src="../img/password.png" alt=""> -->
          <div class="img_box" :style="{backgroundImage:'url(' +require('../img/password.png')+ ')'}">

          </div>
          <input v-model.trim="login_info.password" type='password' placeholder="请输入密码" />
        </div>
        <a href="javascript:" class="login_btn" :style="{backgroundImage:'url(' +require('../img/loginBtnBg.png')+ ')'}" v-on:click="login()">登 录</a>
      </div>
    </div>
  </div>
</template>

<script>
  import http from 'service/myhttp'
  import urls from 'service/url'
  import { Toast, MessageBox } from 'mint-ui';
  export default {
    name: 'login',
    components: {},
    data() {
      return {
        msg: '登录',
        coresrc: '',
        login_info: {
          username: '',
          password: '',
        },
        height:'0'
      }
    },
    methods: {

      getHeight() {
        if (window.innerHeight) {
          this.height = window.innerHeight + 'px';
        } else if ((document.body) && (document.body.clientHeight)) {
          this.height = document.body.clientHeight + 'px';
        }
      },
      getcore: function() {
        // //更改地址获取验证码
        // this.coresrc = '/wifi/login_Login_getIdCode?time=' + Math.random()
      },
      login: function() {

      if (this.login_info.username.length <= 0) {
          Toast('账号不能为空');
          return;
      }else if (this.login_info.password.length <= 0) {
          Toast('密码不能为空');
        return;
      }



        // this.$router.push('/navBar/survey')
        // 登录
        http.post(urls.LOGIN, this.login_info).then(
          res => {



              MessageBox.confirm('确定绑定微信帐号吗?').then(action => {
                  this.$router.replace('/navBar/survey');
                  http.get(urls.WXBD).then(res => {
                      //alert(res.data.message);
                  })

              },err => {
                  this.$router.replace('/navBar/survey');
              });


              //成功
              // if (res.data == 200) {
              //   Toast('登录成功');
              //   this.$router.replace('/navBar/survey')
              // }else{
              //   Toast('登录失败');
              // }


          },
          err=>{

          }
        )
      }
    },
    mounted() {
      this.getHeight();
    },
    beforeRouteEnter: function(to, from, next) {
      //路由钩子
      // console.log('enter')
      next(vm => {
        //获取验证码
        // vm.getcore()
      })
    },
    beforeRouteLeave: function(to, from, next) {
      console.log('leave')
      next()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only lang="less" -->
<style  scoped>
  input::-webkit-input-placeholder {
    color: #fff;
  }
  .login-text {
    border-radius: 0;
    margin: 0 0 0.32rem 0;
    height: 0.8rem;
    background-color: rgba(255, 255, 255, 0.25);
    color: #fff;
    display: flex;
    align-items: center;

  }
  .login-text img {
    width: 0.48rem;
    vertical-align: middle;
    margin-right: 0.25rem;
  }
  .login-text .img_box {
    width: 0.86rem;
    height: 0.8rem;
    flex-shrink: 0;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 0.46rem 0.48rem;
  }

  .login-text input {
    outline: 0;
    border: 0;
    padding: 0rem 0rem;
    height: 100%;
    background-color: transparent;
    color: #fff;
    flex-grow: 1;
    /*margin-left: 0.15rem;*/
  }

  .login {
    /* background: -webkit-linear-gradient(140deg, #6C8CD9 40%, #50B9E9);
            background: -moz-linear-gradient(140deg, #6C8CD9 40%, #50B9E9);
            background: -o-linear-gradient(140deg, #6C8CD9 40%, #50B9E9);
            background: linear-gradient(140deg, #6C8CD9 40%, #50B9E9); */
    /*background-image: url('../img/bg.png');*/
    /*background-size: cover;*/
    /*height: 454px;*/
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
/*    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;*/
  }
  .login-form {
    width: 6rem;
    margin: auto;
  }
  .logo {
    width: 1.84rem;
    height: 1.62rem;
  }
  .core {
    text-align: right;
    font-size: 3vw;
    margin-top: 6vw;
    color: #999;
  }
  .login-buttonground {
    margin-top: 0.86rem;
  }
  .login-button {
    width: 100%;
    font-size: 0.34rem;
    height: 0.8rem;
    background: -webkit-linear-gradient(left, RGB(177, 223, 249) 30%, RGB(192, 205, 249));
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(left, RGB(177, 223, 249) 30%, RGB(192, 205, 249));
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(left, RGB(177, 223, 249) 30%, RGB(192, 205, 249));
    /* Firefox 3.6 - 15 */
    background: linear-gradient(left, RGB(177, 223, 249) 30%, RGB(192, 205, 249));
    /* 标准的语法 */
    color: #fff;
    box-shadow: 0.24rem 0.08rem 0.48rem #a4c0eb;
  }
  .login .form {
    width: 100%;
    /*margin-bottom: 2rem;*/
  }
  .welcom {
    margin: 0.22rem 0rem 1.08rem 0rem;
    text-align: center;
    color: #fff;
    font-size: 0.48rem;
  }
  .login_btn {
    margin-top: 0.86rem;
    display: block;
    height: 0.8rem;
    line-height: 0.8rem;
    font-size: 0.30rem;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: white;
    box-shadow: 0.04rem 0.04rem 0.12rem #a4c0eb;
  }
</style>
