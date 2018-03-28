<template>
    <!-- 权限管理 -->
    <div class="powerManage">
        <div class="usergroup">
            <div class="title">用户组列表
                <div class="add clickable" @click="showaddgroup"><i class="icon-poewradd"></i></div>
            </div>
            <div class="list">
                <div :class="{'active':editpower_name==group.group_name}" :key="group._id" @click="editpower(group)" v-for="(group,index) in groupdatalist" class="item clickable phwhite">
                    <!--列表项-->
                    <span v-show="!group.edittype" class="name">{{group.group_name}}</span>
                    <input v-show="group.edittype" @click.stop :class="{editactive:group.edittype}" @blur="editgroup_ok(group)" v-model="group.group_name" type="text" placeholder="请输入名字..." />
                    <div class="tools">
                        <i v-if="group.group_name!=admin" @click.stop="editgroup(group)" class="icon-edit clickable" title="编辑"></i>
                        <i v-if="group.group_name!=admin" @click.stop="delgroup(index,group)" class="icon-delete clickable" title="删除"></i>
                    </div>
                </div>
                <div v-show="newitemshow" class="newitem phwhite">
                    <!--新列表项-->
                    <input v-model="newgroupname" class="" type="text" placeholder="请输入名字..." />
                    <div class="tools">
                        <button @click="addgroup" class="ok clickable" type="button">确认</button>
                        <button @click="hideaddgroup" class="cancel clickable" type="button">取消</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="powergroup">
            <div class="title">权限列表</div>
            <div class="list">
                <div class="item">
                    <div class="checkitem name">
                        <!-- <el-checkbox @change="check_all('dashboard')" v-model="checkall.dashboard" class="check clickable"></el-checkbox> -->
                        总体概况
                    </div>
                    <div class="checkitem read">
                        <el-radio :disabled="editpower_name==admin||(!isadmin&&!isroot)" class="check" v-model="editpowerdata.dashboard" label="r">只读</el-radio>
                        <!-- <el-checkbox v-model="editpowerdata.dashboard.read" class="check clickable"></el-checkbox> -->
                        <!-- 只读 -->
                    </div>
                    <!-- <div class="checkitem write">
                                                    <el-checkbox :disabled="'true'" v-model="editpowerdata.dashboard.write" class="check clickable"></el-checkbox>
                                                    只读
                                                </div> -->
                </div>
                <div class="item">
                    <div class="checkitem name">
                        <!-- <el-checkbox @change="check_all('jk')" v-model="checkall.jk" class="check clickable"></el-checkbox> -->
                        监控
                    </div>
                    <div class="checkitem read">
                        <el-radio :disabled="editpower_name==admin||(!isadmin&&!isroot)" class="check" v-model="editpowerdata.jk" label="rw">读写</el-radio>
                        <!-- <el-checkbox v-model="editpowerdata.jk.read" class="check clickable"></el-checkbox> -->
                        <!-- 读写 -->
                    </div>
                    <div class="checkitem write">
                        <el-radio :disabled="editpower_name==admin||(!isadmin&&!isroot)" class="check" v-model="editpowerdata.jk" label="r">只读</el-radio>
                        <!-- <el-checkbox v-model="editpowerdata.jk.write" class="check clickable"></el-checkbox> -->
                        <!-- 只读 -->
                    </div>
                </div>
                <div class="item">
                    <div class="checkitem name">
                        <!-- <el-checkbox @change="check_all('alert')" v-model="checkall.alert" class="check clickable"></el-checkbox> -->
                        告警
                    </div>
                    <div class="checkitem read">
                        <el-radio :disabled="editpower_name==admin||(!isadmin&&!isroot)" class="check" v-model="editpowerdata.alert" label="rw">读写</el-radio>
                        <!-- <el-checkbox v-model="editpowerdata.alert.read" class="check clickable"></el-checkbox> -->
                        <!-- 读写 -->
                    </div>
                    <div class="checkitem write">
                        <el-radio :disabled="editpower_name==admin||(!isadmin&&!isroot)" class="check" v-model="editpowerdata.alert" label="r">只读</el-radio>
                        <!-- <el-checkbox v-model="editpowerdata.alert.write" class="check clickable"></el-checkbox> -->
                        <!-- 只读 -->
                    </div>
                </div>
                <div class="item">
                    <div class="checkitem name">
                        <!-- <el-checkbox @change="check_all('caiji')" v-model="checkall.caiji" class="check clickable"></el-checkbox> -->
                        采集管理
                    </div>
                    <div class="checkitem read">
                        <el-radio :disabled="editpower_name==admin||(!isadmin&&!isroot)" class="check" v-model="editpowerdata.caiji" label="rw">读写</el-radio>
                        <!-- <el-checkbox v-model="editpowerdata.caiji.read" class="check clickable"></el-checkbox> -->
                        <!-- 读写 -->
                    </div>
                    <div class="checkitem write">
                        <el-radio :disabled="editpower_name==admin||(!isadmin&&!isroot)" class="check" v-model="editpowerdata.caiji" label="r">只读</el-radio>
                        <!-- <el-checkbox v-model="editpowerdata.caiji.write" class="check clickable"></el-checkbox> -->
                        <!-- 只读 -->
                    </div>
                </div>
                <div class="item">
                    <div class="checkitem name">
                        <!-- <el-checkbox @change="check_all('chain')" v-model="checkall.chain" class="check clickable"></el-checkbox> -->
                        调用链监控
                    </div>
                    <div class="checkitem read">
                        <el-radio :disabled="editpower_name==admin||(!isadmin&&!isroot)" class="check" v-model="editpowerdata.chain" label="rw">读写</el-radio>
                        <!-- <el-checkbox v-model="editpowerdata.chain.read" class="check clickable"></el-checkbox> -->
                        <!-- 读写 -->
                    </div>
                    <div class="checkitem write">
                        <el-radio :disabled="editpower_name==admin||(!isadmin&&!isroot)" class="check" v-model="editpowerdata.chain" label="r">只读</el-radio>
                        <!-- <el-checkbox v-model="editpowerdata.chain.write" class="check clickable"></el-checkbox> -->
                        <!-- 只读 -->
                    </div>
                </div>
            </div>
        </div>
        <div class="maintools">
            <button :disabled="!isadmin&&!isroot" @click="saveInfo()" class="save clickable" type="button">保存</button>
        </div>
    </div>
