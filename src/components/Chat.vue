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
                        
                        <el-main style="margin: 5px 0; padding: 0 0 0 10px; width: 1100px">
                        </el-main>

                        <el-footer style="height: 130px; padding: 5px 0 0 10px;">
                            <el-input
                                style="background-color: #000"
                                maxlength=300
                                @keyup.native="toSend($event)"
                                @keydown.shift.native="downshift"
                                resize="none"
                                type="textarea"
                                :rows="5"
                                placeholder="请输入聊天内容。 Enter 发送，Shift + Enter 换行"
                                v-model="chat_text">
                            </el-input>
                        </el-footer>
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
                                            <span>聊天室</span>
                                        </template>
                                        <el-menu-item index="1-1">北京</el-menu-item>
                                        <el-menu-item index="1-2">上海</el-menu-item>
                                        <el-menu-item index="1-3">广州</el-menu-item>
                                        <el-menu-item index="1-4">深圳</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="2">
                                        <template slot="title">
                                            <span>群聊</span>
                                        </template>
                                        <el-menu-item index="1-1" style="color: #67C23A">新建群聊</el-menu-item>
                                        <el-menu-item index="1-2" style="color: #67C23A">加入群聊</el-menu-item>
                                        <el-menu-item index="1-3">西三游泳群</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="3">
                                        <template slot="title">
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
                            <el-button type="danger" round @click="logout">退出</el-button>
                        </el-footer>
                    </el-container>
                </el-container>
            </el-col>
        </el-row>

    </div>
</template>

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
            return {
                username: '',
                headname: '',
                chat_text: '',
                shift_flag: false,
            }
        },
        methods: {
            // 注销
            logout() {
                this.$http.post(
                    "http://localhost/user/logout"
                ).then((res)=>{
                    if (res.data.ret) {
                        this.alertSuccess(res.data.msg);
                    } else {
                        this.alertError(res.data.msg);
                    }
                    this.$router.replace("/login")
                }).catch((res) => {
                    this.alertError("网络出现故障，请稍后再尝试！");
                });
            },

            // 聊天室的操作
            handleCommand(command) {
                if (command == 'quit') {
                    this.alertSuccess("退出聊天室成功！");
                } else if (command == 'delete') {
                    this.alertSuccess("删除聊天室成功！");
                }
            },

            // 发送聊天信息
            toSend(event) {
                // 监听回车事件
                if (!this.shift_flag && event.keyCode == 13) {
                    this.chat_text = this.chat_text.trim();
                    if (this.chat_text == '') {
                        this.alertError("聊天信息不嫩为空！");
                        return;
                    }
                    this.alertSuccess("发送成功！");
                    this.chat_text = '';
                } else if (event.keyCode == 16) {
                    this.shift_flag = false;
                }
            },

            // 设置shift标志
            downshift() {
                this.shift_flag = true;
            },

            // 输出错误提示
            alertError(msg) {
                this.$message.error(
                    {
                        message: msg,
                        center: true,
                    }
                );
            },

            // 输出正确提示
            alertSuccess(msg) {
                this.$message.success(
                    {
                        message: msg,
                        center: true,
                    }
                );
            },
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
</style>