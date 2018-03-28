<template>
  <div class="chainDetail">
    <!-- 顶部信息 -->
    <div class="header_box">
      <h2>FRONTEND:HTTP GET/DISPATCH</h2>
      <div class="filtrate_box clearfix">
        <div class="fl clearfix">
          <p class="fl">追踪起始时间：</p>
          <span class="fl">{{timeFun(dataInfo.start_time)}}</span>
          <p class="fl">消耗时长：</p>
          <span class="fl">{{dataInfo.total_duration}}MS</span>
          <p class="fl">服务数：</p>
          <span class="fl">{{dataInfo.service_count}}</span>
          <p class="fl">最大调用深度：</p>
          <span class="fl">{{dataInfo.deepth}}</span>
          <p class="fl">总调用数：</p>
          <span class="fl">{{dataInfo.total_span}}</span>
        </div>
        <button class="fr">搜&nbsp;索</button>
        <input type="text" name="" class="fr">
      </div>
    </div>
    <!-- 顶部信息 -->
    <!-- 内容 -->
    <div class="table_box">
      <div class="top clearfix">
        <div class="left fl">服务名称</div>
        <div class="right fl">时长</div>
      </div>
      <div class="zt_div">
        <ztree :list="dataList" :isOpen="false"></ztree>
      </div>
    </div>
    <!-- 内容 -->
  </div>
</template>
<script>
import http from 'service/myhttp'
import urls from 'service/url'
import ztree from 'components/ztree'
import simdate from 'service/simdate'
export default {
  name: 'chainDetail',
  components: {
    ztree
  },
  data() {
    return {
      msg: '登录',
      dataInfo:{},//顶部信息
      dataList:[],//列表展开数据
      dataList2:[{
            id:2,
            parentId:0,
            name:"视频",
            value:800,
            path:"",
            children:[{
               id:3,
               parentId:2,
               name:"电影",
               value:400,
               children:[{
                  id:4,
                  parentId:3,
                  name:"国产电影",
                  path:"",
                  value:200
               },{
                  id:5,
                  parentId:3,
                  name:"好莱坞电影",
                  path:"",
                  value:100
               },{
                  id:6,
                  parentId:3,
                  name:"小语种电影",
                  path:"",
                  value:100
               }]
            },{
               id:7,
               parentId:2,
               name:"短片",
               value:400,
               children:[{
                  id:9,
                  parentId:7,
                  name:"电视剧",
                  path:"",
                  value:100
               },{
                  id:10,
                  parentId:7,
                  name:"动画片",
                  path:"",
                  value:300,
                  children:[
                  {
                    id:11,
                    parentId:10,
                    name:"猫和老鼠",
                    path:"",
                    value:100,                    
                  },
                  {
                    id:13,
                    parentId:10,
                    name:"喜洋洋",
                    path:"",
                    value:200,                    
                  }
                  ]
               }]
            }],
            
         }]
    }
  },
  methods: {
    treeFun:function(){
      http.get(urls.HDDETAIL + this.$route.query.id).then(res => {
        let data = res.data;
        this.dataInfo = data.data; 
        let arr = [];
        arr.push(data.data.spans);
        this.dataList = arr;
      })
    },
    timeFun:function(str){ //时间戳转换
      str += ''
      return simdate.TMDTime(new Date(parseInt(str.slice(0,13))));
    }
  },
  mounted() {
    this.treeFun();
  },
  beforeRouteLeave (to, from, next) {
    console.log('to',to);
    if (to.path.indexOf('/navBar/callChain') === -1) {
      this.$store.commit('clearCallChainPar');
    }
    next()
  },
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.header_box {
  h2 {
    font-size: 0.8rem;
    font-weight: bold;
    color: white;
    margin-bottom: 0.5rem;
    text-align: left;
  }
  .filtrate_box {
    div {
      height: 1.5rem;
      color: white;
      background-color: rgba(75, 77, 82, 0.31);
      border-radius: 0.3rem;
      padding-left: 0.5rem;
      margin-bottom: 0.5rem;
      >p,
      >span {
        height: 1.5rem;
        line-height: 1.5rem;
        color: white;
        font-size: 0.7rem;
      }
      >p {
        font-weight: bold;
      }
      >span {
        margin-right: 0.5rem;
      }
    }
    button {
      height: 1.5rem;
      line-height: 1.5rem;
      text-align: center;
      font-size: 0.7rem;
      font-weight: bold;
      color: white;
      background-color: #639be8;
      width: 4.7rem;
      border-radius: 0.3rem;
      cursor: pointer;
    }
    input {
      height: 1.5rem;
      width: 10.5rem;
      line-height: 1.5rem;
      box-sizing: border-box;
      padding-left: 5px;
      border-radius: 0.3rem;
      color: white;
      font-size: 0.7rem;
      margin-right: 0.4rem;
      background-color: rgba(75, 77, 82, 0.31);
    }
  }
}

.table_box {
  height: 21.35rem;
  background: rgba(12, 17, 37, 0.25);
  
  border-radius: 0.3rem;
  padding: 0 1rem 1rem 1rem;
  box-sizing: border-box;
  // overflow: scroll;
  .top {
    height: 1.7rem;
    line-height: 1.7rem;
    color: white;
    font-size: 0.75rem;
    text-align: left;
    .left {
      width: 16.4rem;
    }
    .right {
      width: 43rem;
    }
  }
  .zt_div {
    background: #4a728b;
    height: 17.65rem;
    overflow-x: hidden;
    overflow-y: scroll;
  }
}

</style>
