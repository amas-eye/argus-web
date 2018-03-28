<template>
    <div class="timeselect" v-if="show" @click.self="cancleClcik">
        <div class="box_container">
            <div class="box">
                <div class="input_box">
                    <p class="start_title">开始时间：</p>
                    <div class="start_div" @click.stop='openstartPicker'>
                        {{startValue==='2007-1-1 0:00' ? '' : startValue}}
                    </div>
                    <p class="end_title">结束时间：</p>
                    <div class="end_div" @click.stop='openendPicker'>{{endValue==='2007-1-1 0:00' ? '' : endValue}}</div>
                    <div class="frequency_box" v-if="showReloadhz">
                        <p class="end_title">刷新频率：</p>
                        <select v-model="reloadhzVule">
                          <option v-for="(val,index) in hzArry" :value="val.value">{{val.label}}</option>
                        </select>
                    </div>
                </div>
                <div class="btn_box">
                    <button class="sure_btn" @click.stop="submitClcik">提交</button>
                    <button @click.stop="cancleClcik">取消</button>
                    <div class="line"></div>
                </div>
            </div>
        </div>
        <mt-datetime-picker ref="startpicker" type="datetime-picker" v-model="startpickerValue" @confirm="starthandleConfirm" :startDate="defaultDate()">
        </mt-datetime-picker>
        <mt-datetime-picker :startDate="defaultDate()" ref="endpicker" type="datetime-picker" v-model="endpickerValue" @confirm="endhandleConfirm">
        </mt-datetime-picker>
    </div>
</template>
<script>
import { DatetimePicker } from 'mint-ui';
import simdate from 'service/simdate'
export default {
    name: 'timeselect',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        hzArry:{
          type:Array,
          default:function(){
            return []
          }
        },
        datetime:{
          type:Object,
          default:function(){
            return {
              start: simdate.day7_ago(),
              end: simdate.today(),
              reloadhz:0              
            }           
          }
        },
        showReloadhz:{
            type:Boolean,
            default:true
        }
    },
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            startpickerValue: '',
            endpickerValue: '',
            reloadhzVule:0,

        }
    },
    methods: {
        defaultDate:function(){
         return new Date(2016, 0, 1);   
        },
        submitClcik: function() {
            this.$emit('submitClick',{start:this.startpickerValue,end:this.endpickerValue,reloadhz:this.reloadhzVule});
        },
        cancleClcik: function() {
            this.$emit('close');
        },
        openstartPicker() {
            this.$refs.startpicker.open();
        },
        openendPicker() {
            this.$refs.endpicker.open();
        },
        starthandleConfirm() {
            // console.log(simdate.TMDTime2(this.startpickerValue));
        },
        endhandleConfirm() {

        }
    },
    computed: {
        startValue: function() {
            if (this.startpickerValue) {
                return simdate.TMDTime2(this.startpickerValue)
            } else {
                return ''
            }
        },
        endValue: function() {
            if (this.endpickerValue) {
                return simdate.TMDTime2(this.endpickerValue)
            } else {
                return ''
            }
        }
    },
    watch:{
      datetime: {
              handler: function (val, oldVal) {
                this.startpickerValue = val.start;
                this.endpickerValue = val.end;
                this.reloadhzVule = val.reloadhz;
              },
              deep: true
      }
    }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.timeselect {
    z-index: 2002;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    overflow: auto;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

@keyframes zoom {
    from {
        transform: scale(0.3)
    }
    to {
        transform: scale(1)
    }
}


.box_container {
    -webkit-animation-name: zoom;
    -webkit-animation-duration: 0.3s;
    animation-name: zoom;
    animation-duration: 0.3s;
    border-radius: 0.3rem;
    padding: 0 0.2rem;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    margin-top: -2.13rem; // transform:translate3d(0,-50%,0);
    // transition:all 0.2s;
    .box {
        border-radius: 0.1rem;
        overflow: hidden;
        background-color: #fff;
        .input_box {
            background-color: #fff;
            padding: 0.2rem 0.2rem 0;
            p {
                text-align: left;
                height: 0.5rem;
                line-height: 0.5rem;
                font-size: 0.28rem;
            }
            .start_div,
            .end_div {
                height: 0.88rem;
                background-color: #f0f4fa;
                line-height: 0.88rem;
                text-align: left;
            }
            .frequency_box {
                margin-top: 0.2rem;
                text-align: left;
                select {
                    height: 0.88rem;
                    background-color: #f0f4fa;
                    line-height: 0.88rem;
                    text-align: left;
                    width: 100%;
                    box-sizing: border-box;
                }
            }
            .end_title {
                margin-top: 0.2rem;
            }
        }
    }
    .btn_box {
        margin-top: 0.2rem;
        border-top: 0.02rem solid #d7d7d7;
        display: flex;
        width: 100%;
        position: relative;
        >button {
            background-color: #fff;
            width: 50%;
            height: 0.88rem;
            line-height: 0.88rem;
            box-sizing: border-box;
            font-size: 0.28rem;
            border-radius: 0;
        }
        .sure_btn {
            color: #26a2ff;
        }
        .line {
            width: 0.02rem;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 50%;
            margin-left: 0.01rem;
            background-color: #d7d7d7;
        }
    }
}
</style>