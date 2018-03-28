<template>
    <div class="strategyDetail">
        <ul>
            <li>
                <div>
                    <div class="left_title">策略名称：</div>
                    <div class="right_content">{{warnconf.property.name}}</div>
                </div>
            </li>
            <li>
                <div>
                    <div class="left_title">状态：</div>
                    <div v-if="warnconf.status=='ok'" class="color_div on"></div>
                    <div v-if="warnconf.status=='no'" class="color_div off"></div>
                    <div v-if="warnconf.status=='alert'" class="color_div err"></div>
                </div>
            </li>
            <li>
                <div>
                    <div class="left_title">指标名：</div>
                    <div class="right_content">{{warnconf.tsd_rule.metric}}</div>
                </div>
            </li>
            <li>
                <div>
                    <div class="left_title">类型：</div>
                    <div class="right_content">{{warnconf.type}}</div>
                </div>
            </li>
            <li>
                <div>
                    <div class="left_title">TAG：</div>
                    <span class="tag" v-for="label in warnconf.property.labels">{{label+' '}}</span>
                    <!-- <div class="right_content">{{warnconf.property.name}}</div>                     -->
                </div>
            </li>
            <li>
                <div>
                    <div class="left_title">规则描述：</div>
                    <div class="right_content">{{warnconf.tsd_rule.time_duration + timeFunc(warnconf.tsd_rule.time_unit) + sampleFunc(warnconf.tsd_rule.sample) + comparisonFunc(warnconf.tsd_rule.comparison) + warnconf.tsd_rule.threshold}}</div>
                </div>
            </li>
            <li>
                <div>
                    <div class="left_title">通知对象：</div>
                    <div class="right_content">{{warnconf.notify.notify_user}}</div>
                </div>
            </li>
            <li>
                <div>
                    <div class="left_title">通知方式：</div>
                    <span class="tag" v-for="label in warnconf.notify.notify_method">{{label+' '}}</span>
                </div>
            </li>
            <li>
                <div>
                    <div class="left_title">创建人：</div>
                    <div class="right_content">{{warnconf.property.create_user}}</div>
                </div>
            </li>

        </ul>
    </div>
</template>
<script>
import urls from 'service/url'
import http from 'service/myhttp'
import simdate from 'service/simdate'
import { getStore } from 'service/mUtils'
import { Indicator, Loadmore } from 'mint-ui';

export default {
    name: 'strategyDetail',
    components: {

    },
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            warnconf:{},
            time_units: [ //时间单位数组
                {
                    label: '秒',
                    value: 's'
                },
                {
                    label: '分',
                    value: 'm'
                },
                {
                    label: '时',
                    value: 'h'
                },
                {
                    label: '天',
                    value: 'd'
                },
                {
                    label: '周',
                    value: 'w'
                },
                {
                    label: '月',
                    value: 'y'
                },
                {
                    label: '年',
                    value: 'n'
                },
            ],
            samples: [ //取样方法数组
                {
                    label: '平均值',
                    value: 'avg'
                },
                {
                    label: '最大值',
                    value: 'max'
                },
                {
                    label: '最小值',
                    value: 'min'
                },
                {
                    label: '总和',
                    value: 'sum'
                }
            ],
            comparisons: [ //比较符数组
                {
                    label: '大于',
                    value: '>'
                },
                {
                    label: '小于',
                    value: '<'
                }, {
                    label: '等于',
                    value: '=='
                }
            ],
        }
    },
    methods: {
        timeFunc:function(value){
            var label = '';
            this.time_units.forEach(function(val,index){
                if (val.value === value) {
                    label = val.label;
                     return label;
                }
            })
            return label;
        },
        sampleFunc:function(value){
            var label = '';
            this.samples.forEach(function(val,index){
                if (val.value === value) {
                    label = val.label;
                     return label;
                }
            })
            return label;
        },
        comparisonFunc:function(value){
            var label = '';
            this.comparisons.forEach(function(val,index){
                if (val.value === value) {
                    label = val.label;
                     return label;
                }
            })
            return label;
        }
    },
    mounted() {
        var str = getStore('strategyDetail');
        if (str && str.length > 0) {
           this.warnconf = JSON.parse(str);
        }
        // console.log('warnconf',this.warnconf);
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.strategyDetail {
    padding: 0.2rem 0.2rem 0;

    ul {
       padding: 0.1rem 0.1rem;
       background-color: #8ab6fa;
       border-radius: 0.1rem;
       li {
        background-color: #698bc3;
        padding: 0 0.06rem;
        >div {

            padding: 0.2rem 0.48rem 0.2rem 0;
            border-bottom:0.01rem solid #8ab6fa;
            display: flex;
            align-items: center;
            color: white;
            font-size: 0.24rem;
            .left_title {
                flex-shrink: 0;
                width: 1.4rem;
                line-height: 0.3rem;
                height: 0.3rem;
                text-align: right;
            }
            .right_content {
                text-align: left;
                flex-grow:1;
                line-height: 0.3rem;
            }
                .color_div {
                    width: 0.58rem;
                    height: 0.16rem;
                    border-radius: 0.08rem;
                }
                .on {
                    background-color: #81C16A
                }
                .off {
                    background-color: #BFBFBF
                }
                .err {
                    background-color: #EB6876
                }
        }
        &:last-child {
            >div {
                 border-bottom:none;
            }
            border-bottom-left-radius: 0.1rem;
            border-bottom-right-radius: 0.1rem;
        }
        &:first-child{
            border-top-left-radius: 0.1rem;
            border-top-right-radius: 0.1rem;
        }

       }
    }
}
</style>
