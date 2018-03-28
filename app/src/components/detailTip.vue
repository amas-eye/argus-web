<template>
    <!--分页器-->
    <div class="detailTip" :style="{backgroundColor: obj.color,borderColor:obj.color}">
        <div class="right">
         {{obj.name + '(' + obj.count + ')'}}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'detailTip',
        props: {
          obj:{
            type:Object,
            default:function(){
              return {
                color:'yellow'
              }
            }
          },
          color:{
            type:String,
            default:'yellow'
          }
        },
        data() {
            return {}
        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped>
.detailTip {
    color: white;
    border-radius: 0.5rem;
    border:0.1rem solid yellow;
    font-size: 0.6rem;
    box-sizing: border-box;
    width: 6.0rem;
    height: 1rem;
    padding-left: 0.35rem;
    // background-color: yellow; 
    overflow: hidden;

    .right {
      background-color: #526f8a;
      height: 0.8rem;
      line-height: 0.8rem;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space:nowrap;
      // display: -webkit-box;
      // -webkit-line-clamp: 1;
      // -webkit-box-orient: vertical;
      // word-wrap: break-word;

      padding: 0 0.1rem;

    }
}
</style>