</template>
<script>
    import http from 'service/myhttp'
    import urls from 'service/url'
    import simdate from 'service/simdate'
    import _ from 'lodash'
    import {
        Message
    } from 'element-ui'; //信息弹窗
    export default {
        name: 'powerManage',
        head: {
            title: {
                inner: '权限管理'
            }
        },
        components: {},
        data() {
            return {
                isSubmiting:false,//是否正在提交，正在提交禁止按钮重复点击
                admin:'admin', //系统管理员分组名
                groupdatalist: [], //分组数组
                newitemshow: false, //新分组添加框显示
                newgroupname: '', //新分组名
                editname: '', //编辑的分组名字
                editpower_name: '', //编辑权限组名
                delgroupids: [], //删除分组id数组
                editpowerdata: { //编辑权限
                    dashboard: 'r',
                    jk: 'r',
                    alert: 'r',
                    caiji: 'r',
                    chain: 'r'
                }
                // editpowerdata: { //编辑权限
                //     dashboard: { //总体概况
                //         read: false,
                //         // write: false
                //     },
                //     jk: { //监控
                //         read: false,
                //         write: false
                //     },
                //     alert: { //告警
                //         read: false,
                //         write: false
                //     },
                //     caiji: { //采集
                //         read: false,
                //         write: false
                //     },
                //     chain: { //调用链
                //         read: false,
                //         write: false
                //     }
                // }
            }
        },
        computed: {
            isadmin:function(){
                //是否系统管理员
                return this.$store.state.login_module.userinfo.group_name=="admin"
            },
            isroot:function(){
                //是否超级管理员
                let data=this.$store.state.login_module.userinfo.is_admin||false
                return data
            },
            checkall: {
                get: function() {
                    return { //全选
                        dashboard: this.editpowerdata.dashboard.read,
                        jk: this.editpowerdata.jk.read && this.editpowerdata.jk.write,
                        alert: this.editpowerdata.alert.read && this.editpowerdata.alert.write,
                        caiji: this.editpowerdata.caiji.read && this.editpowerdata.caiji.write,
                        chain: this.editpowerdata.chain.read && this.editpowerdata.chain.write
                    }
                },
                set: function(val) {
                    //     console.info('set',val)
                    //     this.checkall=val
                    //     this.editpowerdata.dashboard.read = val.dashboard
                    //     this.editpowerdata.jk.read = val.jk
                    //     this.editpowerdata.jk.write = val.jk
                    //     this.editpowerdata.alert.read = val.alert
                    //     this.editpowerdata.alert.write = val.alert
                    //     this.editpowerdata.caiji.read = val.caiji
                    //     this.editpowerdata.caiji.write = val.caiji
                    //     this.editpowerdata.chain.read = val.chain
                    //     this.editpowerdata.chain.write = val.chain
                }
            }
        },
        watch: {},
        methods: {
            // canedit:function(group){
            //     //可编辑
            //    return group.edittype==false?'ture':'false'
            // },
            // check_all: function(mode) {
            //     //选择所有
            //     console.info('sd', mode)
            //     this.editpowerdata[mode] = {
            //         read: this.checkall[mode],
            //         write: this.checkall[mode]
            //     }
            // },
            showaddgroup: function() {
                //显示添加分组
                this.newitemshow = true
            },
            hideaddgroup: function() {
                //隐藏添加分组
                this.newitemshow = false
                this.newgroupname = ''
            },
            getgroups: function() {
                //获取所有分组及权限
                http.get(urls.HQSYZQX).then(res => {
                    console.info('获取所有分组', res)
                    let data = res.data
                    //分组列表
                    data.forEach((item, index) => {
                        //添加编辑状态
                        if (index == 0) {
                            this.editpower_name = data[0].group_name
                            this.editpowerdata = data[0].group_privilieged
                        }
                        item.edittype = false
                    })
                    this.groupdatalist = data
                })
            },
            addgroup: function() {
                //添加分组

                if (this.newgroupname != ''&&!_.find(this.groupdatalist, { 'group_name': this.newgroupname })) {
                    this.groupdatalist.push({
                        group_name: this.newgroupname,
                        edittype: false,
                        group_privilieged: { //编辑权限
                            dashboard: 'r',
                            jk: 'r',
                            alert: 'r',
                            caiji: 'r',
                            chain: 'r'
                        }
                    })
                    this.hideaddgroup()
                } else {
                    Message({
                        message: '名字不能为空且不能重复',
                        type: 'error',
                        showClose: true
                    })
                }
            },
            editgroup: function(group) {
                //编辑分组
                console.info('编辑', group.edittype)
                group.edittype = true
                console.info('编辑', group.edittype)
            },
            delgroup: function(num, group) {

              //删除图表
              this.$confirm('是否删除该条数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                //删除分组
                this.groupdatalist.splice(num, 1) //删除并返回项
                if (typeof(group._id) != "undefined") {
                  //有id进删除数组
                  this.delgroupids.push(group._id)
                }

              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消删除'
                });
              });

            },
            editgroup_ok: function(group) {
                //编辑确认
                console.info('dasd')
                if (group.group_name != '') {
                    group.edittype = false
                } else {
                    Message({
                        message: '名字不能为空',
                        type: 'error',
                        showClose: true
                    })
                }
            },
            editpower: function(group) {
                //编辑权限
                this.editpower_name = group.group_name
                this.editpowerdata = group.group_privilieged
                // http.get(urls.HDZQX, {
                //     groupname: name
                // }).then(res => {
                //     let data = res.data[0].group_privilieged
                //     this.editpowerdata = data
                // })
            },
            saveInfo: function() {
                if(this.isSubmiting) return;
                this.isSubmiting = true;
                //保存信息
                http.post(urls.XGYHZ, {
                    changeGroup: this.groupdatalist,
                    delGroup: this.delgroupids
                }).then(res => {
                  this.isSubmiting = false;
                  this.$router.go(0);
                }).catch((error) => {
                  this.isSubmiting = false;
                })
            },
            initInfo: function() {
                //初始化数据
                this.getgroups()
            }
        },
        mounted() {
            //挂载时
            this.initInfo()
        },
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .powerManage {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .usergroup {
        width: 18rem;
        height: 24.2rem;
        background: rgba(12, 17, 37, 0.25);
        border-radius: 0.3rem;
    }
    .powergroup {
        width: 42.5rem;
        height: 24.2rem;
        background: rgba(12, 17, 37, 0.25);
        border-radius: 0.3rem;
    }
    .usergroup .title,
    .powergroup .title {
        text-align: left;
        color: #fff;
        font-size: 0.9rem;
        height: 2.5rem;
        line-height: 2.5rem;
        padding-left: 1rem;
        background: rgba(12, 17, 37, 0.3);
        border-radius: 0.3rem 0.3rem 0 0;
    }
    .usergroup .list {
        height: 21.7rem;
        overflow: auto;
    }
    .usergroup .list .item {
        width: 100%;
        height: 2rem;
        box-sizing: border-box;
        color: #fff;
        background: rgba(12, 17, 37, 0.2);
        text-align: left;
        line-height: 2rem;
        padding: 0rem 0.5rem 0rem 1rem;
        margin-bottom: 0.05rem;
    }
    .usergroup .list .item.active {
        background: rgba(12, 17, 37, 0.5);
    }
    .usergroup .list .item .name {
        // display: none;
        font-size: 0.8rem;
    }
    .usergroup .list .item input {
        /* display: none; */
        width: 8rem;
        height: 1.4rem;
        background: transparent;
        border: 1px solid #909a9e;
        box-sizing: border-box;
        padding-left: 0.5rem;
        color: #fff;
        font-size: 0.8rem;
    }
    .usergroup .list .item .tools {
        font-size: 0.8rem;
        color: #13d5ff;
        float: right;
    }
    .usergroup .list .item .tools i:nth-last-child(n+2) {
        margin-right: 0.2rem;
    }
    .usergroup .list .newitem {
        width: 100%;
        height: 5rem;
        box-sizing: border-box;
        color: #fff;
        background: rgba(12, 17, 37, 0.2);
        text-align: left;
        line-height: 2rem;
        padding: 0rem 0.5rem 0rem 1rem;
    }
    .usergroup .list .newitem input {
        width: 8rem;
        height: 1.4rem;
        background: transparent;
        border: 1px solid #909a9e;
        box-sizing: border-box;
        padding-left: 0.5rem;
        color: #fff;
        font-size: 0.8rem;
    }
    .usergroup .list .newitem .tools {
        margin-top: 0.7rem;
    }
    .usergroup .list .newitem .tools button {
        width: 4.5rem;
        height: 1.6rem;
        font-size: 0.8rem;
        border-radius: 0.2rem;
    }
    .usergroup .list .newitem .tools button:nth-last-child(n+2) {
        margin-right: 0.5rem;
    }
    .usergroup .list .newitem .tools button.ok {
        background: #52a8ad;
        border: 0.05rem solid #52a8ad;
        color: #ffffff;
    }
    .usergroup .list .newitem .tools button.cancel {
        background: transparent;
        border: 0.05rem solid #52a8ad;
        color: #ffffff;
    }
    .title .add {
        float: right;
        margin-right: 0.5rem;
        font-size: 1rem;
    }
    .powergroup .list {
        width: 30.65rem;
        padding-top: 2.5rem;
        margin: auto;
        display: flex;
        flex-wrap: wrap;
    }
    .powergroup .list .item {
        text-align: center;
        width: 10rem;
        margin-bottom: 4.6rem;
    }
    .powergroup .list .item .checkitem {
        color: #fff;
    }
    .powergroup .list .item .name {
        margin-bottom: 0.9rem;
    }
    .powergroup .list .item .read {
        margin-bottom: 1.2rem;
        padding-left: 4.5rem;
    }
    .powergroup .list .item .write {
        padding-left: 4.5rem;
    }
    .powergroup .list .item .checkitem .check {
        margin-right: 0.5rem;
        color: #fff;
        font-size: 0.8rem !important;
    }
    .maintools {
        width: 100%;
        height: 3rem;
        line-height: 4rem;
    }
    .maintools .save {
        width: 4.5rem;
        height: 1.6rem;
        font-size: 0.8rem;
        border-radius: 0.2rem;
        background: #649de7;
        border: 0.05rem solid #649de7;
        color: #ffffff;
    }
</style>
