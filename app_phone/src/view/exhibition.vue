<template>
<!--总体概况  -->
<div class="exhibition">
 <header>
    <div class="header-left"><img src="../img/icon_nav_form.png"></div>
    <div class="header-title"><img src="../img/icon_refresh.png"><span>2分36秒刷新</span></div>
    <div class="header-right close">
        <span>北京路步行街</span>
        <img class="icon_arrow_d" src="../img/icon_arrow_d.png">
        <img class="icon_arrow_r" src="../img/icon_arrow_r.png">
        <ul class="header-menu">
            <li><img src="../img/icon_user.png"><span>你好!YOKI</span></li>
            <li><img src="../img/icon_out.png"><span>退出</span></li>
        </ul>
    </div>
</header>

<div class="view">
    <div class="view-detail">
        <section>
            <div class="section-title">实时统计</div>
            <div class="section-detail clear">
                <div class="card bg-purple">
                    <div class="card-detail">
                        <div class="card-left"><img src="../img/icon_statistics01.png"></div>
                        <div class="card-right">
                            <h3>近一个小累计客流量</h3>
                            <div class="total-num"><span>24905</span>人</div>
                            <div class="hori-line"></div>
                            <h3>对比昨日同时段</h3>
                            <div class="compare-group">
                                <div class="day day-1">昨日<span>20</span></div>
                                <div class="day day-2">今日<span>30</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="card-bottom"></div>
                </div>
                <div class="card bg-blue">
                    <div class="card-detail">
                        <div class="card-left"><img src="../img/icon_statistics02.png"></div>
                        <div class="card-right">
                            <h3>近一个小累计客流量</h3>
                            <div class="total-num"><span>24905</span>人</div>
                            <div class="hori-line"></div>
                            <h3>对比昨日同时段</h3>
                            <div class="compare-group">
                                <div class="day day-1">昨日<span>20</span></div>
                                <div class="day day-2">今日<span>30</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="card-bottom"></div>
                </div>
                <div class="card bg-green">
                    <div class="card-detail">
                        <div class="card-left"><img src="../img/icon_statistics03.png"></div>
                        <div class="card-right">
                            <h3>近一个小累计客流量</h3>
                            <div class="total-num"><span>24905</span>人</div>
                            <div class="hori-line"></div>
                            <h3>对比昨日同时段</h3>
                            <div class="compare-group">
                                <div class="day day-1">昨日<span>20</span></div>
                                <div class="day day-2">今日<span>30</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="card-bottom"></div>
                </div>
                <div class="card bg-red">
                    <div class="card-detail">
                        <div class="card-left"><img src="../img/icon_statistics04.png"></div>
                        <div class="card-right">
                            <h3>近一个小累计客流量</h3>
                            <div class="total-num"><span>24905</span>人</div>
                            <div class="hori-line"></div>
                            <h3>对比昨日同时段</h3>
                            <div class="compare-group">
                                <div class="day day-1">昨日<span>20</span></div>
                                <div class="day day-2">今日<span>30</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="card-bottom"></div>
                </div>
            </div>
        </section>
        <section>
            <div class="section-title">近一小时客流趋势</div>
            <div class="section-detail">
                <div class="chart">
                    <charts></charts>
                    <img src="../img/index_chart01.jpg">

                </div>
            </div>
        </section>
        <section>
            <div class="section-title">
                <div class="tab-menu">
                    <div class="tab-item"><span>展位客流量排名TOP10</span></div>
                    <div class="tab-item active"><span>楼层流量排名</span></div>
                </div>
            </div>
            <div class="section-detail">
                <div class="chart">
                    <img src="../img/index_chart02.jpg">
                </div>
            </div>
        </section>
        <section class="clear">
            <div class="section-half">
                <div class="section-title">新老参展人员对比</div>
                <div class="section-detail">
                    <div class="chart">
                        <img src="../img/index_chart03.jpg">
                    </div>
                </div>
            </div>
            <div class="section-half">
                <div class="section-title">入口人流</div>
                <div class="section-detail">
                    <div class="chart">
                        <img src="../img/index_chart04.jpg">
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>

<div class="mask"></div>
<div class="menu">
    <ul>
        <li class="menu-item active">
            <img class="img-active" src="../img/icon_sidebar01.png">
            <img class="img-noactive" src="../img/icon_sidebar01_white.png">
            <span>总体概况</span>
        </li>
        <li class="menu-item">
            <img class="img-active" src="../img/icon_sidebar02.png">
            <img class="img-noactive" src="../img/icon_sidebar02_white.png">
            <span>流量洞察</span>
        </li>
        <li class="menu-item">
            <img class="img-active" src="../img/icon_sidebar03.png">
            <img class="img-noactive" src="../img/icon_sidebar03_white.png">
            <span>热点图</span>
        </li>
        <li class="menu-item">
            <img class="img-active" src="../img/icon_sidebar04.png">
            <img class="img-noactive" src="../img/icon_sidebar04_white.png">
            <span>排行榜</span>
        </li>
        <li class="menu-item">
            <img class="img-active" src="../img/icon_sidebar05.png">
            <img class="img-noactive" src="../img/icon_sidebar05_white.png">
            <span>设备信息</span>
        </li>
        <li class="menu-item">
            <img class="img-active" src="../img/icon_sidebar06.png">
            <img class="img-noactive" src="../img/icon_sidebar06_white.png">
            <span>用户管理</span>
        </li>
        <li class="menu-item">
            <img class="img-active" src="../img/icon_sidebar07.png">
            <img class="img-noactive" src="../img/icon_sidebar07_white.png">
            <span>客户画像</span>
        </li>
    </ul>
    <ul class="user-info">
        <li class="menu-item user-item"><img src="../img/icon_user_white.png"><span>你好!YOKI</span></li>
        <li class="menu-item user-item"><img src="../img/icon_out_white.png"><span>退出</span></li>
    </ul>
</div>

</div>
</template>

<script>
//总体概况
import charts from 'components/charts'
export default {
  name: 'exhibition',
  components:{
      charts
  },
  data() {
    return {
    
    }
  },
  methods: {
  
    getinfo: function() {
    
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
