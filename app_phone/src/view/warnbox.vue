<template>
    <div class="warnbox">
        <div class="nav">
            <div v-for="(item,index) in navData" :class="{'active':(item.src==$route.path||item.srcArry.indexOf($route.path)>-1)}" @click="navClick(item,index)">
                {{item.title}}
            </div>
        </div>
        <router-view class="view_box"></router-view>
    </div>
</template>
<script>
import urls from 'service/url'
import http from 'service/myhttp'
import simdate from 'service/simdate'
import { Indicator, Loadmore } from 'mint-ui';

export default {
    name: 'warnbox',
    components: {

    },
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            navData:[
                {title:'告警策略',src: '/navBar/warnbox/warning',srcArry:[]},
                {title:'告警历史',src: '/navBar/warnbox/strategy',srcArry:[]}
            ],

        }
    },
    methods: {
        navClick:function(item,index){
            if (item.src === this.$route.path) {
            }else{
               this.$router.push(item.src);
            }
        }

    },
    mounted() {

    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.warnbox {


}
.nav {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    display: flex;
    padding: 0 0.2rem;
    border-bottom: 0.01rem solid #dadada;
    flex-shrink: 0;
    z-index: 1000;
    background-color: #fff;
    >div {
        width: 50%;
        box-sizing: border-box;
        height: 0.87rem;
        line-height: 0.87rem;
        
        font-weight: bold;
        font-size: 0.32rem;
        color: #68686a;
    }
    .active {
        color: #7172e8;
        border-bottom: 0.04rem solid #7172e8;
    }
}
.view_box {
    padding-top: 0.88rem;
}
</style>