<template>
  <!-- 总体概况 -->
  <div class="survey">
    <div class="title">
      基本指标概况
    </div>
    <div class="charts">
      <div class="chart chart25">
        <!-- 总体监控度评分 -->
        <div class="head left">健康度</div>
        <charts style="height: 10.55rem" :option="a"></charts>
      </div>
      <div class="chart chart25">
        <!-- 主机信息总体 -->
        <div class="head left">主机</div>
        <div class="host_sum"><span style="margin-right: 0.5rem;">{{bdata.hosts}}</span></div>
        <charts style="height: 10.55rem" :option="b"></charts>
      </div>
      <div class="chart chart25">
        <!-- 告警信息总体 -->
        <div class="head left">告警</div>
        <div class="ztgj">
          <div class="date">
            <div class="item" @click="alertClick({level:'',is_recover:'false'})">{{cdata.alerts||0}}<span
              style="font-size:0.7rem;">条</span></div>
            <div class="item" @click="alertClick({level:'critical',is_recover:'false'})">{{cdata.alert_critical||0}}<span
              style="font-size:0.7rem;">条</span></div>
            <div class="item" @click="alertClick({level:'minor',is_recover:'false'})">{{cdata.alert_minor||0}}<span
              style="font-size:0.7rem;">条</span></div>
          </div>
          <div class="datename">
            <div class="item">现有告警</div>
            <div class="item">严重告警</div>
            <div class="item">一般告警</div>
          </div>
          <img class="bg" src="../img/ztgj.png"/>
        </div>
      </div>
      <div class="chart chart25">
        <!-- 指标信息 -->
        <div class="head left">指标</div>
        <div class="indicator">
          <!-- 指标 -->
          <div class="count">{{ this.ddata.metrics }}<span class="unit">个</span></div>
          <div class="label">
            <span class="name">正常</span>
            <div class="processbg">
              <div :style="{width:this.ddata.normal/this.ddata.metrics*100+'%'}" style="background: #03eeff;"
                   class="process"></div>
            </div>
            <span class="count">{{ this.ddata.normal }}</span>
          </div>
          <div class="label">
            <span class="name">异常</span>
            <div class="processbg">
              <div :style="{width:this.ddata.error/this.ddata.metrics*100+'%'}" style="background: #ff839a;"
                   class="process"></div>
            </div>
            <span class="count">{{ this.ddata.error }}</span>
          </div>
        </div>
      </div>
      <div class="chart chart100">
        <!-- 告警趋势 -->
        <div class="head center">24小时告警趋势</div>
        <charts style="height: 12.7rem" :option="e"></charts>
      </div>
      <div class="chart chart50">
        <!-- 基础资源使用量 -->
        <div class="head center">基础资源使用量</div>
        <div class="resourceUse">
          <charts style="width:33.33%;height: 14.35rem;float:left;" v-for="item in g" :option="item"></charts>
        </div>
      </div>
      <div class="chart chart50 userat">
        <!-- 利用率top5 -->
        <div class="head center">利用率 Top5 统计</div>
        <div class="tabs">
          <div v-for="item in useRatRankTypes" :key="item.label"
               :style="{color:(useRatRankType==item.label?item.color.use:'')}" @click="useRatRankType=item.label"
               :class="{active:useRatRankType==item.label}" class="tab clickable">
            {{item.label}}
          </div>
        </div>
        <!-- useRatRankType==item.label -->
        <div v-show="useRatRankType==item.label" :key="item.label" v-for="item in useRatRankTypes" class="rank ">
          <!-- 指标 -->
          <div :key="data.host" v-for="data in fdata[getTopType(item.label)]" class="label">
            <span class="name">{{ data.host }}</span>
            <el-tooltip class="item" effect="dark" :content="data.host+':'+data.usageprint" placement="top-start">
              <div class="processbg">
                <div :style="{background:(useRatRankType==item.label?item.color.use:''),width:''+data.per+'%'}"
                     class="process"></div>
              </div>
            </el-tooltip>
          </div>
          <div v-if="fdata[getTopType(item.label)] && fdata[getTopType(item.label)]">
            <div v-for="data in (5 - fdata[getTopType(item.label)].length)" class="label">
              <span class="name">{{'--'}}</span>
              <div class="processbg">
                <div class="process"></div>
              </div>
            </div>
          </div>

          <div class="scales">
            <span class="item" :key="scale" v-for="scale in useRatScales">{{scale}}</span>
          </div>
        </div>
      </div>

      <div class="chart chart50">
        <!-- 网络流入流出趋势 -->
        <div class="head center">网络流入流出趋势</div>
        <charts style="height: 14.35rem;" :option="h"></charts>
      </div>
      <div class="chart chart50 flow">
        <!-- 网络流入流出top5统计 -->
        <div class="head center">网络流入流出 top5 统计</div>
        <div class="tabs">
          <div v-for="item in flowTypes" :key="item.label" @click="flowType=item.label"
               :style="{color:flowType==item.label?item.color:''}" :class="{active:flowType==item.label}"
               class="tab clickable">
            {{item.label}}
          </div>
        </div>
        <div v-show="flowType==item.label" :key="item.label" v-for="item in flowTypes" class="rank ">
          <!-- 指标 -->
          <div :key="data.host" v-for="data in ydata[getTopType(item.label)]" class="label">
            <span class="name">{{data.host}}</span>
            <el-tooltip class="item" effect="dark" :content="data.host+':'+data.usageprint" placement="top-start">
              <div class="processbg">
                <div :style="{background:flowType==item.label?item.color:'',width:''+data.per+'%'}"
                     class="process"></div>
              </div>
            </el-tooltip>
          </div>

          <div v-if="getTopType(item.label) && ydata[getTopType(item.label)]">
            <div v-for="val in (5 - ydata[getTopType(item.label)].length)" class="label">
              <span class="name">{{'--'}}</span>
              <div class="processbg">
                <div class="process"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="title">
      自定义指标
    </div>
    <div class="charts">
      <div :key="item._id" v-for="(item,index) in mycharts" class="chart chart50">
        <div class="head center">{{item.chart.title}}<span @click="remove_mychart(item.chart,index)"
                                                           class="close clickable" title="删除">x</span></div>
        <jkchart :option="item.chart" :date="getMyChartTime(item.datatime_config)" style="height: 14.35rem;"></jkchart>
      </div>
      <div class="chart chart100 generalContent" v-for="(val,index) in chartListFilterTable" style="padding-bottom: 0.5rem;">
        <div class="head center">{{chartListTable[index] && chartListTable[index].chart ? chartListTable[index].chart.title : ''}}<span @click="remove_myTablechart(chartListTable[index].chart,index)"
                                                           class="close clickable" title="删除">x</span></div>
        <table border="0" cellspacing="0" cellpadding="0">
          <thead>
          <tr>
            <td>指标名</td>
            <td>主机</td>
            <td>最新数值</td>
            <td>是否告警</td>
            <td>更新时间</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(val2,index2) in val">
            <td colspan="5" style="border: none;">
              <table>
                <tbody>
                <tr v-for="(val3,index3) in val2.host_value">
                  <td :rowspan="val2.host_value.length" v-if="index3 === 0">{{val2.metric}}</td>
                  <td>{{val3.host}}</td>
                  <td :style="{color:(val2.alert_status === 'ok' ? 'red' :'#fff')}">{{val3.value}}</td>
                  <td :rowspan="val2.host_value.length" v-if="index3 === 0">{{val2.alert_status === 'ok' ? '是' : '否'}}</td>
                  <td>{{simdate.TMDTime(val3.last_timestamp)}}</td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>
