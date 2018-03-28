<template>
  <div id="navBarleft">
    <ul v-if="modetype=='main'">
      <li class="clickable" :key="item.navBarleftTitle" v-for="(item,index) in mainBarData" @click="navBarleftClick(item)">
        <i alt="" :class="item.iconImg" :style="item.src==$route.path||item.srcArry.indexOf($route.path)>-1?'color:#fff':'' "></i>
        <p v-show="item.src==$route.path||item.srcArry.indexOf($route.path)>-1" class="barTitle">{{item.navBarleftTitle}}</p>
      </li>
    </ul>
    <ul v-if="modetype=='manage'">
      <li class="clickable" :key="item.navBarleftTitle" v-for="(item,index) in manageBarData" @click="navBarleftClick(item)">
        <i alt="" :class="item.iconImg" :style="item.src==$route.path||item.srcArry.indexOf($route.path)>-1?'color:#fff':'' "></i>
        <p v-show="item.src==$route.path||item.srcArry.indexOf($route.path)>-1" class="barTitle">{{item.navBarleftTitle}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'navBarLeft',
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
        clickIndex: 0, //选中值
        mainBarData: [ //main tab数组
          {
            iconImg: 'icon-survey',
            navBarleftTitle: '总体概况', //名字
            src: '/navBar/survey', //跳转地址
            srcArry: ['/navBar/warning/']
          },
          {
            iconImg: 'icon-monitoring',
            navBarleftTitle: '监控',
            src: '/navBar/generalOverview',
            srcArry: [
              '/navBar/generalOverview',
              '/navBar/monitorView/'
            ]
          },
          {
            iconImg: 'icon-warning',
            navBarleftTitle: '告警',
            src: '/navBar/warning',
            srcArry: []
          },
          {
            iconImg: 'icon-collect',
            navBarleftTitle: '采集管理',
            src: '/navBar/collect',
            srcArry: []
          },
          {
            iconImg: 'icon-callChain',
            navBarleftTitle: '调用链监控',
            src: '/navBar/callChain',
            srcArry: ['/navBar/chainDetail']
          },
        ],
        manageBarData: [ //manage tab数组
          {
            iconImg: 'icon-personalcenter',
            navBarleftTitle: '个人中心', //名字
            src: '/manageBar/personalCenter', //跳转地址
            srcArry: []
          },{
            iconImg: 'icon-usermanage',
            navBarleftTitle: '用户管理', //名字
            src: '/manageBar/userManage', //跳转地址
            srcArry: []
          },{
            iconImg: 'icon-powermanage',
            navBarleftTitle: '权限接口', //名字
            src: '/manageBar/powerManage', //跳转地址
            srcArry: []
          }
        ]
      }
    },
    methods: {
      navBarleftClick: function(item) {
        //菜单点击事件
        // this.clickIndex = index
        // console.log(this)
        this.$router.push(item.src)
      }
    }
  }
</script>

<style scoped>
  #navBarleft i {
    font-size: 2.0rem;
    color: #40414e;
  }
  .navBarTitle {
    height: 1.5rem;
  }
  #navBarleft ul {
    padding-top: 1.4rem;
  }
  #navBarleft li {
    /*padding-top:3rem;*/
    margin-bottom: 1.4rem;
  }
  #navBarleft li p {
    line-height: 1.6rem;
    height: 1.6rem;
    font-size: 0.8rem;
    color: #fff;
  }
  .activeClass {
    color: #fff;
  }
</style>
