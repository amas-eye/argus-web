<template>
    <div class="warning">
        <section class="header">
            <searchInput @searchText="searchText"></searchInput>
        </section>
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :bottomDistance="-20" ref="loadmore">
        <section class="contentList">

                <ul>
                    <li v-for="(item,index) in List" @click="liClick(item)">
                        <div class="left_box">
                            <p :style="{backgroundColor:(index % 2 ===0) ? '#59bafa':'#7073e7' }">{{index + 1}}</p>
                        </div>
                        <div class="right_div">
                            <div class="top_div">
                                <h3>{{item.property.name}}</h3>
                                <div class="status_div">
                                    <span>状态：</span>
                                    <div v-if="item.status=='ok'" class="color_div on"></div>
                                    <div v-if="item.status=='no'" class="color_div off"></div>
                                    <div v-if="item.status=='alert'" class="color_div err"></div>
                                </div>
                            </div>
                            <div class="middle_div">
                                {{ item.tsd_rule.metric ?  '指标名：'+item.tsd_rule.metric : ''  }}
                            </div>
                            <div class="bottom_div">
                                {{item.type ? '类型：'+item.type : ''}}
                            </div>
                        </div>
                    </li>
                </ul>

        </section>
        </mt-loadmore>
    </div>
</template>
<script>
import urls from 'service/url'
import http from 'service/myhttp'
import simdate from 'service/simdate'
import { Loadmore, Toast } from 'mint-ui';
import {setStore} from 'service/mUtils'
import searchInput from 'components/searchInput'

export default {
    name: 'warning',
    components: {
        searchInput
    },
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            List: [],
            simdate: simdate,
            allLoaded: false,
            pageactive: 1, //当前页码
            viewcount: 0, // 视图总数
            onepagecount: 20,
            scrollMode: "auto",
            keyword:''

        }
    },
    methods: {
        searchText:function(text){ //搜索
            this.keyword = text;
            this.List = [];
            this.getWarnCount(true);
            this.searchWarn(true);
        },
        liClick:function(item){
            setStore('strategyDetail',item);
            this.$router.push('/strategyDetail');
        },
        searchWarn: function(flag) {
            //搜索告警策略
            // console.log(this)
            http.get(urls.HQGJCL, {
                text: this.keyword, //刷选文本
                label: '', //标签选择
                page: this.pageactive, //页号
                onepagecount: this.onepagecount, //每页数量
                loading:flag,
                level:''
            }).then(res => {
                // console.log(res)
                let data = res.data
                // console.log(data)
                this.List = this.List.concat(data);
            })
        },
        getWarnCount: function(flag) {
            // 获取告警策略数据总数
            // console.log(this)
            http.get(urls.HQCLZS, {
                text: this.keyword,
                label: '',
                loading:flag,
                level:''
            }).then(res => {
                // console.log(res)
                let data = res.data
                this.viewcount = data.count
            })
        },
        loadBottom() {
            if (this.pageactive * this.onepagecount >= this.viewcount) {
                this.allLoaded = true;
            } else {
                this.allLoaded = false;
                this.pageactive = this.pageactive + 1;
                this.searchWarn(true)
            }
            if (this.allLoaded) { Toast('加载完'); }

            this.$refs.loadmore.onBottomLoaded();

        },

    },
    mounted() {
        this.getWarnCount();
        this.searchWarn();
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.warning {
    padding-left: 0.2rem;
    padding-right: 0.2rem;
}

.header {
    height: 0.94rem;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 0.2rem;
    background-color: white;
    z-index: 1000;
    position: fixed;
    top: 0.88rem;
    left: 0;
    right: 0;
}

.contentList {
    // margin-top: 0.94rem;
    padding-top: 0.94rem;
    padding-bottom: 0.98rem;
    ul {
        li {
            padding-left: 0.12rem;
            padding-right: 0.12rem;
            display: flex;
            height: 1.38rem;
            &:nth-child(2n+1) {
                background-color: #edf0f2;
            }
            .left_box {
                display: flex;
                height: 1.38rem;
                width: 0.7rem;
                flex-shrink: 0; // background-color: #59bafa;
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
                // background-color:gray;
                text-align: left;
                flex-grow: 1;
                padding-left: 0.15rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                >div {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    color: #696969;
                    .status_div {
                        display: flex;
                        align-items: center;
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
                    span {
                        color: #696969;
                    }
                    >h3 {
                        font-size: 0.28rem;
                        font-weight: bold;
                        color: #494c4c;
                    }
                }
                .bottom_div {
                    // margin-top: 0.1rem;
                }
                .middle_div {

                    flex-direction: column;
                    >div {
                        text-align: left;
                    }
                }
            }
        }
    }
}
</style>
