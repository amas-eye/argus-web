<template>
    <div class="generalOverview">
        <section class="header">
            <!-- <input type="text" name="" placeholder="搜索" /> -->
            <searchInput @searchText="searchText"></searchInput>
        </section>
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :bottomDistance="-20">
            <section class="contentList">
                <ul>
                    <li v-for="(item,index) in List" @click="$router.push({ path: '/monitorView/', query: { viewid: item._id,name:item.name}})">
                        <div class="left_box">
                            <p :style="{backgroundColor:(index % 2 ===0) ? '#59bafa':'#7073e7' }">{{index + 1}}</p>
                        </div>
                        <div class="right_div">
                            <div class="top_div">
                                <h3>{{item.name}}</h3>
                                <span class="time">{{simdate.TMDTime(item.create_time)}}</span>
                            </div>
                            <div class="bottom_div">
                                <div class="tag">
                                    <span v-show="item.tags && item.tags.length > 0">标签：</span>
                                    <span class="tag" :key="tag" v-for="tag in item.tags">
                                                    {{tag+' '}}
                                                </span>
                                </div>
                                <span class="creator">{{item.creater && item.creater.length > 0 ? '创建人：' + item.creater : ''  }}</span>
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
import searchInput from 'components/searchInput' 
export default {
    name: 'generalOverview',
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
        searchText:function(text){
            console.log('text',text)
            this.keyword = text;
            this.List = [];
            this.getViewcount(true);            
            this.searchView(true);
        },
        searchView: function(flag) {
            //搜索监控视图
            // console.log(this)
            http.get(urls.CZJKST, {
                text: this.keyword,
                tag: '',
                page: this.pageactive,
                onepagecount: this.onepagecount,
                loading:flag
            }).then(res => {
                // console.log(res)
                let data = res.data
                this.List = this.List.concat(data);

            })
        },
        getViewcount: function(flag) {
            //获取视图总数
            // console.log(this)
            http.get(urls.HQSTZS, {
                text: this.keyword,
                tag: '',
                loading:flag
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
                this.searchView(true)
            }
            if (this.allLoaded) { Toast('加载完'); }

            this.$refs.loadmore.onBottomLoaded();

        },
    },
    mounted() {
        this.getViewcount();
        this.searchView();
        
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.generalOverview {
    padding: 0rem 0.2rem;
}

.header {
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
        text-align: left;
    }
// input::-ms-input-placeholder{text-align: center;}
// input::-webkit-input-placeholder{text-align: center;}
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
}

.contentList {
    padding-top: 0.94rem;
    padding-bottom: 0.98rem;
    ul {
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