<template>
   <!-- <div v-show="show" class="charts" ref="chart">
  </div>  -->
   <div class="charts" ref="chart">
  </div> 
</template>

<script>
  // 图表组件
  import echarts from 'echarts'
  export default {
    name: 'charts',
    props: {
      option: { //配置
        type: Object,
        default: function() {
          return {
            title: {
              text: 'ECharts 入门示例'
            },
            tooltip: {},
            xAxis: {
              data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            },
            yAxis: {},
            series: [{
              name: '销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            }]
          }
        }
      },
      // show:{
      //   type:Boolean,
      //   default:false
      // }
    },
    data() {
      return {
        name: 'chart',
        myChart:{},
        chartoption: {}
      }
    },
    watch: { //嵌套过深的对象无法监听除非深度监听 耗性能不推荐 不知是否是存在数组的问题 最好发新的整个对象过来
      option: function(value) {
        //监听option配置
        this.chartreload(value)
        this.myChart.resize();
      },
      show:function(val){
        // console.log(val)
        //显示时重置大小免得大小有问题
        this.myChart.resize();
      }
    },
    methods: {
      chartreload: function(option) {
        //重新加载图表
        
        this.myChart.setOption(option);
        this.myChart.resize();
      }
    },
    // computed:{
    //     chartoption:function(){
    //     return this.option
    //     }
    // },
    mounted() {
      //组件挂载后
      //  console.log('echarts',echarts)
       this.myChart = echarts.init(this.$refs.chart);
    },
    updated() {
      //数据更新后
      //  console.log(this.option)

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .charts {
    width: 100%;
    height: 100%;

  }
</style>
