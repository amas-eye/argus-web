<template>
    <!-- 用户管理 -->
    <div class="userManage">
        <div class="generalTop">
            <div class="generalSearch">
                <button>搜索指引</button>
            </div>
            <div class="searchText inputfontwhite phwhite">
                <input class="search" v-model="compare" type="text" placeholder="请输入搜索关键字...">
                <el-select v-model="group" class="searchClass" placeholder="请选择用户组">
                    <el-option :label="'不限'" :value="'all'">
                    </el-option>
                    <el-option v-for="item in groups" :key="item.group_name" :label="item.group_name" :value="item.group_name">
                    </el-option>
                </el-select>
            </div>
            <div class="searchBtn">
                <button class='clickable' type='button' @click="getUsercount();searchUsers();page=1;">搜索</button>
            </div>
            <div class="remove">
                <button v-if="isadmin||isroot" @click="muldel" class='clickable' type='button'>删除</button>
            </div>
            <div class="addView">
                <button v-if="isadmin||isroot" class='clickable' type='button' @click="editView();editTitle='添加用户';">新增</button>
            </div>
        </div>
        <div class="generalContent">
            <table border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <td>
                            <el-checkbox @change="checkalluser" v-model="userallcheck" class="check"></el-checkbox>序号</td>
                        <td>账号</td>
                        <td>姓名</td>
                        <td>邮箱</td>
                        <td>用户组</td>
                        <td>创建时间</td>
                        <td v-if="isadmin||isroot">操作</td>
                    </tr>
                </thead>
                <tbody>
                    <tr :key="item._id" v-for="(item,index) in List">
                        <td>
                            <el-checkbox @change="selectuser(item)" v-model="item.check" :disabled="!(item.group_name!='admin'||isroot)" class="check"></el-checkbox>{{index+1}}</td>
                        <!-- 跳转指定的进程视图 -->
                        <td>{{item.username}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.mail}}</td>
                        <td>
                            {{item.group_name}}
                        </td>
                        <td>{{simdate.TMDTime(item.create_time)}}</td>
                        <td v-if="isadmin||isroot" class="operation">
                            <a v-if="item.group_name!='admin'||isroot" class='clickable' @click="editView(item,index);editTitle='编辑用户';" title="编辑"><i class="icon-edit"></i></a>
                            <a v-if="item.group_name!='admin'||isroot" class='clickable' @click="removeUser(item.username)" title="删除"><i class="icon-delete"></i></a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <pageIndicator :value.sync="page" :pagecount="usercount"></pageIndicator>
        <!--新增，编辑视图,组件-->
        <div class="edit_box">
            <el-dialog :title="editTitle" :visible.sync="dialogEditVisible" size="tiny" :before-close="handleEditClose">
                <div class="edit_content">
                    <div class="view_name clearfix">
                        <p class="left_title fl">账号</p>
                        <input class="fl" type="text" v-model="view_data.username" placeholder="请输入……">
                    </div>
                    <div v-if="isroot" class="view_name clearfix">
                        <p class="left_title fl">重置密码</p>
                        <input class="fl" type="password" v-model="view_data.password" placeholder="请输入……">
                    </div>
                    <div class="view_name clearfix">
                        <p class="left_title fl">姓名</p>
                        <input class="fl" type="text" v-model="view_data.name" placeholder="请输入……">
                    </div>
                    <div class="view_name clearfix">
                        <p class="left_title fl">电话</p>
                        <input class="fl" type="text" v-model="view_data.cell_phone" placeholder="请输入……">
                    </div>
                    <div class="view_name clearfix">
                        <p class="left_title fl">邮箱</p>
                        <input class="fl" type="text" v-model="view_data.mail" placeholder="请输入……">
                    </div>
                    <div class="view_name clearfix">
                        <p class="left_title fl">微信</p>
                        <input class="fl" type="text" v-model="view_data.wechat_id" placeholder="请输入……">
                    </div>
                    <div class="view_name clearfix">
                        <p class="left_title fl">Slack Hook</p>
                        <input class="fl" type="text" v-model="view_data.slack_hook" placeholder="请输入……">
                    </div>
                    <div class="view_name clearfix">
                        <p class="left_title fl">所属用户组</p>
                        <el-select v-model="view_data.group_name" class="fl" placeholder="请选择用户组">
                            <el-option v-for="item in groups" :key="item.group_name" :label="item.group_name" :value="item.group_name">
                            </el-option>
                        </el-select>
                        <!-- <input class="fl" type="text" v-model="view_data.group_name" placeholder="请输入……"> -->
                    </div>
                </div>
                <div class="bottom_btnBox">
                    <button v-if="editboxtype=='新增'" class="sureBtn clickable" @click="addUser">确定</button>
                    <button v-if="editboxtype=='编辑'" class="sureBtn clickable" @click="updateUser">确定</button>
                    <button class="cancleBtn clickable" @click="dialogEditVisible = false">取消</button>
                </div>
            </el-dialog>
        </div>
        <!--新增，编辑视图,组件-->
    </div>
