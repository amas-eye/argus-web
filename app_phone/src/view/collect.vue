<template>
<div class="collect">
    <section class="header">
        <searchInput @searchText="searchText"></searchInput>
    </section>
    <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :bottomDistance="-20">
            <section class="contentList"  :style="{height: List.length * 1.08 + 'rem'}">
                <ul>
                    <li v-for="(item,index) in List">
                        <div class="left_box">
                            <p :style="{backgroundColor:(index % 2 ===0) ? '#59bafa':'#7073e7' }">{{index + 1}}</p>
                        </div>
                        <div class="right_div">
                            <div class="top_div">
                                <h3>{{item.metric_name}}</h3>
                            </div>
                            <div class="bottom_div">
                                <div class="tag">{{item.description}}</div>
                                <span class="creator">{{ item.last_update>0?(simdate.SJCtoTime(item.last_update)):'无更新'}}</span>
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
import { Loadmore,Toast } from 'mint-ui';
import searchInput from 'components/searchInput'

export default {
    name: 'collect',
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
            keyword: '',

        }
    },
    methods: {
        searchText:function(text){
            this.keyword = text;
            this.List = [];
            this.searchData(true);
        },
        searchData: function(flag) {
            http.get(urls.HQCJXX, {
                search: this.keyword,
                limit: this.onepagecount,
                offset: (this.pageactive - 1) * this.onepagecount,
                loading:flag
            }).then(res => {
                let data = res.data.data
                this.viewcount = res.data.total
                this.List = this.List.concat(data);
            })
        },

        loadBottom() {

            if (this.pageactive * this.onepagecount >= this.viewcount) {
                this.allLoaded = true;
                this.$refs.loadmore.onBottomLoaded();
            } else {
                this.allLoaded = false;
                this.pageactive = this.pageactive + 1;
                this.searchData(true)
            }
            if (this.allLoaded) { 
                Toast('加载完');
            }
            this.$refs.loadmore.onBottomLoaded();

        },
    },
    mounted() {
        this.searchData();
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.generalOverview {
    padding: 0rem 0.2rem;
}
.box_container {
    // width: 100%;
    // -webkit-overflow-scrolling : touch;
}
.collect {
    // height: 1000px;
    // overflow-y: scroll;
    // -webkit-overflow-scrolling : touch;
    // padding-bottom: 0.98rem;
}

.collect .header {
    height: 0.94rem;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 0.2rem;
    background-color: white;
    z-index: 1000;
    >input {
        height: 0.54rem;
        background-color: #edf0f2;
        width: 100%;
        padding-left: 5px;
        box-sizing: border-box;
    }
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
}

.contentList {
    // margin-top: 0.94rem;
    padding-top: 0.94rem;
    padding-bottom: 0.98rem;
    ul {
        padding: 0 0.2rem;
        li {
            padding-left: 0.12rem;
            padding-right: 0.12rem;
            display: flex;
            &:nth-child(2n+1) {
                background-color: #edf0f2;
            }
            .left_box {
                display: flex;
                height: 1.08rem;
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
                    margin-top: 0.1rem;
                }
            }
        }
    }
}
</style>