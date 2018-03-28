<template>
    <div class="box_c">
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :bottomPullText='bottomText' @top-status-change="handleTopChange" ref="loadmore" :bottomDistance="50">
            <div>
                <ul :style="{height: key * 150 + 'px' }">
                    <li v-for="(val,index) in key">
                        <h2>{{index}}</h2>
                    </li>
                </ul>
            </div>
        </mt-loadmore>
    </div>
</template>
<script>
import urls from 'service/url'
import http from 'service/myhttp'
import simdate from 'service/simdate'
import { Indicator, Loadmore } from 'mint-ui';

export default {
    name: 'test',
    components: {

    },
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            allLoaded: false,
            bottomText: '上拉加载更多...',
            scrollMode: "auto",
            topStatus: '',
            list: [],
            key: 10

        }
    },
    methods: {

        loadBottom: function() { // 加载更多数据的操作
            //load data

            //this.allLoaded = true;// 若数据已全部获取完毕
            var self = this;
            setTimeout(function() {
                var i = 0;
                var len = 10;
                for (; i < len; i++) {
                    self.list.push('dddd' + i);

                }
                self.key = self.key + 10;
                self.$refs.loadmore.onBottomLoaded();
            }, 2000);


        },

        loadTop() {
            this.$refs.loadmore.onTopLoaded();
            // this.$broadcast('onTopLoaded', id);
        },
        handleTopChange: function(status) {
            this.topStatus = status;
        },

    },
    mounted() {

    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.box_c {}

// height: 100%;
// overflow-y: scroll; // background-color: gray;
// -webkit-overflow-scrolling : touch;
ul {
    li {
        height: 150px;
        border-bottom: 1px solid red;
    }
    padding-bottom: 0.98rem; 
}
</style>