<script>
  import http from 'service/myhttp'
  import urls from 'service/url'
  import pageIndicator from 'components/pageIndicator' //分页器
  import moment from 'moment'
  import simdate from 'service/simdate'
  import charts from 'components/charts' //图表组件
  import jkchart from 'components/jkcharts' //监控图表组件
  export default {
    name: 'survey',
    components: {
      pageIndicator,
      charts,
      jkchart
    },
    data() {
      return {
        simdate:simdate,
        useRatMax: 100, //利用率最大值
        topMax: {}, //排名最大值
        useRatRankType: 'CPU', //利用率排名类型
        useRatRankTypes: [ //利用率排名类型数组
          {
            label: 'CPU',
            color: {
              use: '#03eeff',
              sum: '#659dbf'
            }
          },
          {
            label: '内 存',
            color: {
              use: '#f4dca6',
              sum: '#9f9b92'
            }
          },
          {
            label: '硬 盘',
            color: {
              use: '#feb9d5',
              sum: '#a290b2'
            }
          }
        ],
        flowType: '流 入',
        flowTypes: [ //流量类型数组
          {
            label: '流 入',
            color: '#625fc7'
          },
          {
            label: '流 出',
            color: '#12cfd1',
          }
        ],
        adata: {} //总体监控度评分
        ,
        bdata: { //主机信息总体
        },
        cdata: { //告警信息总体
        },
        ddata: { //指标信息
        },
        edata: [] //告警趋势
        ,
        fdata: { //利用率top5
        },
        gdata: null, //基础资源使用量 ,
        hdata: {
          indata: [],
          outdata: []
        }, //网络流入流出趋势
        ydata: { //络流入流出top5统计
        },
        mycharts: [], //所有自定义概况图表
        chartListTable:[],//图表（配置）表格
        chartListFilterTable:[],//图表（配置）表格
      }
    },
    computed: {
      useRatScales: function () {
        //利用率
        let scaleCount = 10 //刻度数
        let size = parseInt(this.useRatMax / scaleCount) //单位刻度大小
        let data = []
        for (let i = 0; i < scaleCount + 1; i++) {
          data.push(i * size)
        }
        // console.log(data)
        return data
      },
      a: function (params) { //总体监控度评分
        return {
          tooltip: {
            formatter: "{a} <br/>{b} : {c}分"
          },
          series: [{
            title: {
              show: false,
              textStyle: {
                fontWeight: 'bolder',
                fontSize: 20,
                color: '#fff',
                shadowColor: '#fff',
                shadowBlur: 10
              }
            },
            name: '健康度',
            type: 'gauge', //仪表盘
            center: ['50%', '50%'],
            radius: '90%',
            startAngle: 210,
            endAngle: -30,
            axisLine: { // 坐标轴线
              lineStyle: { // 属性lineStyle控制线条样式
                color: [
                  [0.2, '#d03a53'],
                  [0.8, '#0373c6'],
                  [1, '#04ff8b']
                ],
                width: 3,
                // shadowColor: '#fff', //默认透明
                // shadowBlur: 10
              }
            },
            axisLabel: { // 坐标轴小标记
              show: false,
              textStyle: { // 属性lineStyle控制线条样式
                fontWeight: 'bolder',
                color: '#fff',
                // shadowColor: '#fff', //默认透明
                // shadowBlur: 10
              }
            },
            axisTick: { // 坐标轴小标记
              length: 15, // 属性length控制线长
              splitNumber: 10,
              lineStyle: { // 属性lineStyle控制线条样式
                color: 'auto',
                // shadowColor: '#fff', //默认透明
                // shadowBlur: 10
              }
            },
            splitLine: { // 分隔线
              length: 25, // 属性length控制线长
              lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                width: 3,
                color: '#fff',
                // shadowColor: '#fff', //默认透明
                // shadowBlur: 10
              }
            },
            pointer: {
              show: true,
              length: '80%',
              width: 8,
            },
            itemStyle: {
              normal: {
                color: '#fff',
                borderColor: '#fff',
                borderWidth: 0,
                borderType: 'solid',
              }
            },
            detail: {
              show: true,
              borderColor: '#fff',
              shadowColor: '#fff',
              textStyle: {
                fontWeight: 'bolder',
                color: '#fff'
              },
              formatter: '\n{value}分'
            },
            data: [{
              value: this.adata.score,
              name: '健康度'
            }]
          }]
        }
      },
      b: function (params) { //主机
        return {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            // x: 'center',
            // y: 'bottom',
            // align:'right',
            right: '4%',
            bottom: '4%',
            textStyle: {
              color: '#fff',
              fontSize: '14',
            },
            formatter: function (name) {
              return name
            },
            data: ['正常', '异常', '关闭']
          },
          // graphic: {
          //     type: 'text',
          //     left: 0,
          //     top: 0,
          //     bounding:'raw',
          //     style: {
          //         // x:0,
          //         // y:0,
          //         text: this.bdata.hosts,
          //         fill: '#fff',
          //         font: '3.5em "STHeiti", sans-serif',
          //         textAlign: 'center',
          //         textVerticalAlign:'middle'
          //     }
          // },
          series: [{
            name: '访问来源',
            type: 'pie',
            center: ['47%', '45%'],
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'outside',
                formatter: '{c}台',
              },
              emphasis: {
                show: true,
                // borderRadiu:100,
                textStyle: {
                  fontSize: '18',
                  color: '#fff',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false,
                length: 9,
                length2: 9,
              }
            },
            data: [{
              value: this.bdata.hosts_normal,
              name: '正常',
              itemStyle: {
                normal: {
                  color: '#03eeff'
                }
              },
            },
              {
                value: this.bdata.hosts_error,
                name: '异常',
                itemStyle: {
                  normal: {
                    color: '#e68494'
                  }
                }
              },
              {
                value: this.bdata.hosts_closed,
                name: '关闭',
                itemStyle: {
                  normal: {
                    color: '#d6e2ed'
                  }
                }
              }
            ]
          }]
        }
      },
      c: function () { //告警信息总体
        return {}
      },
      d: function () { //指标信息
        return {}
      },
      e: function () { //告警趋势
        return {
          //近一小时客流趋势chart图配置
          title: { //图表标题
            // text: '近一小时客流趋势',
            // subtext: "客流量(人)",
            textStyle: {
              fontFamily: '微软雅黑',
              fontWeight: 'normal', //标题颜色
              fontSize: 17,
              color: '#73C5FA'
            },
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            // x: 'center',
            // y: 'bottom',
            // top: '70%',
            textStyle: {
              color: '#fff',
              fontSize: '14'
            },
            data: ['现有告警', '严重告警', '一般告警']
          },
          grid: { //图表在div的布局控制
            top: '15%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: { //X轴样式
            type: 'time',
            boundaryGap: false,
            axisLine: {
              show: false
            },
            axisTick: false,
            axisLabel: {
              rotate: 0,
              textStyle: {
                color: "#ffffff",
                align: "bottom",
              }
            },
            splitLine: {
              show: false
            },
          },
          yAxis: { //Y轴样式
            type: 'value',
            // name:'233',
            //nameLocation:'start',
            nameGap: '0',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              rotate: 0,
              textStyle: {
                color: "#ffffff",
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#EAEEF7',
              }
            },
          },
          series: [ //图表数据样式
            {
              type: 'line',
              stack: '总量1',
              symbolSize: 6,
              name: "现有告警",
              smooth: true,
              lineStyle: {
                normal: {
                  color: 'red',
                  width: 2,
                }
              },
              itemStyle: {
                normal: {
                  color: "red",
                  borderColor: "#f6f903",
                }
              },
              areaStyle: {
                normal: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0,
                      color: 'rgba(220,153,8,1)' // 0% 处的颜色
                    },
                      {
                        offset: 1,
                        color: 'rgba(220,153,8,0)' // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  }
                },
              },
              data: this.edata.alert_produce
            },
            {
              type: 'line',
              stack: '总量2',
              symbolSize: 6,
              name: "严重告警",
              smooth: true,
              lineStyle: {
                normal: {
                  color: '#03eeff',
                  width: 2,
                }
              },
              itemStyle: {
                normal: {
                  color: "#03eeff",
                  borderColor: "#f6f903",
                }
              },
              areaStyle: {
                normal: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0,
                      color: 'rgba(220,153,8,1)' // 0% 处的颜色
                    },
                      {
                        offset: 1,
                        color: 'rgba(220,153,8,0)' // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  }
                },
              },
              data: this.edata.critical_alert
            },
            {
              type: 'line',
              stack: '总量3',
              symbolSize: 6,
              name: "一般告警",
              smooth: true,
              lineStyle: {
                normal: {
                  color: '#f6f903',
                  width: 2,
                }
              },
              itemStyle: {
                normal: {
                  color: "#f6f903",
                  borderColor: "#f6f903",
                }
              },
              areaStyle: {
                normal: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0,
                      color: 'rgba(220,153,8,1)' // 0% 处的颜色
                    },
                      {
                        offset: 1,
                        color: 'rgba(220,153,8,0)' // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  }
                },
              },
              data: this.edata.minor_alert
            }
          ]
        }
      },
      f: function () { //利用率top5
        return {}
      },
      g: function () { //基础资源使用量
        let datarry = []
        let textt = '123';
        // console.info('数据', this.gdata)
        if (this.gdata) {
          //有数据时
          this.useRatRankTypes.forEach((item,index) => {
            let middleText = ''
            let usage = (this.gdata[this.getBaseType(item.label)].usage * 100).toFixed(0) //使用率  。。百分比

            let usingval = this.gdata[this.getBaseType(item.label)].using //使用值  。。。使用值

            let all = this.gdata[this.getBaseType(item.label)].all //总量 。。。总数

            if (item.label == "CPU") {
              // cpu是使用率
              middleText = "CPU\n" + usage + "%"

              //middleText = "CPU\n" + parseInt(usingval/all * 100)  + "%"
              usingval = usage
              //textt = usage;
            } else if (item.label == "内 存") {
              middleText = "内存\n" + usage + "%"

              // 转换单位 G 并精确小数
              usingval = (usingval / 1024 / 1024 / 1024).toFixed(2)
              all = (all / 1024 / 1024 / 1024).toFixed(2)
              //middleText = "内存\n" + parseInt(usingval/all * 100) + "%"
            } else if (item.label == "硬 盘") {
              middleText = "硬盘\n" + usage + "%"

              usingval = (usingval / 1024 / 1024 / 1024).toFixed(2)
              all = (all / 1024 / 1024 / 1024).toFixed(2)
              //middleText = "硬盘\n" + parseInt(usingval/all * 100) + "%"
            }
            //console.log('usingval', usingval);
            datarry.push({
              tooltip: {
                show: false,
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                x: 'center',
                y: 'bottom',
                top: '80%',
                textStyle: {
                  color: '#fff',
                  fontSize: '14'
                },
                formatter: function (name, vaule) {
                  return name
                },
                data: [(item.label == 'CPU' ? '使用率: ' : '使用量: ') + usingval  + (item.label == 'CPU' ? '%' : 'G'), '总 量: ' + all + (item.label == 'CPU' ? '核' : 'G')]
              },
              graphic: {
                type: 'text',
                left: '40%',
                top: '33%',
                style: {
                  text: middleText,
                  fill: item.color.use,
                  font: '24px "STHeiti", sans-serif'
                }
              },

              series: [{
                name: item.label,
                type: 'pie',
                center: ['50%', '40%'],
                radius: ['60%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center',
                    // formatter: '{b}\n{d}',
                    //  textStyle: {
                    //     fontSize: '18',
                    //     fontWeight: 'bold'
                    // }
                  },
                  emphasis: {
                    // show: false,
                    // position: 'center',
                    // formatter: '{b}\n{d}%',
                    // textStyle: {
                    //     fontSize: '18',
                    //     fontWeight: 'bold'
                    // }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [{
                  value:  item.label == 'CPU' ? usingval/100*all : usingval,
                  name: (item.label == 'CPU' ? '使用率: ' : '使用量: ') + usingval + (item.label == 'CPU' ? '%' : 'G'),
                  itemStyle: {
                    normal: {
                      color: item.color.use
                    }
                  }
                },
                  {
                    value: (item.label == 'CPU' ? all - usingval/100*all : all - usingval),
                    name: '总 量: ' + all + (item.label == 'CPU' ? '核' : 'G'),
                    itemStyle: {
                      normal: {
                        color: item.color.sum
                      }
                    }
                  }
                ]
              }]
            })
          })
        }
        return datarry
      },
      h: function () { //网络流入流出趋势
        let indata = []
        let outdata = []
        indata = this.hdata.indata
        outdata = this.hdata.outdata
        return {
          //近一小时客流趋势chart图配置
          title: { //图表标题
            // text: '近一小时客流趋势',
            // subtext: "客流量(人)",
            textStyle: {
              fontFamily: '微软雅黑',
              fontWeight: 'normal', //标题颜色
              fontSize: 17,
              color: '#73C5FA'
            },
          },
          legend: {
            // x: 'center',
            // y: 'bottom',
            // top: '70%',
            textStyle: {
              color: '#fff',
              fontSize: '14'
            },
            data: ['流出', '流入']
          },
          tooltip: {
            trigger: 'axis',
          },
          grid: { //图表在div的布局控制
            top: '15%',
            left: '3%',
            right: '8%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{ //X轴样式
            type: 'time',
            boundaryGap: true,
            axisLine: {
              show: false
            },
            axisTick: false,
            axisLabel: {
              rotate: 0,
              align: 'left',
              textStyle: {
                color: "#ffffff",
                align: "bottom",
              }
            },
            splitLine: {
              show: false
            },
            // data: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00']
          }],
          yAxis: [{ //Y轴样式
            type: 'value',
            // name:'233',
            //nameLocation:'start',
            nameGap: '0',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              rotate: 0,
              textStyle: {
                color: "#ffffff",
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#EAEEF7',
              }
            },
          }],
          series: [{ //图表数据样式
            type: 'line',
            stack: '流出',
            symbolSize: 6,
            name: "流出",
            smooth: true,
            z: 2,
            lineStyle: {
              normal: {
                color: '#128fae',
                width: 2,
              }
            },
            itemStyle: {
              normal: {
                color: "#128fae",
                borderColor: "#f5fcfd",
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(3,237,255,0.4)' // 0% 处的颜色
                  },
                    {
                      offset: 1,
                      color: 'rgba(3,237,255,0)' // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              },
            },
            data: outdata
          }, { //图表数据样式
            type: 'line',
            stack: '流入',
            symbolSize: 6,
            name: "流入",
            smooth: true,
            z: 1,
            lineStyle: {
              normal: {
                color: '#1107c9',
                width: 2,
              }
            },
            itemStyle: {
              normal: {
                color: "#1107c9",
                borderColor: "#1107c9",
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(58,24,233,0.7)' // 0% 处的颜色
                  },
                    {
                      offset: 1,
                      color: 'rgba(58,24,233,0)' // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              },
            },
            data: indata
          }]
        }
      },
      y: function () { //络流入流出top5统计
        return {}
      }
    },
    watch: {},
    methods: {
      alertClick: function (obj) {
        //{level:'',is_recover:false}
        this.$router.push({path: '/navBar/warning/', query: {level: obj.level,is_recover:obj.is_recover,tabslc: '告警记录'}})
      },
      getMyChartTime: function (option) {
        //获取自定义图表时间配置
        let start
        let end
        let dataoption
        let dateTimeString = option.datetext
        if (dateTimeString.indexOf('最新') != -1) {
          //检索显示字符串（如果是快捷定义）
          start = this.getQDTime(dateTimeString)
          end = simdate.todayTime()
          dataoption = {
            start: start,
            end: end,
          }
          //console.info('时间选择', dataoption)
        } else {
          start = option.start
          end = option.end
          dataoption = {
            start: start,
            end: end,
          }
        }
        return dataoption
      },
      getQDTime: function (dateTimeString) {
        //获取快捷定义时间范围的时间
        let starttime
        switch (dateTimeString) {
          case '最新5分钟':
            starttime = simdate.min5_ago()
            break;
          case '最新10分钟':
            starttime = simdate.min10_ago()
            break;
          case '最新30分钟':
            starttime = simdate.min30_ago()
            break;
          case '最新1小时':
            starttime = simdate.hour1_ago()
            break;
          case '最新6小时':
            starttime = simdate.hour6_ago()
            break;
          case '最新12小时':
            starttime = simdate.hour12_ago()
            break;
          case '最新1天':
            starttime = simdate.day1_ago()
            break;
          case '最新7天':
            starttime = simdate.day7_ago()
            break;
          case '最新15天':
            starttime = simdate.day15_ago()
            break;
          default:
            starttime = simdate.min5_ago()
            break;
        }
        return starttime
      },
      getTopType: function (value) {
        //获取排名类型
        // console.log(value)
        switch (value) {
          case 'CPU':
            return 'cpu_topN'
            break;
          case '内 存':
            return 'mem_topN'
            break;
          case '硬 盘':
            return 'disk_topN'
            break;
          case '流 入':
            return 'net_in_topN'
            break;
          case '流 出':
            return 'net_out_topN'
            break;
          default:
            return ''
            break;
        }
      },
      getBaseType: function (value) {
        //获取基础数据类型
        // console.log(value)
        switch (value) {
          case 'CPU':
            return 'cpu'
            break;
          case '内 存':
            return 'mem'
            break;
          case '硬 盘':
            return 'disk'
            break;
          case '流 入':
            return 'net_in'
            break;
          case '流 出':
            return 'net_out'
            break;
          default:
            return ''
            break;
        }
      },
      get_overall_health: function () {
        //获取健康度
        http.get(urls.HQJKD).then(res => {
          let data = res.data
          this.adata = data
          // console.log(this.adata)
        })
      },
      get_host_stat: function () {
        //获取主机信息
        http.get(urls.HQZJXX).then(res => {
          let data = res.data
          this.bdata = data
          // console.log(data)
        })
      },
      get_alert_stat: function () {
        //获取告警统计信息
        http.get(urls.HQGJTJ).then(res => {
          let data = res.data
          this.cdata = data
          // console.log(data)
        })
      },
      get_alert_trend: function () {
        //告警趋势
        // console.info('start_data', simdate.yesterday())
        // console.info('end_data', simdate.today())
        http.get(urls.HQGJQS, {
          start: simdate.TimetoSJC(simdate.yesterday()),
          end: simdate.TimetoSJC(simdate.today())
        }).then(res => {
          let data = res.data
          let alert_produce = [] //产生的告警数
          let critical_alert = [] //严重级别的告警数
          let minor_alert = [] //一般级别的告警数
          data.forEach(item => {
            alert_produce.push([simdate.SJCtoTime(item.start_time), item.period_alert_produce])
            critical_alert.push([simdate.SJCtoTime(item.start_time), item.period_critical_alert])
            minor_alert.push([simdate.SJCtoTime(item.start_time), item.period_minor_alert])
          })
          this.edata = {
            alert_produce: alert_produce,
            critical_alert: critical_alert,
            minor_alert: minor_alert,
          }
          //console.info('告警趋势', this.edata)
        })
      },
      get_metric_stat: function () {
        //获取指标统计信息
        http.get(urls.HQZBTJ).then(res => {
          let data = res.data
          this.ddata = data
          // console.log(data)
        })
      },
      getparsedata: function (data) {
        //获取解析成数组后的数据
        let onedata = []
        for (let key in data) {
          let value = data[key]
          //遍历获取key（时间）value(值)
          //console.info('时间', simdate.TMDTime(moment.unix(key)))
          let dataitem = [simdate.TMDTime(moment.unix(key)), value] //数据项
          onedata.push(dataitem) //填充一个数据组
        }
        //console.log('onedata', onedata);
        return onedata
      },
      get_out_in: function () {
        //获取网络流入流出趋势
        Promise.all([
          http.get(urls.HQJKSJ, {
            start: '24h-ago',
            //m: 'sum:cluster.net.dev.receive'
            m:'avg:1h-sum:cluster.net.dev.receive'
          }),
          http.get(urls.HQJKSJ, {
            start: '24h-ago',
            //m: 'sum:cluster.net.dev.transmit'
            m:'avg:1h-sum:cluster.net.dev.transmit'
          })
        ]).then(res => {
          this.hdata = {
            indata: this.getparsedata(res[0].data[0].dps),
            outdata: this.getparsedata(res[1].data[0].dps)
          }
        }, err => {
        })
      },
      get_sys_resource: function () {
        //获取指所有Top5及基础资源使用量
        http.get(urls.HQSYL).then(res => {
          let data = res.data
          let baseinfo = { //基础资源使用量
            cpu: {
              usage: data.cpu_usage,
              all: data.cpu_all,
              using: data.cpu_using,
            },
            mem: {
              usage: data.mem_usage,
              all: data.mem_all,
              using: data.mem_using,
            },
            disk: {
              usage: data.disk_usage,
              all: data.disk_all,
              using: data.disk_using,
            }
          }
          let yjtop5 = { //硬件使用率排名
            cpu_topN: data.cpu_topN,
            mem_topN: data.mem_topN,
            disk_topN: data.disk_topN,
          }
          let netInOutTop5 = { //网络使用率排名
            net_in_topN: data.net_in_topN,
            net_out_topN: data.net_out_topN,
          }
          let topMax = {
            //排名最大值
            cpu: data.cpu_topN[0],
            mem: data.mem_topN[0],
            disk: data.disk_topN[0],
            net_in: data.net_in_topN[0],
            net_out: data.net_out_topN[0],
          }
          this.fdata = yjtop5
          this.gdata = baseinfo
          this.ydata = netInOutTop5
        })
      },
      get_mycharts: function () {
        //获取自定义指标概览图表
        http.get(urls.HQZDYGLTB).then(res => {
          let data = res.data
          this.mycharts = [];
          this.chartListTable = [];
          data.forEach((item) => {
            if(item.chart.type === '表格') {
              this.chartListTable.push(item);
            }else {
              this.mycharts.push(item);
            }
          })
          this.getTableData();

        })
      },
      getTableFunc:function (par) { //获取表格数据
        return new Promise(function (resolve, reject) {
          http.post(urls.TableData, par).then(res => {
              resolve(res.data)
            },
            err => {
              reject(err)
            }
          )
        });
      },
      getTableData:function () { //获取表格数据
        const promiseArr = [];
        this.chartListTable.forEach((item) => {
          const par = {metrics:[]};
          item.chart.xnzbs.forEach((item2) => {
            if(item2.tag && item2.tag.length > 0){
              item2.tag.forEach((item3) => {
                par.metrics.push({'metric':item2.zbname,'host':item3.value})
              })
            }else {
              par.metrics.push({'metric':item2.zbname,'host':'*'})
            }
          })
          promiseArr.push(this.getTableFunc(par))
        })

        Promise.all(promiseArr).then((values) => {
          this.chartListFilterTable = values;
        })
      },
      remove_mychart: function (chart, mychartindex) {


        //删除图表
        this.$confirm('是否删除该视图?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          //删除自定义指标概览图表
          http.post(urls.SCZDYGLTB, {
            id: chart._id
          }).then(res => {
            let data = res.data
            // console.log(data)
            this.mycharts.splice(mychartindex, 1)
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          });
        });

      },
      remove_myTablechart(chart, mychartindex){


        //删除图表
        this.$confirm('是否删除该视图?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          //删除自定义指标表格概览图表
          http.post(urls.SCZDYGLTB, {
            id: chart._id
          }).then(res => {
            let data = res.data
            this.chartListTable.splice(mychartindex, 1);
            this.chartListFilterTable.splice(mychartindex, 1);
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          });
        });

      },
      init: function () {
        this.get_overall_health()
        this.get_host_stat()
        this.get_alert_stat()
        this.get_metric_stat()
        this.get_alert_trend()
        this.get_sys_resource()
        this.get_out_in()
        this.get_mycharts()
      }
    },
    mounted() {
      //挂载时
      this.init()
    },
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .close {
    position: absolute;
    right: 0.8rem;
  }

  .survey {
  }

  .survey .title {
    text-align: left;
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    color: #41404e;
  }

  .survey .charts {
    display: flex;
    flex-wrap: wrap;
  }

  .charts .chart {
    // height: 12.35rem;
    background: rgba(12, 17, 37, 0.35);
    margin: 0.3rem 0.5%;
    border-radius: 4px;
    position: relative;
  }

  .chart .head {
    color: #fff;
    font-size: 0.9rem;
  }

  .chart .head.left {
    text-align: left;
    padding-left: 0.5rem;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
  }

  .chart .head.center {
    text-align: center;
    min-height: 1rem;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
  }

  .chart25 {
    width: 24%;
  }

  .chart50 {
    width: 49%;
  }

  .chart100 {
    width: 100%;
  }

  /*总体告警*/
  .ztgj {
    padding: 2rem 0rem;
  }

  .ztgj .date {
    font-size: 1.2rem;
    color: #fff;
    float: left;
    /* margin-top: 0.4rem; */
    position: relative;
    top: 0.4rem;
    right: -1rem;
  }

  .ztgj .date .item {
    line-height: 1.6rem;
    cursor: pointer;
  }

  .ztgj .datename {
    font-size: 0.7rem;
    color: #fff;
    position: absolute;
    top: 5.2rem;
    right: 3.5rem;
    text-align: left;
  }

  .ztgj .datename .item {
    line-height: 1.7rem;
  }

  .ztgj .bg {
    width: 10rem;
  }

  /* 指标 */
  .chart .indicator {
  }

  .chart .indicator .count {
    font-size: 2.5rem;
    color: #fff;
    padding: 1.6rem 0rem;
  }

  .chart .indicator .count .unit {
    font-size: 0.9rem;
  }

  .indicator .label {
    padding: 0.2rem 0rem;
  }

  .indicator .label .name {
    font-size: 0.8rem;
    color: #fff;
  }

  .indicator .label .count {
    font-size: 0.8rem;
    color: #fff;
    display: inline-block;
    width: 2rem;
    padding: 0;
  }

  .indicator .label .processbg {
    display: inline-block;
    width: 9.6rem;
    background: #535674;
    height: 0.6rem;
    border-radius: 4px;
  }

  .indicator .label .processbg .process {
    width: 68%;
    height: 100%;
    border-radius: 4px;
  }

  /* 排名top */
  .chart .rank {
    padding: 0 2.5rem;
  }

  .chart .rank .count {
    font-size: 2.5rem;
    color: #fff;
    padding: 1.6rem 0rem;
  }

  .chart .rank .count .unit {
    font-size: 0.9rem;
  }

  .rank .label {
    padding: 0.25rem 0rem;
    //margin-bottom: 0.5rem;
  }

  .rank .label .name {
    font-size: 0.8rem;
    color: #fff;
    display: block;
    //width: 6.2rem;
    text-align: left;
    margin-right: 0.5rem;
  }

  .rank .label .count {
    font-size: 0.8rem;
    color: #fff;
  }

  .rank .label .processbg {
    //display: inline-block;
    //width: 19rem;
    background: #535674;
    height: 0.6rem;
    border-radius: 4px;
  }

  .rank .label .processbg .process {
    width: 68%;
    height: 100%;
    border-radius: 4px;
  }

  /*排名tab*/
  .tabs {
  }

  .tabs .tab {
    font-size: 0.9rem;
    padding: 0.1rem 0rem;
    color: #657488;
    display: inline-block;
    border-bottom: 0.1rem solid;
    width: 3.4rem;
    margin: 0.2rem 0rem 0.5rem 0.5rem;
  }

  .userat .tabs .tab.active {
    color: #03edff;
  }

  .flow .tabs .tab.active {
    color: #ece367
  }

  .scales {
    //text-align: right;
    //padding-right: 1.5rem;
    padding-bottom: 0.4rem;
    margin-top: 0.4rem;
    font-size: 1rem;
    display: flex;
    justify-content: space-between;
  }

  .scales .item {
    //padding: 0rem 0.5rem;
    color: #fff;
  }

  /*------------*/
  .host_sum {
    width: 100%;
    height: 10.55rem;
    line-height: 10rem;
    font-size: 2rem;
    color: #fff;
    text-align: center;
    position: absolute;
  }


  /*-----表格样式-------*/
  .generalContent {
    /*background: rgba(102, 102, 102, 0.3);*/
    /*clear: both;*/
    /*padding: 0 1rem 1rem 1rem;*/
    /*box-sizing: border-box;*/
  }
  .generalContent table {
    width: 100%;
  }
  .generalContent table td {
    width: 20%;
  }
  .generalContent table .operation a {
    display: inline-block;
    height: 100%;
  }
  .generalContent table .operation i {
    color: #66a5ef;
  }
  .generalContent table .operation a:nth-child(1) {
    text-align: right;
  }
  .generalContent table .operation a:nth-child(2) {
    text-align: left;
  }
  .generalContent table thead td {
    height: 1.75rem;
    line-height: 1.75rem;
    font-size: 0.75rem;
    color: #fff;
    background-color: #94b7de;
    border-right: 1px solid #3d556c;
  }
  .generalContent table thead tr td:last-child {
    border-right:none;
  }
  .generalContent table tbody td {
    height: 1.9rem;
    line-height: 1.9rem;
    font-size: 0.65rem; // font-weight: lighter;
    color: #fff;
  }
  .generalContent table tbody tr{
    background-color: rgba(109, 151, 191, 0.33);
  }
  .generalContent table tbody tr td {
    border-top: 0px solid #3d556c;
    border-bottom: 1px solid #3d556c;
    border-right: 1px solid #3d556c;
  }
  .generalContent table tbody tr td:last-child {
    border-right: none;
  }
  .generalContent table thead td {
    border-bottom: 1px solid #3d556c;
    border-top: 1px solid #3d556c;
  }
</style>
