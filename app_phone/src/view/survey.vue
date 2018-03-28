<!--错误页面-->
<template>
    <div class="survey">
        <!-- 基本指标概览 -->
        <section class="jbzb">
            <h3 class="box_Title">基本指标概览</h3>
            <ul class="clearfix">
                <li class="fl">
                    <h4 class="liTitle">健康度</h4>
                    <div>
                        <charts style="height: 100%;" :option="a"></charts>
                    </div>
                </li>
                <li class="fl">
                    <h4 class="liTitle">主机</h4>
                    <div>
                        <div class="host_sum"><span style="margin-right: 0.5rem;">{{bdata.hosts}}</span></div>
                        <charts style="height: 100%;" :option="b"></charts>
                    </div>

                </li>
                <li class="fl">
                    <h4 class="liTitle">告警</h4>
                    <div class="ztgj">
                        <div class="date">
                            <div class="item">{{cdata.alerts || 0}}<span>条</span></div>
                            <div class="item">{{cdata.alert_critical || 0}}<span>条</span></div>
                            <div class="item">{{cdata.alert_minor || 0}}<span>条</span></div>
                        </div>
                        <div class="imageBox">
                            <img class="bg" src="../img/ztgj.png" />
                            <div class="datename">
                                <div class="item">现有告警</div>
                                <div class="item">严重告警</div>
                                <div class="item">一般告警</div>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="fl">
                    <h4 class="liTitle">指标</h4>
                    <div class="indicator">
                        <!-- 指标 -->
                        <div class="first_count">{{ this.ddata.metrics }}<span class="unit">个</span></div>
                        <div class="label">
                            <span class="name">正常</span>
                            <div class="processbg">
                                <div :style="{width:this.ddata.normal/this.ddata.metrics*100+'%'}" style="background: #03eeff;" class="process"></div>
                            </div>
                            <span class="count">{{ this.ddata.normal }}</span>
                        </div>
                        <div class="label">
                            <span class="name">异常</span>
                            <div class="processbg">
                                <div :style="{width:this.ddata.error/this.ddata.metrics*100+'%'}" style="background: #ff839a;" class="process"></div>
                            </div>
                            <span class="count">{{ this.ddata.error }}</span>
                        </div>
                    </div>
                </li>
            </ul>
        </section>
        <!-- 基本指标概览 -->
        <!-- 告警趋势 -->
        <section class="gjqs box">
            <h3 class="box_Title">告警趋势</h3>
            <div class="chart_box">
                <charts style="height: 100%" :option="e"></charts>
            </div>
        </section>
        <!-- 告警趋势 -->
        <!-- 利用率top5统计 -->
        <section class="userat box">
            <div class="title_box">
                <h3 @click="useratIndex = 0"  :class="{'active':(useratIndex === 0)}">基础资源使用量</h3>
                <h3 @click="useratIndex = 1" class="right_title" :class="{'active':(useratIndex === 1)}">利用率top5统计</h3>
            </div>
            <div class="chart_box">
                <div class="left_triangle triangle_up" v-show="useratIndex === 0"></div>
                <div class="right_triangle triangle_up" v-show="useratIndex === 1"></div>
                <div class="resourceUse" v-show="useratIndex === 0">

                    <!-- <charts v-if="g && g.length > 0" :key="item" v-for="(item,index) in g" :option="item"></charts> -->
                    <charts :option="g[0]"></charts>
                    <charts :option="g[1]"></charts>
                    <charts :option="g[2]"></charts>
                    <!-- <charts :option="g[0]" style="width:33.33%;height: 3.75rem;float:left;"></charts> -->
                </div>
                <div class="top_five" v-show="useratIndex === 1">
                    <div class="tabs">
                        <div v-for="item in useRatRankTypes" :key="item.label" :style="{color:(useRatRankType==item.label?item.color.use:'')}" @click="useRatRankType=item.label" :class="{active:useRatRankType==item.label}" class="tab clickable">
                            {{item.label}}
                        </div>
                    </div>
                    <div v-show="useRatRankType==item.label" :key="item.label" v-for="item in useRatRankTypes" class="rank ">
                        <!-- 指标 -->
                        <div :key="data.host" v-for="data in fdata[getTopType(item.label)]" class="label">
                            <span class="name">{{ data.host }}</span>
                            <div class="processbg">
                                <div :style="{background:(useRatRankType==item.label?item.color.use:''),width:''+data.per+'%'}" class="process"></div>
                            </div>
                        </div>

                        <div v-for="data in (5 - fdata[getTopType(item.label)].length)" class="label">
                            <span class="name">{{'--'}}</span>
                            <div class="processbg">
                                <div class="process"></div>
                            </div>
                        </div>


                        <div class="scales">
                            <span class="item" :key="scale" v-for="scale in useRatScales">{{scale}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- 利用率top5统计 -->
        <!-- 网络流量 -->
        <section class="net_flow box">
            <div class="title_box">
                <h3 @click="netFlow = 0" :class="{'active':(netFlow === 0)}">网络流入流出趋势</h3>
                <h3 @click="netFlow = 1" class="right_title" :class="{'active':(netFlow === 1)}">网络流入流出 top5 统计</h3>
            </div>
            <div class="chart_box">
                <div class="left_triangle triangle_up" v-show="netFlow === 0"></div>
                <div class="right_triangle triangle_up" v-show="netFlow === 1"></div>
                <charts :option="h" v-show="netFlow === 0"></charts>
                <div class="out" v-show="netFlow === 1">
                    <div class="tabs">
                        <div v-for="item in flowTypes" :key="item.label" @click="flowType=item.label" :style="{color:(flowType==item.label)?item.color:''}" :class="{active:flowType==item.label}" class="tab clickable">
                            {{item.label}}
                        </div>
                    </div>
                    <div v-show="flowType==item.label" :key="item.label" v-for="item in flowTypes" class="rank ">
                        <!-- 指标 -->
                        <div :key="data.host" v-for="data in ydata[getTopType(item.label)]" class="label">
                            <span class="name">{{data.host}}</span>
                            <div class="processbg">
                                <div :style="{background:(flowType==item.label)?item.color:'',width:''+data.per+'%'}" class="process"></div>
                            </div>
                        </div>

                        <div v-for="val in (5 - ydata[getTopType(item.label)].length)" class="label">
                            <span class="name">{{'--'}}</span>
                            <div class="processbg">
                                <div class="process"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
        <!-- 自定义指标 -->
        <section class="zdyzb box">
            <h3 class="box_Title">自定义指标</h3>
            <div class="chart_box">
                <div :key="item._id" v-for="(item,index) in mycharts" class="chart chart50">
                    <h4 v-if="item.chart.title && item.chart.title.length > 0">{{item.chart.title}}</h4>
                    <jkchart :option="item.chart" :date="getMyChartTime(item.datatime_config)"></jkchart>
                </div>


                <div class="content_bottom" v-for="(val,index) in chartListFilterTable">
                    <!-- 图表 -->
                    <div class="tipInfo">
                        <div>
                            <h4>{{chartListTable[index] && chartListTable[index].chart ? chartListTable[index].chart.title : ''}}</h4>
                        </div>
                    </div>

                    <div class="generalContent">
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
                                            <td :rowspan="val2.host_value.length" v-if="index3 === 0">
                                                <p class="overHiddenP">{{val2.metric}}</p>
                                            </td>
                                            <td>
                                                <p class="overHiddenP">{{val3.host}}</p>
                                            </td>
                                            <td :style="{color:(val2.alert_status === 'ok' ? 'red' :'#fff')}">
                                                <p class="overHiddenP">{{val3.value}}</p>
                                            </td>
                                            <td :rowspan="val2.host_value.length" v-if="index3 === 0">
                                                <p class="overHiddenP">{{val2.alert_status === 'ok' ? '是' : '否'}}</p>
                                            </td>
                                            <td>
                                                <p class="overHiddenP">{{simdate.TMDTime(val3.last_timestamp)}}</p>
                                            </td>
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
        </section>
    </div>
</template>
<script>
import charts from 'components/charts'
import urls from 'service/url'
import http from 'service/myhttp'
import moment from 'moment'
import simdate from 'service/simdate'
import jkchart from 'components/jkcharts' //监控图表组件
export default {
    name: 'survey',
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
                    color: 'yellow'
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
                cpu_topN:[],
                mem_topN:[],
                disk_topN:[]
            },
            gdata: null, //基础资源使用量 ,
            hdata: {
                indata: [],
                outdata: []
            }, //网络流入流出趋势
            ydata: { //络流入流出top5统计
                net_in_topN:[],
                net_out_topN:[]
            },
            mycharts: [], //所有自定义概况图表
            chartListTable:[],//图表（配置）表格
            chartListFilterTable:[],//图表（配置）表格
            useratIndex: 0,
            netFlow: 0,
        }
    },
    mounted() { //主节点挂载后
        this.init()
    },
    methods: {
        getMyChartTime: function(option) {
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
                // console.info('时间选择', dataoption)
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
        getQDTime: function(dateTimeString) {
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
        getTopType: function(value) {
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
        getBaseType: function(value) {
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
        init: function() {
            this.get_overall_health()
            this.get_host_stat()
            this.get_alert_stat()
            this.get_metric_stat()
            this.get_alert_trend() //告警趋势
            this.get_sys_resource()
            this.get_out_in()
            this.get_mycharts()
        },
        get_overall_health: function() {

            //获取健康度
            http.get(urls.HQJKD).then(res => {
                let data = res.data
                this.adata = data
                // console.log(this.adata)
            })
        },
        get_host_stat: function() {
            //获取主机信息
            http.get(urls.HQZJXX).then(res => {
                let data = res.data
                this.bdata = data
                // console.log(data)
            })
        },
        get_metric_stat: function() {
            //获取指标统计信息
            http.get(urls.HQZBTJ).then(res => {
                let data = res.data
                this.ddata = data
                // console.log(data)
            })
        },
        get_alert_stat: function() {
            //获取告警统计信息
            http.get(urls.HQGJTJ).then(res => {
                let data = res.data
                this.cdata = data
                // console.log(data)
            })
        },

        get_alert_trend: function() {
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
        get_sys_resource: function() {
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

        getparsedata: function(data) {
            //获取解析成数组后的数据
            let onedata = []
            for (let key in data) {
                let value = data[key]
                //遍历获取key（时间）value(值)
                // console.info('时间', simdate.TMDTime2(moment.unix(key)))
                let dataitem = [simdate.TMDTime2(moment.unix(key)), value] //数据项
                onedata.push(dataitem) //填充一个数据组
            }
            // console.log('getparsedata',onedata)
            return onedata
        },
        get_out_in: function() {
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
            }, err => {})
        },
        get_mycharts2: function() {
            //获取自定义指标概览图表
            http.get(urls.HQZDYGLTB).then(res => {
                let data = res.data
                this.mycharts = data
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

    },
    components: {
        charts,
        jkchart
    },
    computed: {
        useRatScales: function() {
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
        a: function(params) { //总体监控度评分
            return {
                tooltip: {
                    formatter: "{a} <br/>{b} : {c}分"
                },
                grid: {
                    left: '0',
                    right: '0',
                    top: '0',
                    bottom: '0',
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
                            fontSize: 22,
                            fontWeight: 'bold',
                            color: '#fff',
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
        b: function(params) { //主机
            return {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                grid: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0
                },
                legend: {
                    orient: 'horizontal',
                    // x: 'center',
                    // y: 'bottom',
                    // align:'right',
                    // right: '0',
                    // bottom: '0',
                    // width: '5%',
                    // left:0,
                    // right:0,
                    bottom:'2%',
                    // itemGap:0,
                    // width:'100%',
                    // align:'center',
                    itemWidth:9,
                    itemHeight:6,
                    // borderRadius:3,
                    textStyle:{
                        // borderRadius:3,
                    },
                    // height:'10%',
                    textStyle: {
                        color: '#fff',
                        fontSize: 12,
                    },
                    formatter: function(name) {
                        return name
                    },
                    data: ['正常', '异常', '关闭']
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    center: ['50%', '40%'],
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

        e: function() { //告警趋势
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
                    right: '10%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{ //X轴样式
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
        g: function() { //基础资源使用量
            let datarry = []
            // console.info('数据', this.gdata)
            if (this.gdata) {
                //有数据时
                this.useRatRankTypes.forEach((item) => {
                    let middleText = ''
                    let usage = (this.gdata[this.getBaseType(item.label)].usage * 100).toFixed(0) //使用率
                    let usingval = this.gdata[this.getBaseType(item.label)].using //使用值
                    let all = this.gdata[this.getBaseType(item.label)].all //总量
                    if (item.label == "CPU") {
                        // cpu是使用率
                        middleText = "CPU\n" + usage + "%"
                        usingval = usage
                    } else if (item.label == "内 存") {
                        middleText = "内存\n" + usage + "%"
                        // 转换单位 G 并精确小数
                        usingval = (usingval / 1024 / 1024 / 1024).toFixed(0)
                        all = (all / 1024 / 1024 / 1024).toFixed(0)
                    } else if (item.label == "硬 盘") {
                        middleText = "硬盘\n" + usage + "%"
                        usingval = (usingval / 1024 / 1024 / 1024).toFixed(0)
                        all = (all / 1024 / 1024 / 1024).toFixed(0)
                    }
                    datarry.push({
                        tooltip: {
                            show: false,
                            trigger: 'item',
                            formatter: "{a} <br/>{b}: {c} ({d}%)"
                        },
                        // grid: {
                        //     top: '0',
                        //     left: '0',
                        //     right: '0',
                        //     bottom: '0',
                        //     containLabel: false
                        // },
                        legend: {
                            orient: 'vertical',
                            x: 'center',
                            y: 'bottom',
                            // bottom:'-20%',
                            top: '70%',
                            itemWidth:15,
                            itemHeight:10,
                            textStyle: {
                                color: '#fff',
                                fontSize: 12
                            },
                            formatter: function(name, vaule) {
                                return name
                            },
                            data: [(item.label == 'CPU' ? '使用率: ' : '使用量: ') + usingval  + (item.label == 'CPU' ? '%' : 'G'), '总 量: ' + all + (item.label == 'CPU' ? '核' : 'G')]
                        },
                        label: {
                            normal: {
                                position: 'center'
                            }
                        },
                        // graphic: {
                        //     type: 'text',
                        //     left: '40%',
                        //     top: '28%',
                        //     style: {
                        //         text: middleText,
                        //         fill: item.color.use,
                        //         font: '0.3rem "STHeiti", sans-serif'
                        //     }
                        // },
                        series: [{
                            name: item.label,
                            type: 'pie',
                            center: ['50%', '35%'],
                            radius: ['70%', '80%'],
                            // avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'center',
                                    formatter: '{b}\n{d}',
                                     textStyle: {
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }
                                },
                                emphasis: {
                                    show: false,
                                    position: 'center',
                                    formatter: '{b}\n{d}%',
                                    textStyle: {
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [{
                                    value:  item.label == 'CPU' ? usingval/100*all : usingval,
                                    label:{
                                        normal:{
                                            formatter: item.label,
                                            textStyle: {
                                                fontSize: 14
                                            },
                                        }
                                    },
                                    name: (item.label == 'CPU' ? '使用率: ' : '使用量: ') + usingval + (item.label == 'CPU' ? '%' : 'G'),
                                    itemStyle: {
                                        normal: {
                                            color: item.color.use
                                        }
                                    }
                                },
                                {
                                    value: (item.label == 'CPU' ? all - usingval/100*all : all - usingval),
                                    label:{
                                        normal:{
                                            formatter: usage + '%',
                                            textStyle: {
                                                fontSize: 12
                                            },
                                        }
                                    },
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


        h: function() { //网络流入流出趋势
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
                        font: '0.32rem'
                        // fontSize: '14'
                    },
                    data:['流出','流入']
                    // data: [{
                    //         name: '流出',
                    //         icon: 'roundRect'
                    //     },
                    //     {
                    //         name: '流入',
                    //         icon: 'roundRect'
                    //     },
                    // ]
                },
                tooltip: {
                    trigger: 'axis',
                    position: ['20%', '30%'],
                },
                grid: { //图表在div的布局控制
                    top: '15%',
                    left: '2%',
                    right: '10%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{ //X轴样式
                    type: 'time',
                    // type: 'category',
                    // boundaryGap: false,
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
                    // minInterval: 11600
                    // splitNumber:3,
                    // boundaryGap: ['20%', '20%']
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
        y: function() { //络流入流出top5统计
            return {}
        }



    }
}
</script>
<style scoped lang="less">
 /* 公共样式 */
.liTitle {
    //小标题
    padding-left: 0.15rem;
    color: white;
    text-align: left;
    font-size: 0.28rem;
    font-weight: normal;
}

.box_Title {
    //容器大标题
    height: 0.66rem;
    line-height: 0.66rem;
    text-align: center;
    color: white;
    font-size: 0.32rem;
    font-weight: normal;
}

.title_box {
    //容器大标题2个
    h3 {
        display: inline-block;
        height: 0.66rem;
        line-height: 0.66rem;
        color: #35578b;

        font-size: 0.32rem;

    }
    .active {
        color: white;
    }
    .right_title {
        margin-left: 0.5rem;
    }
}

.box {
    //容器样式
    padding: 0 0.1rem 0.1rem;
    box-sizing: border-box;
    margin-top: 0.1rem;
    border-radius: 0.1rem;
    .chart_box {
        height: 3.76rem;
        position: relative;
        border-radius: 0.1rem;
        .triangle_up {
            position: absolute;
            width: 0;
            height: 0;
            top: -0.2rem;

            border-left: 0.14rem solid transparent;
            border-right: 0.14rem solid transparent;
            border-bottom: 0.28rem solid #415f95;
        }
        .left_triangle {
            left: 1.8rem;
        }
        .right_triangle {
            right: 1.8rem;
        }

        .tabs {
            height: 0.76rem; // line-height: 0.86rem;
            display: flex;
            align-items: center;
            justify-content: center;
            .tab {
                font-size: 0.32rem;
                box-sizing: content-box;
                // padding-bottom: 0.02rem;
                border-bottom: 0.02rem solid;
                margin-right: 0.1rem;
                // width: 0.66rem;
                width: 1rem;
                text-align: center;
                color: #233252;
                &.active {
                    color: #03edfe
                }
            }
        }
        .rank {
            padding: 0 0.4rem;
            .label {
                display: flex;
                // align-items: center;
                // justify-content: center;
                // height: 0.42rem;
                flex-direction: column;
                margin-bottom: 0.12rem;
                  @media (max-width: 370px) {
                    margin-bottom: 0.12rem;
                  }

                .name {
                    width: 1.3rem;
                    font-size: 0.24rem;
                    margin-right: 0.12rem;
                    text-align: left;
                    color: white;
                }
                .processbg {
                    // width: 4.79rem;
                    width: 100%;
                    height: 0.12rem;
                    background-color: #2e416b;
                    border-radius: 0.06rem;
                    overflow: hidden;
                    .process {
                        height: 100%;
                    }
                }
            }
            .scales {
                display: flex;
                width: 100%;
                // margin: 0 auto;
                // margin-left: 1.88rem;
                margin-top: 0.2rem;
                justify-content: space-between;
                height: 0.22rem;
                align-items: center;
                span {
                    font-size: 0.24rem;
                    color: white;
                }
            }
        }
    }
}
 /* 公共样式 */

.survey {
    padding: 0.2rem 0.2rem 0.98rem;
    //height: 3000px;
}

.jbzb {
    background-color: #8086f8;
    padding: 0 0.1rem 0.1rem;
    box-sizing: border-box;
    border-radius: 0.1rem;
    >ul {
        li {
            width: 3.42rem;
            background-color: #4e5198;
            margin-bottom: 0.06rem;
            box-sizing: border-box;
            padding-top: 0.1rem;
            position: relative;
            border-radius: 0.1rem;
            >div {
                height: 2.45rem;
            }
            .host_sum {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                span {
                    position: absolute;
                    // left: 0.85rem;
                    top: 1.15rem;
                    color: white;
                    font-size: 25px;
                    font-weight: bold;
                    z-index: 50;
                  left: 50%;
                  transform: translateX(-50%);
                }
            }
            &:nth-child(2n) {
                margin-left: 0.06rem;
            }
            &:nth-child(3) {
                margin-bottom: 0;
            }
            &:nth-child(4) {
                margin-bottom: 0;
            }
            >h4 {}
            .ztgj {
                // height: 2.41rem;
                padding-top: 0.2rem;
                box-sizing: border-box;
                display: flex;
                padding-left: 0.15rem;

                .date {
                    // padding-top: 0.1rem;
                    display: flex;
                    flex-direction: column;
                    height: 2.41rem;
                    width: 0.6rem;
                    flex-shrink: 0;
                    font-size: 0.24rem;
                    color: white;
                    line-height: 0.4rem;
                    box-sizing: border-box;
                    padding-top: 0.3rem; // font-weight: bold;
                    span {
                        font-size: 0.24rem;
                        color: white;
                        text-align: right;
                    }
                }
                .imageBox {
                    box-sizing: border-box;
                    padding-top: 0.15rem;
                    // height: 2.41rem;
                    flex-grow: 1;
                    text-align: left;
                    position: relative;
                    .datename {
                        position: absolute;
                        color: white;
                        top: 0.3rem;
                        left: 0.65rem;
                        >div {
                            line-height: 0.5rem;
                        }
                    }
                }
                .bg {
                    width: 2.4rem;
                }
            }
        }
    }
}








/* 指标 */

.indicator {}

.indicator .first_count {
    font-size: 25px;
    font-weight: bold;
    color: #fff;
    height: 1.4rem;
    line-height: 1.4rem;
}

.indicator .count .unit {
    font-size: 0.18rem;
}

.indicator .label {
    padding: 0.01rem 0rem;
}

.indicator .label .name {
    font-size: 0.24rem;
    color: #fff;
}

.indicator .label .count {
    font-size: 0.24rem;
    color: #fff;
    display: inline-block;
    width: 0.5rem;
    padding: 0;
}

.indicator .label .processbg {
    display: inline-block;
    width: 1.91rem;
    background: #353b6c;
    height: 0.11rem;
    border-radius: 4px;
}

.indicator .label .processbg .process {
    width: 68%;
    height: 100%;
    border-radius: 4px;
}

//告警趋势
.gjqs {
    background-color: #728df8;
    .chart_box {
        height: 3.95rem;
        // height: 4.49rem;
        background-color: #475697;
    }
}

//利用率
.userat {
    background-color: #6b9af4;
    .title_box {
        padding-bottom: 0.15rem;
    }
    .chart_box {
        background-color: #415f95;
        box-sizing: border-box;
        height: 4.3rem;
        >div {
            height: 100%;
        }
    }
    .resourceUse {
        width: 100%;
        display: flex;
        >div {
            width: 2.3rem;
            height: 4.3rem;
        }
    }
}

.net_flow {
    background-color: #6eaef8;

    .title_box {
        padding-bottom: 0.15rem;
        //容器大标题2个
        .right_title {
            margin-left: 0.3rem;
        }
    }
    .chart_box {
        height: 4.0rem;
        background-color: #446a99;
        .triangle_up {
           border-bottom-color: #446a99;
        }
        .left_triangle {
            left: 1.3rem;
        }
        .right_triangle {
            right: 1.9rem;
        }
        >div {
            height: 100%;
        }
        .out {

        }
    }
}

.zdyzb {
    background-color: #83a8ef;

    .chart_box {

        height: inherit;
        >div {
            // border-bottom: 1px solid black;
            margin-bottom: 0.1rem;
            background-color: #5772a7;
            border-radius: 0.1rem;
            &:last-child{
                margin-bottom: 0rem;
                // border-bottom:none;
            }
            >h4 {
                height: 0.52rem;
                line-height: 0.52rem;
                color: white;
                font-weight: bold;
                font-size: 0.26rem
            }
        }
    }




    .generalContent {
        //width: 61.5rem;
        //height: 21.35rem;
        //background: rgba(12, 17, 37, 0.25);
        background: rgba(102, 102, 102, 0.3);
        clear: both;
        //border-radius: 0.3rem;
        // padding: 0 1rem 1rem 1rem;
        box-sizing: border-box;
    }
    .generalContent table {
        width: 100%;
    }
    .generalContent table td {
        width: 1.38rem;
        box-sizing: border-box;
    }
    .generalContent table td .overHiddenP {
        width: 1.38rem;
        line-height: 0.5rem;
        overflow-x: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-wrap: break-word;
        box-sizing: border-box;
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
        //height: 1.75rem;
        //line-height: 1.75rem;
        //font-size: 0.75rem;
        color: #fff;
        background-color: #94b7de;
        //border-right: 1px solid #3d556c;
    }
    .generalContent table thead tr td:last-child {
        border-right:none;
    }
    .generalContent table tbody td {
        //height: 1.9rem;
        //line-height: 1.9rem;
        //font-size: 0.65rem; // font-weight: lighter;
        color: #fff;

    }
    .generalContent table tbody tr:nth-child(odd) {
        //background: #526f8a;
    }
    .generalContent table tbody tr{
        //background: #526f8a;
        background-color: rgba(109, 151, 191, 0.33);
    }
    .generalContent table tbody tr td {
        border-top: 0px solid #3d556c;
        border-bottom: 1px solid #3d556c;
        //border-right: 1px solid #3d556c;
    }
    .generalContent table tbody tr td:last-child {
        border-right: none;
    }
    .generalContent table thead td {
        border-bottom: 1px solid #3d556c;
    }

    .content_bottom {

        border-radius: 0.1rem;
        background-color: #4a76ad;
        margin-top: 0.1rem;
        h4 {
            height: 0.52rem;
            line-height: 0.52rem;
            color: white;
            font-weight: bold;
            font-size: 0.26rem;
            text-align: center;
        }
    }
}





</style>
