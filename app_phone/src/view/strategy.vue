<template>
    <div class="strategy">
        <!-- 搜索栏 -->
        <timeselect :show="show" @close="close" @submitClick="submitClick" :datetime="datetime" :showReloadhz="false"></timeselect>
        <section class="top">
            <div class="input_time_box">
                <searchInput @searchText="searchText"></searchInput>
                <div class="inputTime_div" @click="showTimeSelect">{{dateTimeString}}</div>
            </div>
        </section>
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :bottomDistance="-20" ref="loadmore">
            <section class="contentList">
                <div class="ulBox">
                    <ul>
                        <li v-for="(item,index) in List" :style="{height: (item.opend ? 2.38 + 'rem' : 1.08 + 'rem'  )}">
                            <div class="left_box" :style="{height: (item.opend ? 0.88 + 'rem' : 1.08 + 'rem'  )}">
                                <p :style="{backgroundColor:(index % 2 ===0) ? '#59bafa':'#7073e7' }">{{index + 1}}</p>
                            </div>
                            <div class="right_div">
                                <div class="top_div" :style="{height: (item.opend ? 0.6 + 'rem' : 1.08 + 'rem'  )}">
                                    <h3>{{item.strategy_name}}</h3>
                                    <span>{{simdate.SJCtoTime(item.alert_time)}}</span>
                                </div>
                                <transition name="fade">
                                    <div class="show_div" v-show="item.opend">
                                        <p class="one">详情：{{detailStr(item.alert_info,'one')}}</p>
                                        <p class="three">恢复时间：{{item.recover_time?simdate.SJCtoTime(item.recover_time):'未恢复'}}</p>
                                        <p class="two">{{detailStr(item.alert_info,'two')}}</p>
                                        <p class="three">{{detailStr(item.alert_info,'three')}}</p>
                                    </div>
                                </transition>
                            </div>
                            <img :src="item.opend ? require('../assets/top_arrorw.png') : require('../assets/down_arrorw.png')" class="indicateImage" @click="item.opend = !item.opend" />
                        </li>
                    </ul>
                </div>
            </section>
        </mt-loadmore>
    </div>
</template>
<script>
import urls from 'service/url'
import http from 'service/myhttp'
import simdate from 'service/simdate'
import { Indicator, Loadmore, Toast } from 'mint-ui';
import searchInput from 'components/searchInput'
import timeselect from 'components/timeselect'

