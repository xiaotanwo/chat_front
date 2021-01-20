<template>
    <div>
        <!-- 扩展上边界 -->
        <el-row :gutter="20">
            <el-col :span="8" :offset="8">
                <div class="grid-content">
                </div>
            </el-col>
        </el-row>
        
        <el-row :gutter="20">
            <el-col :span="16" :offset="4">
                <el-container style="height: 700px; background-color: #2C3E50; opacity: 0.9">                    
                    <el-container>
                        <el-header style="text-align: center;">
                            <el-dropdown @command="handleCommand">
                                <span class="el-dropdown-link" style="color: #67C23A; font-size: 20px;">
                                    聊天室<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="quit">退出</el-dropdown-item>
                                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-header>
                        
                        <el-main style="margin: 5px 0; padding: 0 0 0 10px;">
                            <el-table :data="tableData">
                                <el-table-column prop="date" label="日期" width="140">
                                </el-table-column>
                                <el-table-column prop="name" label="姓名" width="120">
                                </el-table-column>
                                <el-table-column prop="address" label="地址">
                                </el-table-column>
                            </el-table>
                        </el-main>
                    </el-container>

                    <el-container style="height: 100%; width: 250px">
                        <el-header>
                             <Avatar
                                :username="headname"
                                background-color="#606266"
                                color="#409EFF"
                                style="vertical-align: middle;"
                                :inline="true">
                            </Avatar>
                        </el-header>
                        <el-main style="margin: 5px 0; padding: 0;">
                            <el-col>
                                <el-menu
                                    default-active="2"
                                    class="el-menu-vertical-demo"
                                    background-color="#545c64"
                                    text-color="#409EFF"
                                    active-text-color="#ffd04b"
                                    style="text-align: left; border-right: 0">
                                    <el-submenu index="1">
                                        <template slot="title">
                                            <!-- <i class="el-icon-location"></i> -->
                                            <span>聊天室</span>
                                        </template>
                                        <el-menu-item index="1-1">北京</el-menu-item>
                                        <el-menu-item index="1-2">上海</el-menu-item>
                                        <el-menu-item index="1-3">广州</el-menu-item>
                                        <el-menu-item index="1-4">深圳</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="2">
                                        <template slot="title">
                                            <!-- <i class="el-icon-location"></i> -->
                                            <span>群聊</span>
                                        </template>
                                        <el-menu-item index="1-1" style="color: #67C23A">新建群聊</el-menu-item>
                                        <el-menu-item index="1-2" style="color: #67C23A">加入群聊</el-menu-item>
                                        <el-menu-item index="1-3">西三游泳群</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="3">
                                        <template slot="title">
                                            <!-- <i class="el-icon-location"></i> -->
                                            <span>好友</span>
                                        </template>
                                        <el-menu-item index="1-1" style="color: #67C23A">添加好友</el-menu-item>
                                        <el-menu-item index="1-2" style="color: #67C23A">好友申请</el-menu-item>
                                        <el-menu-item index="1-3">一二三四五六七八九十</el-menu-item>
                                    </el-submenu>
                                </el-menu>
                            </el-col>
                        </el-main>
                        <el-footer style="padding-top: 10px">
                            <el-button type="danger" round>退出</el-button>
                        </el-footer>
                    </el-container>
                </el-container>
            </el-col>
        </el-row>

    </div>
</template>

.element::-webkit-scrollbar {display:none}

<script>
    import Avatar from 'vue-avatar'
    export default {
        components:{
            Avatar
        },
        created() {
            this.username = this.$route.query.username;
            this.headname = this.username[0] + ' ' + this.username[1];
        },
        data() {
            const item = {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            };
            return {
                tableData: Array(20).fill(item),
                username: '',
                headname: '',
            }
        },
    };
</script>

<style>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .el-header {
    color: #ffffff;
    line-height: 60px;
  }

  /* chrome浏览器隐藏滑动条，其他的浏览器就算了，前端从入门到放弃 */
  .el-main::-webkit-scrollbar {
    display: none;
  }
</style>