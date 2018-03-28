<template>
    <div class="searchInput">
        <div class="middle" @click="middleClcik" v-show="!showInput">
            <img src="../assets/search.png" />
            <span>搜索</span>
        </div>
        <input class="text_input" v-model.trim="word" v-show="showInput" type="text" name="tt" placeholder="搜索" ref="textInput" v-focus="focusState" @keyup.enter="enterclick" />
    </div>
</template>
<script>
export default {
    name: 'searchInput',
    components: {

    },
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            showInput: true,
            focusState: false,
            word: '',
            handleScroll: null
        }
    },
    methods: {
        middleClcik: function() {
            this.focusState = true;
            this.showInput = true;
            this.$refs.textInput.focus();
        },
        enterclick: function() {
            this.$emit('searchText', this.word);
            this.handleScroll();
        }

    },
    mounted() {
        var _this = this;
        var handleScroll = function() {
            _this.focusState = false;
            _this.$refs.textInput.blur();
        };
        document.body.addEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScroll);
        document.getElementById('html').addEventListener('scroll', handleScroll);
        _this.handleScroll = handleScroll;
    },
    destroyed() {
        document.body.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('scroll', this.handleScroll);
        document.getElementById('html').removeEventListener('scroll', this.handleScroll);
        this.handleScroll = null;
    },
    directives: {
        focus: {
            update: function(el, { value }) {
                if (value) {
                    el.focus()
                }
            }
        }
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.searchInput {
    width: 100%;
    .middle {
        border-radius: 0.1rem;
        height: 0.54rem;
        background-color: #edf0f2;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        >img {
            width: 0.3rem;
            height: 0.3rem; // background-color: red;
        }
        >span {
            font-size: 0.24rem;
            color: #a6a6a6;
            margin-left: 0.15rem;
        }
    }
    .text_input {
        border-radius: 0.1rem;
        height: 0.54rem;
        width: 100%;
        padding-left: 0.57rem;
        box-sizing: border-box;
        text-align: left;
        background: url('../assets/search.png') no-repeat #edf0f2;
        background-position: 0.12rem center;
        background-size: 0.3rem 0.3rem;
    }
    input::-webkit-input-placeholder {
        color: #a6a6a6;
        font-size: 0.24rem;
    }
    input::-moz-placeholder {
        color: #a6a6a6 !important;
        opacity: 1 !important;
    }
}
</style>