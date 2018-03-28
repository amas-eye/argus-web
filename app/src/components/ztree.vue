<style lang="scss">
.ztree_box {
  .treeUl {
    padding-left: 0.6rem; // min-height: 5rem;
  }
  .math_btn_box {
    width: 0.6rem;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .math_btn {
    width: 0.6rem;
    height: 0.6rem;
    line-height: 0.6rem;
    cursor: pointer;
    background-color: #66aafb;
    color: #407587;
    border-radius: 0;
  }

  .level_box {
    .li_content_box {
      // border-bottom: 1px solid #6a99b7;
      position: relative;
      .bar_container {
        display: flex;

        .left_div {
          flex-grow: 1;
          height: 1.7rem;
          line-height: 1.7rem;
          display: flex;
          align-items: center;
          >p {
            margin-left: 0.7rem;
            color: white;
            font-size: 0.7rem;
          }
        }
        .right_div {
          width: 43rem;
          flex-shrink: 0;
          height: 1.7rem; // line-height: 1.7rem;
          display: flex;
          align-items: center;
          .bar {
            height: 0.7rem;
            width: 42rem;
            border-radius: 0.35rem;
            background-color: red;
            cursor: pointer;
            font-size: 0.6rem;
            text-align: right;
            box-sizing: border-box;
            padding-right: 0.2rem;
            user-select: none;
            color: #4f4f52;
          }
        }
      }
      .content_detail {
        display: flex;
        .left_div {
          flex-grow: 1;
          box-sizing: border-box;
          padding-left: 1.3rem; // background-color: gray;
          // height: 10rem;
          text-align: left;
          color: white;
          .text {
            height: 1rem;
            line-height: 1rem;
            font-size: 0.6rem;
            font-weight: bold;
          }
        }
        .right_div {
          width: 43rem;
          padding-bottom: 1.6rem;
          flex-shrink: 0; // background-color: yellow;
          // height: 10rem;
          text-align: left;
          font-size: 0.6rem;
          color: white;
          .left_title {
            font-weight: bold;
          }
          .right_conent {
            color: #dddee3;
            margin-left: 0.3rem;
          }
          .title {
            font-weight: bold;
            font-size: 0.7rem;
            height: 1rem;
            line-height: 1rem;
          }
          .service_box {
            margin-top: 0.1rem;
            border-bottom: 1px solid #303f56;
            display: flex;
            box-sizing: border-box;
            margin-right: 0.4rem;
            >div {
              height: 1.2rem;
              line-height: 1.2rem;
              margin-right: 0.8rem;
              >span {
                font-size: 0.6rem;
              }
            }
          }
          .tags,
          .process {
            margin-top: 0.2rem;
            display: flex;
            .left_title {
              height: 0.9rem;
              line-height: 0.9rem;
              display: flex;
              align-items: center;
              .math_btn {
                position: relative;
                top: -0.05rem;
              }

            }

            .right_conent {
              flex-grow:1;
              ul {
                height: 0.9rem;
                overflow: hidden;
                li {
                  line-height: 0.9rem;
                }
              }

              .ulShow {
              height: auto;
              overflow: visible;
              }
            }
          }
        }
      }
      .line {
        position: absolute;
        bottom: 0;
        left: -10rem;
        right: 0;
        height: 1px;
        background-color: #6a99b7;
      }
    }
  }
}

</style>
<template>
  <div class="ztree_box">
    <ul class="treeUl">
      <ztree-item v-for='(m,i) in treeDataSource' :parentLeft="0" :parentValue="firstValue" :key='i' :model="m" :duration="m.duration" :start_time="m.start_time"></ztree-item>
    </ul>
  </div>
</template>
<script>
import http from 'service/myhttp'
import simdate from 'service/simdate'
export default {
  name: 'ztree',
  props: {
    list: {
      type: Array,
      default: function() {
        return [];
      }
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      msg: '登录',
      treeDataSource: [],
    }
  },
  methods: {
    initTreeData() {
      var tempList = JSON.parse(JSON.stringify(this.list));
      var _this = this;

      // 递归操作，增加删除一些属性。比如: 展开/收起
      var recurrenceFunc = (data) => {
        data.forEach((m, index) => {



          m.children_info = m.children_info || [];



          if (!m.hasOwnProperty("isExpand")) {
            m.isExpand = m.hasOwnProperty("open") ? m.open : this.isOpen;
          }
          if (!m.hasOwnProperty("isContentExpand")) {
            m.isContentExpand = false;
          }
          if (!m.hasOwnProperty("tagsExpand")) {
            m.tagsExpand = false;
          }
          if (!m.hasOwnProperty("processExpand")) {
            m.processExpand = false;
          }


          recurrenceFunc(m.children_info);


        })
      };

      recurrenceFunc(tempList);
      //console.log('tempList', tempList)
      this.treeDataSource = tempList;
    },

    frontLeft: function(arr) {
      var leftNum = 0;
      arr.forEach(function(val, index) {
        leftNum += val.value;
      })
      //console.log('leftNum/1000', leftNum / 1000);
      return leftNum / 1000;
    },

  },
  mounted() {
    this.initTreeData();
  },
  watch: {
    'list': {
      handler: function() {
        this.initTreeData();
      },
      deep: true
    },
  },
  computed:{
    firstValue:function(){
      if (this.list && this.list.length > 0) {
        //console.log('this.list[0].value',this.list[0].value)
        return this.list[0].duration;
      }else {
        return 0;
      }
    }
  },
  components: {
    ztreeItem: {
      name: 'ztreeItem',
      props: {
        model: {
          type: Object,
          default: function() {
            return {}
          }
        },
        parentLeft: {
          type: Number,
          default: 0
        },
        parentValue: {
          type: Number,
          default: 0
        },
        duration:{
          type: Number,
          default: 0
        },
        start_time:{
          type: Number,
          default: 0
        },
      },
      methods: {
        open: function() {
          this.model.isExpand = !this.model.isExpand;
        },
        frontLeft: function(arr) {
          var leftNum = 0;
          arr.forEach(function(val, index) {
            leftNum += val.duration;
          })
          //console.log('leftNum/1000', this.parentValue);
          return leftNum / this.parentValue;
        },
        leftValue: function(m, i, arr) {
          var a = this.frontLeft(arr);
          //console.log('a', a);
          return this.parentLeft + a;
          //,'marginLeft':parentLeft * 42 + 'rem'
        },
        timeFun:function(str){ //时间戳转换
          str += ''
          return simdate.TMDTime(new Date(parseInt(str.slice(0,13))));
        },
        decodeUnicode: function (str) {
          str = str.replace(/\\/g, "%");
          return unescape(str);
        },
        tagValue:function(val2){
          if (val2.value) {
            return val2.value;
          }else if (val2.vNum) {
            return val2.vNum;
          }else if (val2.vStr) {
            return val2.vStr;
          }else if (val2.vLong) {
            return val2.vLong;
          }else if (val2.vDouble) {
            return val2.vDouble;
          }else if (val2.vBool) {
            return val2.vBool;
          }else{
            return ''
          }
        }

      },
      computed: {
        processArr:function(){
          var arr = [];
          this.model.logs.forEach(function(val){
            if (val.fields) {
              arr = arr.concat(val.fields);
            }
          })
          return arr;
        }
      },
      template: `<li class="level_box">
        <div class="li_content_box">
          <div class="bar_container">
            <div class="left_div">
              <div class="math_btn_box">
                <button class="math_btn" @click='open' v-show="model.children_info && model.children_info.length > 0" >{{model.isExpand ? '－' : '＋'}}</button>
              </div>
              <p>{{model.operation_name}}</p>
            </div>
            <div class="right_div">
              <div class="bar" :style="{'width':model.duration/parentValue * 42 + 'rem','marginLeft':(model.start_time - start_time) / 1000 / duration * 42 + 'rem',backgroundColor:model.color}"  @click='model.isContentExpand = !model.isContentExpand'>{{model.duration}}MS</div>
            </div>
          </div>
          <div class="content_detail" v-if="model.isContentExpand">
            <div class="left_div">

            </div>
            <div class="right_div">
              <p class="title">{{model.operation_name}}</p>
              <div class="service_box">
                <div class="service">
                  <span class="left_title">SERVICE:</span>
                  <span class="right_conent">{{model.service}}</span>
                </div>
                <div class="dutation">
                  <span class="left_title">DUTATION:</span>
                  <span class="right_conent">{{model.duration}}MS</span>
                </div>
                <div class="time">
                  <span class="left_title">START TIME:</span>
                  <span class="right_conent">{{timeFun(model.start_time)}}</span>
                </div>
              </div>
              <div class="tags">
                <div class="left_title">
                <button style="margin-right:0.4rem;" class="math_btn" @click='model.tagsExpand = !model.tagsExpand' v-show="model.tags && model.tags.length > 0" >{{model.tagsExpand ? '－' : '＋'}}</button>
                <span>TAGS:</span>
                </div>
                <div class="right_conent">
                  <ul :class="{'ulShow':model.tagsExpand}" v-show="model.tags && model.tags.length > 0">
                    <li v-for="(val2,index) in model.tags">
                      <span style="margin-right:1rem">{{val2.key}}</span>
                      <span>{{tagValue(val2)}}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="process">
               <div class="left_title">
                <button style="margin-right:0.4rem;" class="math_btn" @click='model.processExpand = !model.processExpand' v-show="processArr && processArr.length > 0" >{{model.processExpand ? '－' : '＋'}}</button>
                <span>PROCESS:</span>
               </div>
               <div class="right_conent">
                  <ul :class="{'ulShow':model.processExpand}" v-show="processArr && processArr.length > 0">
                    <li v-for="(val2,index) in processArr" >
                      <span style="margin-right:1rem">{{val2.key}}</span>
                      <span>{{decodeUnicode(tagValue(val2))}}</span>
                    </li>
                  </ul>
               </div>
              </div>
            </div>
          </div>
          <div class="line"></div>
        </div>
          <ul v-if="model.isExpand" class="treeUl">
            <ztree-item v-for="(item,i) in model.children_info" :parentValue="parentValue" :parentLeft="leftValue(item,i,model.children_info.slice(0,i))" :key='i' :model="item" :duration="duration" :start_time="start_time"></ztree-item>
          </ul>
        </li>`
    }
  },

}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
