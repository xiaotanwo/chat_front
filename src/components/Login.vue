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
            <el-col :span="8" :offset="8">
                <div class="grid-content" style="opacity: 0.9">
                    <!-- 扩展上边界 -->
                    <el-row :gutter="20">
                        <el-col :span="8" :offset="8">
                            <div class="grid-content">
                            </div>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="20" :offset="2">
                            <div class="grid-content">
                                <h1 style="color:#409EFF">
                                    聊天室 —— 登录
                                </h1>
                            </div>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="14" :offset="5">
                            <div>
                                <el-input placeholder="请输入昵称" v-model="input_name" clearable
                                @keydown.enter.native="toLogin">
                                </el-input>
                            </div>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="14" :offset="5">
                            <div>
                                <el-input placeholder="请输入密码" v-model="input_password" show-password
                                @keydown.enter.native="toLogin">
                                </el-input>
                            </div>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="16" :offset="4">
                            <div class="grid-content">
                                <el-button type="primary" :loading="this.load" round @click="toLogin">
                                  {{login_tip}}
                                </el-button>
                                <el-button type="success" round @click="toRegister">
                                  注册
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>

                  <!-- 扩展下边界 -->
                    <el-row :gutter="20">
                        <el-col :span="8" :offset="8">
                            <div class="grid-content">
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
</template>


<script>

    export default {
          data() {
              return {
                  input_name: '',
                  input_password: '',
                  slat: '1a2b3c4d',
                  load: false,
                  login_tip: '登录',
              }
          },
          methods: {
              // 跳转到注册页面
              toRegister() {
                  this.$router.replace('/register')
              },

              // 登录
              toLogin() {
                // 验证
                if(!this.trueName(this.input_name)) {
                    this.alertError("昵称长度只允许2至10位!")
                    return;
                }
                if(!this.truePassword(this.input_password)) {
                    this.alertError("密码长度只允许6至18位!");
                    return;
                }

                // 登录
                this.load = true;
                this.login_tip = '登录中...'
                this.$http.post(
                    "http://localhost/user/login",
                    {
                        name: this.input_name,
                        password: this.$md5(this.slat[0] + this.slat[2] + this.input_password + this.slat[5] + this.slat[4]),
                    }
                ).then((res)=>{
                    if (res.data.ret) {
                        this.alertSuccess("登录成功！")
                        this.$router.replace({
                            path: "/chat",
                            query: {
                                username: this.input_name
                            }
                        });
                    } else {
                        this.alertError(res.data.msg);
                    }
                    this.load = false;
                    this.login_tip = '登录'
                }).catch((res) => {
                    this.alertError("网络出现故障，请稍后再尝试！");
                    this.load = false;
                    this.login_tip = '登录'
                });
            },

            // 判断昵称正确性
            trueName(name) {
                return name.length >= 2 && name.length <= 10;
            },

            // 判断密码正确性
            truePassword(password) {
                return password.length >= 6 && password.length <= 18;
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
    }
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
</style>