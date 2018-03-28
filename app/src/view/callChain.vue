<template>
  <div class="callChain">
    <!-- 顶部筛选条件 -->
    <div class="header_box">
      <div class="top header_wrapper_box">
        <button class="btn">服&nbsp;&nbsp;务</button>
        <div class="service_box1 select_div  common_element">
          <el-select v-model.trim="par.service" placeholder="请选择服务">
            <el-option v-for="(val,index) in services" :label="val" :value="val">
            </el-option>
          </el-select>
        </div>
        <div class="service_box2 select_div common_element">
          <el-select v-model.trim="tagsle" placeholder="请选择标签分类">
            <el-option :label="'不限'" :value="'all'">
            </el-option>
          </el-select>
        </div>
        <button class="btn">TAG</button>
        <div class="tag_box select_div common_element">
          <el-select v-model="par.tag" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
            <el-option v-for="item in tags" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="bottom header_wrapper_box">
        <button class="btn">条数限制</button>
        <div class="num_box select_div common_element">
          <el-select v-model.trim="par.limit" placeholder="请选择条数">
            <el-option v-for="(val,index) in tsLimt" :label="val" :value="val">
            </el-option>
          </el-select>
        </div>
        <div class="hs_time_box">
          <button class="btn">回溯时长</button>
          <div class="select_box  common_element">
            <input type="" name="" class="common_element" v-model.trim.number="lookbackPar.lookback2">
            <div class="select_div" style="height: 100%;">
              <el-select v-model="lookbackPar.hstimeunit" placeholder="">
                <el-option v-for="(val,index) in timeunits" :label="val" :value="val">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <button class="btn">最短用时</button>
        <div class="short_time_box">
          <div class="left_box">
            <!-- <input type="" class="short_input common_element" name=""> -->
            <div class="common_element short_input_div">
              <input type="text" name="" class="common_element" v-model.trim.number="mindurationPar.minduration2">
              <div class="select_div" style="height: 100%;">
                <el-select v-model="mindurationPar.shorttimeunit" placeholder="">
                  <el-option v-for="(val,index) in timeunits2" :label="val" :value="val">
                  </el-option>
                </el-select>
              </div>
            </div>
            <button class="btn">最长用时</button>
            <!-- <input type="" class="long_input common_element" name=""> -->
            <div class="common_element long_input_div">
              <input type="text" name="" class="common_element" v-model.trim.number="maxdurationPar.maxduration2">
              <div class="select_div" style="height: 100%;">
                <el-select v-model="maxdurationPar.longtimeunit" placeholder="">
                  <el-option v-for="(val,index) in timeunits2" :label="val" :value="val">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <button class="search_btn common_element" @click="searchClick">搜&nbsp;&nbsp;索</button>
        </div>
      </div>
    </div>
    <!-- 顶部筛选条件 -->
    <!-- 表格内容 -->
    <div class="table_box">
      <table border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr :style="{borderWidth:(dataList && dataList.length > 0 ? '1px' : 0) }">
            <td>调用链名称</td>
            <td>使用详情</td>
            <td>调用状态</td>
            <td>发生时间</td>
            <td>耗时</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(val,index) in dataList">
            <td>
              <a href="javascript:" @click="$router.push({path:'/navBar/chainDetail',query:{id:val.trace_id}})" style="color: white;">{{val.service_name}}</a>
               <!-- {{val.service_name}} -->
            </td>
            <td>
              <div class="over_div">
                <div class="left_div fl">
                  <detailTip class="tip" :obj="item" :color="item.color" v-for="(item,index) in tipArr(true,val.tracing_detail)"></detailTip>
                </div>
                <div class="right_div fr" v-show="val.tracing_detail && val.tracing_detail.length > 4">
                  <div class="more_tip">...
                    <div class="more_tip_box">
                      <div class="triangle-left"></div>
                      <div class="tip_box clearfix">
                        <detailTip class="sub_tip fl" :obj="item" :color="item.color" v-for="(item,index) in tipArr(false,val.tracing_detail)"></detailTip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <span class="spans">{{val.total_span}} SPANS</span>
              <span class="errors">{{val.error}} ERRORS</span>
            </td>
            <td>
              {{timeFun(val.start_time)}}
            </td>
            <td>{{val.duration + ' MS'}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 表格内容 -->
    <pageIndicator v-if="pagecount>0" :value.sync="par.page" :pagecount="pagecount" @pageClick="pageClick"></pageIndicator>
  </div>
</template>
<script>
import http from 'service/myhttp'
import urls from 'service/url'
import detailTip from 'components/detailTip'
import simdate from 'service/simdate'
import pageIndicator from 'components/pageIndicator' //分页器
import { mapState } from 'vuex'
export default {
  name: 'callChain',
  components: {
    detailTip,
    pageIndicator
  },
  data() {
    return {
      msg: '登录',
      tagsle: '',
      timeunits: ['分钟', '小时', '天','周','月'], //频率数组
      timeunits2: ['毫秒', '秒', '分钟', '小时', '天'], //频率数组
      tsLimt: [10, 20, 50, 100, 500], //条数限制
      par: { //请求参数
        service: '',
        limit: '',
        lookback: '',
        tag: '',
        maxduration: '',
        minduration: '',
        page: 1
      },
      lookbackPar:{
        hstimeunit: '分钟',
        lookback2:''
      },
      maxdurationPar:{
        longtimeunit:'毫秒',
        maxduration2:'',
      },
      mindurationPar:{
        shorttimeunit: '毫秒',
        minduration2: ''
      },
      services: [], //服务名
      tags: [], //TAG
      loading: false, //TAG列表数据请求状态
      dataList: [], //列表数据
      //pageactive: 1, //当前页码
      itemcount: 0, // 数据总数
      onepagecount: 10, //一页显示个数
    }
  },
  methods: {
    servicesFun: function() { //获取服务名
      http.get(urls.HDFWM).then(res => {
        let data = res.data;
        this.services = data.services ? data.services : [];
      })
    },
    remoteMethod(query) { // 获取tag下拉列表数据
      if (this.par.service && this.par.service.length > 0 && query && query.length > 0) {
        this.loading = true;
        http.get(urls.HDTAG + this.par.service, {
          prompt: query
        }).then(res => {
          this.loading = false;
          let data = res.data;
          this.tags = data.tags;
        }).catch(err => {
          this.loading = false;
          this.tags = [];
        })

      } else {
        this.tags = [];
        this.par.tag= ''
      }
    },
    searchClick: function() { //搜索点击


      if ((this.par.service + '').length <= 0) {
        this.$message({
          showClose: true,
          message: '服务不能为空',
          type: 'warning'
        })
        return;
      } else if ((this.par.limit + '').length <= 0) {
        this.$message({
          showClose: true,
          message: '条数限制不能为空',
          type: 'warning'
        })
        return;
      } else if ((this.lookbackPar.lookback2 + '').length <= 0) {
        this.$message({
          showClose: true,
          message: '回溯时长不能为空',
          type: 'warning'
        })
        return;
      } else if (!Number.isInteger(this.lookbackPar.lookback2)) {
        this.$message({
          showClose: true,
          message: '回溯时长必须是整数',
          type: 'warning'
        })
        return;
      } else if ((this.mindurationPar.minduration2 + '').length > 0 && !Number.isInteger(this.mindurationPar.minduration2)) {
        this.$message({
          showClose: true,
          message: '最短用时必须是整数',
          type: 'warning'
        })
        return;
      } else if ((this.maxdurationPar.maxduration2 + '').length > 0 && !Number.isInteger(this.maxdurationPar.maxduration2)) {
        this.$message({
          showClose: true,
          message: '最长用时必须是整数',
          type: 'warning'
        })
        return;
      }
      this.par.page = 1;
      let obj = Object.assign({}, this.par,{lookbackPar:this.lookbackPar},{maxdurationPar:this.maxdurationPar},{mindurationPar:this.mindurationPar});
      this.$store.commit('setCallChainPar',obj);

      this.listFunc();
    },

    tipArr:function(flag,arr){ //使用详情数组
      if (flag) {
        if (arr && arr.length > 0) {
          return arr.slice(0,4);
        }else{
          return [];
        }
      }else{
        if (arr && arr.length > 4) {
          return arr.slice(4);
        }else{
          return [];
        }
      }
    },
    pageClick:function(){ //页码点击
      this.listFunc();
      let obj = Object.assign({}, this.par,{lookbackPar:this.lookbackPar},{maxdurationPar:this.maxdurationPar},{mindurationPar:this.mindurationPar});
      this.$store.commit('setCallChainPar',obj);
    },
    timeFun:function(str){ //时间戳转换
      str += ''
      return simdate.TMDTime(new Date(parseInt(str)));
    },
    lookbackTimeTransform:function(val,time){
      if (time === '分钟') {
        return val;
      }else if (time === '小时') {
        return val* 60;
      }else if (time === '天') {
        return val* 60*24;
      }else if (time === '周') {
         return val* 60*24*7;
      }else if (time === '月') {
        return val* 60*24*30;
      }
    },
    mindurationTimeTransform:function(val,time){
      if (time === '毫秒') {
        return val;
      }else if (time === '秒') {
        return val* 1000;
      }else if (time === '分钟') {
        return val* 1000 * 60;
      }else if (time === '小时') {
         return val* 1000 * 60 * 60;
      }else if (time === '天') {
        return val* 1000 * 60 * 60 * 24;
      }
    },
    getPar:function(){ //从vuex获取筛选条件
      this.par.service = this.callChain.service;
      this.par.limit = this.callChain.limit;
      this.par.lookback = this.callChain.lookback;
      this.par.tag = this.callChain.tag;
      this.par.maxduration = this.callChain.maxduration;
      this.par.minduration = this.callChain.minduration;
      this.par.page = this.callChain.page;
      this.lookbackPar = this.callChain.lookbackPar;
      this.maxdurationPar = this.callChain.maxdurationPar;
      this.mindurationPar = this.callChain.mindurationPar;
      console.log('this.callChain',this.callChain);
    },
    listFunc:function(){ //列表内容请求数据
      http.get(urls.HDLIST, this.par).then(res => {
        let data = res.data;
        this.dataList = data.data;
        this.itemcount = data.total_traces;

      })
    }
  },
  mounted() {
    this.servicesFun();
    this.getPar();
    if (this.par.service && this.par.service.length > 0) {
      this.listFunc();
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path.indexOf('/navBar/chainDetail') === -1) {
      this.$store.commit('clearCallChainPar');
    }
    next()
  },
  computed: {
      pagecount: function() {
          //页面总数 （每页10个）
          return parseInt(this.itemcount / this.onepagecount) + (parseInt(this.itemcount % this.onepagecount) > 0 ? 1 : 0)
      },
      ...mapState({
        callChain: state => state.callChain,
      })
  },
  watch:{
    lookbackPar:{
      handler(val,oldVal){
        if (Number.isInteger(val.lookback2)) {
          this.par.lookback = this.lookbackTimeTransform(val.lookback2,val.hstimeunit);
        }else{
          this.par.lookback = val.lookback2;
        }
      },
      deep:true
    },
    maxdurationPar:{
      handler(val,oldVal){
        if (Number.isInteger(val.maxduration2)) {
          this.par.maxduration = this.mindurationTimeTransform(val.maxduration2,val.longtimeunit);
        }else{
          this.par.maxduration = val.maxduration2;
        }
      },
      deep:true
    },
    mindurationPar:{
      handler(val,oldVal){
        if (Number.isInteger(val.minduration2)) {
          this.par.minduration = this.mindurationTimeTransform(val.minduration2,val.shorttimeunit);
        }else{
          this.par.minduration2 = val.minduration2;
        }
      },
      deep:true
    },
  }


}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.header_box {
  //公共样式和变量放在前面
  $one_width: 7.7rem;
  $two_width: 13.7rem;
  $three_width: 30rem;
  $height: 1.5rem;
  $box_bgc: rgba(75, 77, 82, 0.31);
  .btn {
    background: rgba(68, 67, 80, 0.6);
    width: 4.5rem;
    height: 1.5rem;
    border-radius: 0.3rem;
    line-height: 1.5rem;
    border-width: 0;
    font-size: 0.7rem;
    color: #fff;
    outline: none;
  }
  .common_element {
    border-width: 0;
    border-radius: 0.3rem;
    height: 1.5rem;
    line-height: 1.5rem;
    background-color: $box_bgc;
    font-size: 0.7rem;
    color: white;
  }
  .select_div {
    box-sizing: border-box;
    padding: 0.2rem 0; // padding: 0.2rem 0;
    // line-height: 1.3rem !important;
  }
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    .service_box1 {
      width: $one_width;
      position: relative;
    }
    .service_box2 {
      width: $two_width;
    }
    .tag_box {
      width: $three_width;
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    .num_box {
      width: $one_width;
    }
    .hs_time_box {
      width: $two_width;
      display: flex;
      justify-content: space-between;
      .select_box {
        width: 8.9rem;
        display: flex;
        >input {
          padding-left: 5px; // flex-grow:1;
          background-color: transparent;
          width: 4.9rem;
        }
        >div {
          width: 4rem;
        }
      }
    }
    .short_time_box {
      width: $three_width;
      display: flex;
      justify-content: space-between;
      .left_box {
        width: 22.8rem;
        display: flex;
        justify-content: space-between;
        .short_input_div {
          width: 7.7rem;
          box-sizing: border-box;
          display: flex;
          >div {
            width: 4rem;
          }
          >input {
            width: 3.7rem;
            box-sizing: border-box;
            padding-left: 5px;
            background-color: transparent;
          }
        }
        .long_input_div {
          width: 10rem;
          box-sizing: border-box;
          display: flex;
          >input {
            width: 6rem;
            box-sizing: border-box;
            padding-left: 5px;
            background-color: transparent;
            padding-left: 5px;
          }
          >div {
            width: 4rem;
          }
        }
      }
      .search_btn {
        width: 6.2rem;
        background-color: #639be8;
        cursor: pointer;
        font-weight: bold;
      }
    }
  }
}

.table_box {
  height: 21.35rem;
  background: rgba(12, 17, 37, 0.25);
  border-radius: 0.3rem;
  padding: 0 1rem 1rem 1rem;
  box-sizing: border-box;
  table {
    width: 100%;
    thead {
      td {
        height: 1.75rem;
        line-height: 1.75rem;
        font-size: 0.75rem;
        color: #fff;
      }
      tr {
        border-bottom: 1px solid #3d556c;
      }
    }
    tbody {
      tr {
        &:nth-child(odd) {
          background: #526f8a;
          td {
            // border-top: 1px solid #3d556c;
            // border-bottom: 1px solid #3d556c;
          }
        }
      }
      td {
        height: 1.9rem;
        line-height: 1.9rem;
        font-size: 0.65rem; // font-weight: lighter;
        color: #fff;
      }
    }
    tr {
      td {
        &:nth-child(1) {
          width: 8.7rem;
        }
        &:nth-child(2) {
          width: 28.3rem;
          .over_div {
            width: 28.3rem;
            .left_div {
              width: 25.2rem;
              height: 1.9rem;
              line-height: 1.9rem;
              box-sizing: border-box; // overflow: hidden;
              display: flex;
              align-items: center;
              text-align: left; // background-color: blue;
              .tip {
                margin-right: 0.3rem; // position: relative;
                // top: 2px;
              }
            }
            .right_div {
              width: 3.1rem;
              height: 1.9rem;
              line-height: 1.9rem;
              box-sizing: border-box;
              position: relative; // background-color: yellow;
              .more_tip {
                position: absolute;
                top: 50%;
                right: 0.5rem;
                transform: translateY(-50%);
                width: 2.1rem;
                height: 1rem;
                line-height: 1rem;
                text-align: center;
                background-color: #acb0bc;
                border-radius: 0.5rem;
                color: white;
                user-select: none;
                cursor: pointer;
                overflow: visible;
                &:hover {
                  .more_tip_box {
                    display: block;
                  }
                }
                .more_tip_box {
                  width: 14rem; // max-height: 12.8rem;
                  box-sizing: border-box; // padding: 1rem 0.5rem 0.6rem;
                  border-radius: 0.2rem;
                  position: absolute;
                  right: -14rem;
                  top: -1.3rem; // background-color: red;
                  display: none;
                  cursor: default;

                  .triangle-left {
                    border-top: 0.3rem solid transparent;
                    border-right: 0.6rem solid rgba(0, 0, 0, 0.5);
                    border-bottom: 0.3rem solid transparent;
                    top: 1.5rem;
                    left: -0.5rem;
                    position: absolute;
                  }
                  .tip_box {
                    width: 14rem;
                    border-radius: 0.2rem;
                    max-height: 12.8rem;
                    box-sizing: border-box;
                    padding: 1rem 0.5rem 0.6rem;
                    background-color: rgba(0, 0, 0, 0.5);
                    overflow-y: auto;
                  }
                  .sub_tip {
                    margin-bottom: 0.4rem;
                    &:nth-child(even) {
                      margin-left: 0.95rem;
                    }
                  }
                }
              }
            }
          }
        }
        &:nth-child(3) {
          width: 8.5rem;
          .spans {
            color: #76a1e3;
            margin-right: 0.5rem;
          }
          .errors {
            color: #f57174;
          }
        }
        &:nth-child(4) {
          width:9.2rem;
        }
        &:nth-child(5) {
          width: 4.5rem;
        }
      }
    }
  }
}

</style>
