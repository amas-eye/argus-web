<template>
  <div class="navBar">
    <div class="header-section">
      <navBarTop modetype='manage'></navBarTop>
    </div>
    <div class="main-content">
      <div v-if="isadmin||isroot" class="left-side sticky-left-side">
        <navBarLeft modetype='manage'></navBarLeft>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import navBarLeft from '../components/navBarLeft';
  import navBarTop from '../components/navBarTop'
  export default {
    name: 'manageBar',
    components: {
      navBarTop,
      navBarLeft
    },
    data() {
      return {}
    },
    computed: {
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
    beforeRouteEnter: (to, from, next) => {
      // console.info('ff', this)
      next(
        vm => {
          let store = vm.$store //vuex 状态管理store
          let userinfo = store.state.login_module.userinfo
          if (to.path == '/manageBar/userManage' || to.path == '/manageBar/powerManage') {
            //用户管理
            if (userinfo.group_name == 'admin' || userinfo.is_admin) {
            } else {
              Message({
                message: '没有权限',
                type: 'error',
                showClose: true
              })
              this.$router.push('/navBar/generalOverview') //主页
            }
          }
        }
      )
    },
    methods: {},
    mounted() {},
  }
</script>
<style scoped>
  .navBar {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 100%;
    /* display: flex; */
  }
  .navBar .left-side {
    top: 4rem;
    /* float:left; */
  }
  .navBar .sticky-left-side {
    /* position: fixed; */
    /* height: 100%; */
    /* z-index: 100; */
  }
  .left-side {
    width: 4.25rem;
    left: 0;
    overflow: hidden;
    outline: none;
    background: rgba(12, 17, 37, 0.4);
    /*flex-shrink: 0;*/
  }
  .navBar .main-content {
    flex: 1;
    /* padding-top: 4rem; */
  }
  .main-content {
    display: flex;
    /* float:right; */
    /* margin-left: 4.25rem; */
  }
  .navBar .header-section {
    /* position: fixed; */
    width: 100%;
    /* z-index: 100; */
    flex-shrink: 0;
  }
  .header-section {
    background: rgba(12, 17, 37, 0.4);
    height: 3.5rem;
  }
  .wrapper {
    padding: 0.5rem;
    width: 62.45rem;
    box-sizing: border-box;
    flex-grow: 1;
  }
</style>