export default {
    name: 'strategy',
    components: {
        searchInput,
        timeselect
    },
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            simdate: simdate,
            allLoaded: false,
            viewcount: 0,
            pageactive: 1,
            onepagecount: 20,
            List: [],
            keyword: '',
            show: false, //显示时间弹出框
            datetime: { //时间选择
                start: '',
                end: ''
            },
            dateTimeString: '',
            mo:function(e){e.preventDefault();}

        }
    },
    methods: {
        detailStr:function(text,flag){
            if (text && text.length > 0) {
                var length = text.length;
                if (flag === 'one') {
                    let index1 = text.indexOf('Group');
                    return text.slice(0,index1);
                }else if (flag === 'two') {
                    let index1 = text.indexOf('Group');
                    let index2 = text.indexOf('告警条件');
                    return text.slice(index1,index2);

                }else if (flag === 'three') {
                    let index = text.indexOf('告警条件');
                    return text.slice(index);
                }

            }else{
                return '';
            }
        },
        showTimeSelect: function() { //弹出时间选择框
            this.show = true;
            this.datetime = Object.assign({}, this.datetime, { reloadhz: 0 });
            document.body.style.overflow = 'hidden';
            document.getElementById('html').style.overflow = 'hidden';
            document.addEventListener("touchmove",this.mo,false);
        },
        close: function() {
            this.show = false;
            document.body.style.overflow = 'visible';
            document.getElementById('html').style.overflow = 'visible';
            document.removeEventListener("touchmove",this.mo,false);

        },
        submitClick: function(val) {
            this.show = false;
            this.seleDefinedTime(val);
            document.body.style.overflow = 'visible';
            document.getElementById('html').style.overflow = 'visible';
            document.removeEventListener("touchmove",this.mo,false);
        },
        searchText: function(text) { //搜索
            this.keyword = text;
            this.List = [];
            this.getHistoryCount(true);
            this.searchHistory(true);
        },
        seleDefinedTime: function(val) {
                //自定义时间选择
                this.datetime = {
                    start: val.start,
                    end: val.end
                }
            if ('2007-1-1 0:00' === simdate.TMDTime2(val.start)) {
                this.datetime.start = '';
            }
            if ('2007-1-1 0:00' === simdate.TMDTime2(val.end)) {
                this.datetime.end = '';
            }

            var s = '';
            var e = '';
            if (this.datetime.start) {
                s = simdate.TMDTime(this.datetime.start);
            }
            if (this.datetime.end) {
                e = simdate.TMDTime(this.datetime.end);
            }

            this.dateTimeString = '开始：' + s + ' 结束：' + e;
            this.List = [];
            this.getHistoryCount(true);
            this.searchHistory(true);


        },
        addOpend: function(arr) {
            arr.forEach(function(val, index) {
                if (!val.hasOwnProperty("opend")) {
                    val.opend = false;
                }
            })
            return arr;
        },
        getHistoryCount: function(flag) {
            //获取告警历史数据总数
            http.get(urls.HQLSZS, {
                exact_text:'',
                text: this.keyword,
                date: this.hisdateval,
                loading:flag,
                level:'',
                is_recover:''
            }).then(res => {
                let data = res.data
                this.viewcount = data.count
            })
        },

        searchHistory: function(flag) {
            //搜索告警历史
            http.get(urls.HQGJLS, {
                exact_text:'',
                text: this.keyword, //刷选文本
                page: this.pageactive, //页号
                onepagecount: this.onepagecount, //每页数量
                date: this.hisdateval, //日期
                loading:flag,
                level:'',
                is_recover:''
            }).then(res => {
                let data = res.data
                const filterData = this.addOpend(data);
                this.List = this.List.concat(filterData);
            })
        },
        loadBottom() {
            if (this.pageactive * this.onepagecount >= this.viewcount) {
                this.allLoaded = true;
            } else {
                this.allLoaded = false;
                this.pageactive = this.pageactive + 1;
                this.searchHistory(true)
            }
            if (this.allLoaded) { Toast('加载完'); }
            this.$refs.loadmore.onBottomLoaded();
        },

    },
    mounted() {
        this.getHistoryCount();
        this.searchHistory();
    },
    computed:{
        hisdateval: function() {
            //告警历史日期
            let date = {
                start: simdate.TimetoSJC(this.datetime.start),
                end: simdate.TimetoSJC(this.datetime.end)
            }
            // console.info('告警历史', this.historydate.start)
            return date
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@title-color: #494c4c;
@detailTitle-color: #696969;
@liPadding: 0rem 0.12rem 0 0.12rem;
.top {
    position: fixed;
    top: 0.88rem;
    left: 0;
    right: 0;
    z-index: 900; // padding-top: 0.2rem;
    background-color: #f0f3f5;
    .input_time_box {
        padding: 0.2rem 0.2rem 0.15rem;
        background-color: #fff;
        >input {
            width: 100%;
            height: 0.56rem;
            background-color: #edf0f2;
            padding-left: 5px;
            box-sizing: border-box;
        }
        .inputTime_div {
            margin-top: 0.15rem;
            height: 0.54rem;
            line-height: 0.54rem;
            text-align: left;
            padding-left: 0.12rem;
            box-sizing: border-box;
            border: 0.01rem solid #dadada;
            border-radius: 0.1rem;
            background: url('../assets/time.png') no-repeat right 0.1rem center;
            background-size: 0.34rem 0.3rem; // background-position: right center;
            padding-right: 0.44rem;
        }
    }
}

.contentList {
    // margin-top: 1.78rem;
    // padding-top: 1.76rem;
    // background-color: #fff;
    padding-top: 1.58rem;
    padding-bottom: 0.98rem;
    .line {
        height: 0.2rem;
        background-color: #f0f3f5;
    }
    .ulBox {
        background-color: #fff;
        padding: 0 0.2rem;
        ul {
            // margin-top: 0.2rem;
            // height: 23.8rem;
            li {
                padding: @liPadding;
                display: flex;
                position: relative;
                height: 2.38rem;
                transition: height 0.5s;
                &:nth-child(2n+1) {
                    background-color: #edf0f2;
                }
                .indicateImage {
                    position: absolute;
                    width: 0.31rem;
                    height: 0.13rem;
                    // background-color: red;
                    bottom: 0.08rem;
                    left: 50%;
                    margin-left: -0.15rem;
                }
                .left_box {
                    height: 0.88rem;
                    width: 0.7rem;
                    display: flex;
                    flex-shrink: 0;
                    align-items: center;
                    >p {
                        height: 0.7rem;
                        line-height: 0.7rem;
                        font-weight: bold;
                        font-size: 0.3rem;
                        color: white;
                        width: 0.7rem;
                        border-radius: 50%;
                        background-color: red;
                    }
                }
                .right_div {
                    flex-grow: 1;
                    padding-left: 0.15rem;
                    .top_div {
                        width: 100%;
                        height: 0.6rem;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        span {
                            color: @detailTitle-color;
                            font-size: 0.24rem;
                        }
                        >h3 {
                            font-size: 0.28rem;
                            font-weight: bold;
                            color: @title-color;
                        }
                    }
                    .show_div {
                        font-size: 0.24rem;
                        color: @detailTitle-color;
                        text-align: left; // padding-bottom: 0.5rem;
                        .one {
                            line-height: 0.4rem;
                            height: 0.4rem;
                        }
                        .three {
                            margin-top: 0.12rem;
                        }
                    }
                }
            }
        }
    }
}

.fade-enter-active {
    transition: opacity .5s
}

.fade-leave-active {
    opacity: 0;
}

.fade-leave-active {
    // transition: opacity .25s
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active in below version 2.1.8 , .fade-leave-active */

{
    opacity: 0
}
</style>