</template>
<script>
    import http from 'service/myhttp'
    import urls from 'service/url'
    import _ from 'lodash'
    import pageIndicator from 'components/pageIndicator' //分页器
    import simdate from 'service/simdate'
    import {
        Message
    } from 'element-ui'; //信息弹窗
    export default {
        name: 'userManage',
        head: {
            title: {
                inner: '用户管理',
                // separator: '-',
                // complement: 'My Complement'
            }
        },
        components: {
            pageIndicator
        },
        data() {
            return {
                simdate: simdate,
                page: 1, //当前页码
                usercount: 0, // 视图总数
                items_num: 10, //一页显示个数
                editViewShow: false,
                editTitle: '', //编辑视图弹窗标题
                dialogEditVisible: false, //编辑视图显示隐藏
                groups: [], //所有分组
                compare: '', //搜索关键字
                group: '', //tag选择刷选（搜索）
                editboxtype: '', //编辑框类型（新增/编辑）
                editViewId: '', //编辑视图id
                userallcheck: false,
                checkedUsers: [], //多选用户名数组
                view_data: { //新增或编辑的视图数据
                    name: '', //用户名
                    username: '', //账号
                    password: '', //密码
                    group_name: [], // 分组名
                    mail: '', //邮箱地址
                    cell_phone: '', // 电话
                    wechat_id: '', // 微信ID
                    slack_hook: '', // slack 钩子
                },
                List: [ //监控视图数组
                    {
                        name: '', //视图名称
                        tags: [], //标签数组
                        creater: 'admin', //创建者
                        create_time: '' //创建时间
                    }
                ]
            }
        },
        computed: {
            // pagecount: function() {
            //     //页面总数 （每页10个）
            //     return parseInt(this.usercount / this.items_num) + (parseInt(this.usercount % this.items_num) > 0 ? 1 : 0)
            // }
            isadmin: function() {
                //是否系统管理员
                return this.$store.state.login_module.userinfo.group_name == "admin"
            },
            isroot: function() {
                //是否超级管理员
                let data = this.$store.state.login_module.userinfo.is_admin || false
                return data
            }
        },
        watch: {
            page: function(val) {
                //页号发生变化
                this.initInfo()
            }
        },
        methods: {
            checkalluser: function() {
                //全选所有用户
                if (this.userallcheck) {
                    this.List.forEach(user => {
                        if (user.group_name != "admin" || this.isroot) { //权限判断
                            user.check = true
                            this.selectuser(user)
                        }
                    })
                } else {
                    this.List.forEach(user => {
                        user.check = false
                    })
                    this.checkedUsers = []
                }
            },
            selectuser: function(user) {

              console.log('dfjkkdf',user.check);

              //alert('ookk')
                //选择用户
                if (user.check) {
                    this.checkedUsers.push(user.username)
                } else {
                    this.checkedUsers.forEach((item, index) => {
                        if (user.username == item) {
                            // console.info('check',item)
                            this.checkedUsers.splice(index, 1)
                        }
                    })
                }
            },
            muldel: function() {
                //多选删除
                if (this.checkedUsers.length < 1) {
                    Message({
                        message: '请选择用户',
                        type: 'error',
                        showClose: true
                    })
                } else {

                  //删除图表
                  this.$confirm('是否删除选中的数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {

                    http.post(urls.SCYH, {
                      deleteuser: this.checkedUsers,
                    }).then(res => {
                      // console.log(res)
                      this.userallcheck = false;
                      this.initInfo()
                      this.$message({
                        showClose: true,
                        message: '操作成功',
                        type: 'success'
                      })
                    })

                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '取消删除'
                    });
                  });


                }
            },
            editView: function(item, index) {
                //新增，编辑视图
                // var _that=this;
                // _that.editViewShow=true;
                // this.dialogVisible = true;
                // console.log(item)
                if (item) { //编辑
                    this.editboxtype = '编辑'
                    this.view_data = _.cloneDeep(item)
                    if (this.isroot) {
                        this.view_data.password = ''
                    }
                } else { //新增
                    this.editboxtype = '新增'
                    this.view_data = { //新增或编辑的视图数据
                        name: '', //用户名
                        username: '', //账号
                        password: '', //密码
                        group_name: '', // 分组名
                        mail: '', //邮箱地址
                        cell_phone: '', // 电话
                        wechat_id: '', // 微信ID
                        slack_hook: '', // slack 钩子
                    }
                }
                this.dialogEditVisible = true;
            },
            handleClose: function() {
                this.dialogVisible = false;
            },
            handleEditClose: function() {
                this.dialogEditVisible = false;
            },
            getgroups: function() {
                //获取分组数组
                http.get(urls.ZSZM).then(res => {
                    let data = res.data
                    this.groups = data
                })
            },
            getUsercount: function() {
                //获取用户总数
                http.get(urls.HQSYYS, {
                    compare: this.compare,
                    group: this.group,
                    items_num: this.items_num
                }).then(res => {
                    let data = res.data
                    this.usercount = data
                    // console.info('页数', this.usercount)
                })
            },
            searchUsers: function() {
                //搜索用户列表
                // console.log(this)
                http.get(urls.HQYHLB, {
                    compare: this.compare,
                    group: this.group,
                    page: this.page,
                    items_num: this.items_num
                }).then(res => {
                    let data = res.data

                    data.forEach((user) => {
                      user.check = false
                    })

                    this.List = data
                    console.info('用户列表', this.List)
                })
            },
            addUser: function() {
                //添加用户
                http.post(urls.TJYH, this.view_data).then(res => {
                    // console.log(res)
                    this.dialogEditVisible = false
                    this.initInfo()
                    this.$message({
                        showClose: true,
                        message: '操作成功',
                        type: 'success'
                    })
                })
            },
            updateUser: function() {
                //编辑更新用户
                http.post(urls.BJYHXX,
                    this.view_data //新数据
                ).then(res => {
                    // console.log(res)
                    this.dialogEditVisible = false
                    this.initInfo()
                    this.$message({
                        showClose: true,
                        message: '操作成功',
                        type: 'success'
                    })
                })
            },
            removeUser: function(account) {

              //删除图表
              this.$confirm('是否删除该条数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {

                //删除用户
                http.post(urls.SCYH, {
                  deleteuser: account,
                }).then(res => {
                  // console.log(res)
                  this.initInfo()
                  this.$message({
                    showClose: true,
                    message: '操作成功',
                    type: 'success'
                  })
                })

              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消删除'
                });
              });


            },
            initInfo: function() {
                //初始化数据
                this.getgroups()
                this.getUsercount()
                this.searchUsers()
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
    .search input::-webkit-input-placeholder,
    .searchClass input::-webkit-input-placeholder,
    {
        color: #c9e7ee;
        font-size: 0.9rem;
    }
    .generalSearch {
        float: left;
    }
    .check {
        float: left;
        margin-left: 0.8rem;
    }
    .generalSearch button {
        background: rgba(68, 67, 80, 0.6);
        width: 5rem;
        height: 1.5rem;
        border-radius: 0.3rem;
        line-height: 1.5rem;
        border-width: 0;
        font-size: 0.7rem;
        color: #fff;
        outline: none;
    }
    .searchText {
        float: left;
        width: 21.2rem;
        margin-left: 0.5rem;
        border-radius: 0.3rem;
        background: rgba(75, 77, 82, 0.31);
        height: 1.5rem;
        line-height: 1.1rem;
        padding: 0.2rem 0;
        box-sizing: border-box;
    }
    .searchText input {
        background: transparent;
        box-sizing: border-box;
        border-width: 0;
        outline: none;
        padding: 0 0.5rem;
        float: left;
        height: 100%;
        font-size: 0.7rem;
    }
    .search {
        width: 13.35rem;
        margin-left: -1px;
        border-right: 1px solid #84c7e2 !important;
    }
    .searchClass {
        width: 7.8rem
    }
    .searchBtn {
        float: left;
    }
    .searchBtn button {
        margin-left: 0.5rem;
        background: #57a0e8;
        width: 3.5rem;
        height: 1.5rem;
        border-radius: 0.3rem;
        line-height: 1.5rem;
        border-width: 0;
        font-size: 0.7rem;
        color: #fff;
        outline: none;
    }
    .addView {
        float: right;
    }
    .addView button {
        background: #53c1b9;
        width: 3.5rem;
        height: 1.5rem;
        border-radius: 0.3rem;
        line-height: 1.5rem;
        border-width: 0;
        font-size: 0.7rem;
        color: #fff;
        outline: none;
    }
    .remove {
        float: right;
        margin-left: 0.5rem;
    }
    .remove button {
        background: #c26564;
        width: 3.5rem;
        height: 1.5rem;
        border-radius: 0.3rem;
        line-height: 1.5rem;
        border-width: 0;
        font-size: 0.7rem;
        color: #fff;
        outline: none;
    }
    .generalContent {
        width: 61.5rem;
        height: 21.35rem;
        background: rgba(12, 17, 37, 0.25);
        clear: both;
        border-radius: 0.3rem;
        padding: 0 1rem 1rem 1rem;
        box-sizing: border-box;
    }
    .generalContent table {
        width: 100%;
    }
    .generalContent table .operation a {
        display: inline-block;
        height: 100%;
    }
    .generalContent table .operation i {
        color: #66a5ef;
    }
    .generalContent table .operation a:nth-child(1) {
        text-align: right;
    }
    .generalContent table .operation a:nth-child(2) {
        text-align: left;
    }
    .viewname {
        color: RGB(102, 168, 239) !important;
    }
    .icon-prepared {
        margin-right: 0.15rem;
    }
    .icon-delete {
        margin-left: 0.15rem;
    }
    .generalTop {
        margin-bottom: 0.5rem;
        overflow: hidden;
    }
    .generalContent table thead td {
        height: 1.75rem;
        line-height: 1.75rem;
        font-size: 0.75rem;
        color: #fff;
    }
    .generalContent table tbody td {
        height: 1.9rem;
        line-height: 1.9rem;
        font-size: 0.65rem; // font-weight: lighter;
        color: #fff;
    }
    .generalContent table tbody tr:nth-child(odd) {
        background: #526f8a;
    }
    .generalContent table tbody tr:nth-child(odd) td {
        border-top: 1px solid #3d556c;
        border-bottom: 1px solid #3d556c;
    }
    /*视图组件*/
    .addViewMask,
    .editViewMask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1000000;
    }
    .editView {
        background: #000;
        width: 27rem;
        padding: 0 2.5rem;
        height: 16.75rem;
        border-radius: 0.3rem;
        margin: 0 auto;
        position: relative;
        box-sizing: border-box;
        top: 50%;
        transform: translateY(-50%);
    }
    .MaskBtn {
        width: 5.8rem;
        height: 2rem;
        border-radius: 0.3rem;
        line-height: 2rem;
        border-width: 0;
        font-size: 0.45rem;
        color: #fff;
        outline: none;
        margin-top: 2.5rem;
    }
    .editViewOk {
        margin-right: 0.95rem;
        border: 1px solid #000;
        background: #57a0e8;
    }
    .editViewcancel {
        margin-left: 0.95rem;
        border: 1px solid #57a0e8;
        background: transparent;
    }
    .viewTitle {
        font-size: 1rem;
        color: #fff;
        padding: 1.6rem 0;
        text-align: center;
    }
    .viewNameText {
        width: 16.35rem;
        margin-left: 0.5rem;
        display: inline-block;
        line-height: 1.7rem;
        outline: none;
        color: #0da2c3;
        float: left;
        background: rgb(31, 38, 51);
        border: 0;
        font-size: 0.8rem;
        padding-left: 0.5rem;
        box-sizing: border-box;
    }
    .addViewText,
    .addViewLabeled span {
        display: inline-block;
        float: left;
        margin-left: 0.25rem;
        background: rgb(31, 38, 51);
        line-height: 1.7rem;
        width: 1.8rem;
    }
    .editViewMask .viewName {
        width: 5.4rem;
        display: inline-block;
        line-height: 1.7rem;
        text-align: center;
        color: #0da2c3;
        font-size: 0.8rem;
        float: left;
        background: rgb(31, 38, 51);
    }
    .editViewMask span {
        display: inline-block;
        height: 1.7rem;
    }
    .viewNameMask {
        text-align: left;
        overflow: hidden;
    }
    .addViewLabel,
    .addViewLabeled {
        margin-top: 0.25rem;
        overflow: hidden;
    }
    .addViewLabeled {
        margin-left: 5.65rem;
        text-align: left;
    }
    .addViewLabeled span {
        text-align: center;
    }
    .addViewLabeled span i {
        font-size: 0.8rem;
    }
    .addViewLabeled input {
        width: 14.25rem;
        line-height: 1.7rem;
        color: #0da2c3;
        font-size: 0.8rem;
        border-width: 0;
        outline: none;
        float: left;
        padding-left: 0.5rem;
        box-sizing: border-box;
        background: rgb(31, 38, 51);
    }
    .addViewLabeled .icon-delete {
        height: 1.7rem;
        line-height: 1.7rem;
        margin: 0;
        color: #fff;
    }
</style>
