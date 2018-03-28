<template>
  <div id="navBarTop">
    <div class="leftBar">
      <div class="logoImg"><img src="../img/logo.png" /></div>
      <div class="logo">{{logo}}</div>
    </div>
    <!-- 主模块 -->
    <div v-if="modetype=='main'" class="rightBar" @mouseout="dropdownshow=false" @mouseover="dropdownshow=true">
      <div @click="dropdownshow=!dropdownshow"  class="login clickable">
        <i class="icon-mine"></i>
        <div class="loginUser">{{loginUser}}</div>
        <i class="el-icon-caret-bottom el-icon--right arrow-down"></i>
      </div>
      <ul v-show="dropdownshow" @mouseout="dropdownshow=false" class="dropdown">
        <li v-if="(item.name!='用户管理'&&item.name!='权限管理')||isadmin||isroot" @click="toolsListClick(item)" class="item clickable" :key="item.name" v-for="item in toolsList">{{item.name}}</li>
      </ul>
    </div>
    <!-- 管理模块 -->
    <div v-if="modetype=='manage'" class="rightBar" @mouseover="dropdownshow=true">
      <div @click="dropdownshow=!dropdownshow" class="login clickable">
        <i class="icon-mine"></i>
        <div class="loginUser">{{loginUser}}</div>
      </div>
      <!-- <ul v-show="dropdownshow" @mouseout="dropdownshow=false" class="dropdown">
                <li class="item clickable" :key="item.name" v-for="item in toolsList">{{item.name}}</li>
              </ul> -->
    </div>
  </div>
</template>

<script>
  import http from 'service/myhttp'
  import urls from 'service/url'
  export default {
    name: 'navBarTop',
    props: {
      modetype: { //模块类型 ('main'主模块'manage'管理模块)
        type: String,
        default: function() {
          return 'main'
        }
      }
    },
    data() {
      return {
        logo: '大数据智能监控平台',
        exitUser: '退出',
        dropdownshow: false, //下拉菜单
        toolsList: [{
            name: '个人中心',
            url: '/manageBar/personalCenter'
          },
          {
            name: '用户管理',
            url: '/manageBar/userManage'
          },
          {
            name: '权限管理',
            url: '/manageBar/powerManage'
          },
          {
            name: '退出',
            url: ''
          }
        ]
      }
    },
    computed: {
      loginUser: function() {
        //用户名
        return this.$store.state.login_module.userinfo.name
      },
      isadmin: function() {
        //是否系统管理员
        return this.$store.state.login_module.userinfo.group_name == "admin"
      },
      isroot: function() {
        //是否超级管理员
        let data = this.$store.state.login_module.userinfo.is_admin || false
        return data
      }
    },
    methods: {
      toolsListClick: function(item) {
        //工具菜单点击事件
        // this.clickIndex = index
        // console.log(this)
        if (item.name != '退出') {
          // this.$router.push(item.url)

          // window.open(window.location.origin + '/#' + item.url) //新tab
          // window.open(window.location.origin +'/argusapp/#'+item.url) //外网
          window.open(window.location.origin +item.url) //外网h5
        } else {
          http.get(urls.lOGOUT).then(res => {
            //登出
            this.$store.commit('setuserinfo', null)
            this.$router.push('/login')
          })
        }
      }
    }
  }
</script>

<style scoped>
  .logoImg {
    color: #fff;
    float: left;
    padding: 0 0.7rem;
    margin: 0.8rem 0.2rem;
    font-size: 1rem;
    font-weight: bold;
  }
  .logoImg img {
    width: 2.5rem;
  }
  .logo {
    float: left;
    font-size: 1rem;
    padding: 0 1.1rem;
    margin: 1.15rem 0;
    color: #fff;
    font-weight: lighter;
    border-left: 1px solid #4a4f50;
  }
  .rightBar .icon-mine {
    font-size: 1.25rem;
    color: #3f404b;
    float: left;
    margin-top: 0.25rem;
  }
  .rightBar .arrow-down {
    padding: 0.5rem 0rem;
    font-size: 0.5rem;
  }
  .rightBar {
    float: right;
    overflow: hidden;
    margin: 1.15rem 0;
    position: relative;
    overflow: visible;
  }
  .rightBar>div {
    float: left;
    padding: 0 1.75rem;
    height: 2rem;
  }
  .rightBar .login {
    /* border-right: 1px solid #4a4f50; */
  }
  .loginUser,
  .exitUser {
    display: inline-block;
    float: left;
    /* margin-left: 0.75rem; */
    padding: 0.15rem 0.5rem;
    font-size: 0.85rem;
    color: #3f404b;
    font-weight: lighter;
  }
  .dropdown {
    background: #081214;
    position: absolute;
    left: 1.55rem;
    top: 2rem;
    z-index: 2;
  }
  .dropdown .item {
    width: 6rem;
    height: 1.8rem;
    line-height: 1.8rem;
    font-size: 0.7rem;
    color: #808895;
  }
  .dropdown .item:hover {
    color: #7eb2e6 !important;
  }
  .dropdown .item:nth-last-child(n+2) {
    border-bottom: 1px solid #7581a7
  }
</style>
