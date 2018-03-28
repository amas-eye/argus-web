<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import init from 'service/initialize'
  export default {
    name: 'app',
    mounted() {
      init(this.$store)
    },
  }
</script>

<style lang="less">
  @import 'css/style-index.css';
  @import '~vux/src/styles/reset.less';
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    /* background-color: #fff; */
    /* margin-top: 60px; */
  }
</style>
