<template>
    <!--内容主题嵌套路由-->
    <div class="main">
        <div class="view">
            <router-view id="view_box"></router-view>
        </div>
        <ul class="bar clearfix">
            <li class="fl" v-for="(item,index) in navList" :style="{backgroundColor: (item.src==$route.path||item.srcArry.indexOf($route.path)>-1 ? '#f3f3f3' : 'white')}" @click="navBarleftClick(item,index)">
                <i alt="" :class="item.iconImg" :style="{ color: ( item.src==$route.path||item.srcArry.indexOf($route.path)>-1  ? '#4b8afc' : '#696969')  }"></i>
                <p :style="{ color: ( item.src==$route.path||item.srcArry.indexOf($route.path)>-1  ? '#4b8afc' : '#696969')  }">{{item.navBarleftTitle}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
    //总体概况 item.src==$route.path||item.srcArry.indexOf($route.path)>-1 ?'color:#4b8afc':'#696969'

    export default {
        name: 'main',
        components: {
      
        },
        mounted() {
           
            
           
        },
        data() {
            return {
                navList:[

                  {
                    iconImg: 'icon-survey', 
                    navBarleftTitle: '总体概况', //名字
                    src: '/navBar/survey', //跳转地址
                    srcArry: []
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
                    src: '/navBar/warnbox/warning',
                    srcArry: ['/navBar/warnbox/strategy']
                  },
                  {
                    iconImg: 'icon-collect',
                    navBarleftTitle: '采集管理',
                    src: '/navBar/collect',
                    srcArry: []
                  },

                ],
                navIndex:0
            }
        },
        methods:{
            navBarleftClick:function(item,index){
                 this.$router.push(item.src);
            }
        },
        computed:{
         
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.main {
    // box-sizing: border-box;
    // display: flex;
    // flex-direction: column;
    // padding-bottom: 0.98rem;
    // box-sizing: border-box;
}
#view_box {
    // padding-bottom: 0.98rem;
    // height: 518px;

}
.view {
    // padding-bottom: 0.98rem;
    // flex-grow:1;
    // margin-bottom: 0.98rem;

}
.bar {
    // flex-shrink: 0;
    height: 0.98rem;
    border-top: 1px solid #bfbfbf;
    box-sizing: content-box;
    background-color: white;
    // position: relative;
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9999;
    li {
        width: 25%;
        height: 0.98rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center; 
        >p {
            font-size: 0.24rem;
            margin-top: 0.05rem;
        }
        >i {
            font-size: 0.38rem;
            margin-top: 0.1rem;
        }      
    }
}
</style>
