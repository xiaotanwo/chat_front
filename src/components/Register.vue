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
                                <h1 style="color:#67C23A">
                                    聊天室 —— 注册
                                </h1>
                            </div>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="14" :offset="5">
                            <div>
                                <el-input placeholder="请输入昵称" v-model="input_name" clearable
                                @keydown.enter.native="toRegister">
                                </el-input>
                            </div>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="14" :offset="5">
                            <div>
                                <el-input placeholder="请输入密码" v-model="input_password" show-password
                                @keydown.enter.native="toRegister">
                                </el-input>
                            </div>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="14" :offset="5">
                            <div>
                                <el-input placeholder="请再次输入密码" v-model="input_password_second" show-password
                                @keydown.enter.native="toRegister">
                                </el-input>
                            </div>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="16" :offset="4">
                            <div class="grid-content">
                                <el-button type="primary" round @click="toLogin">
                                  登录
                                </el-button>
                                <el-button type="success" :loading="this.load" round @click="toRegister">
                                  {{register_tips}}
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
                  input_password_second: '',
                  slat: '1a2b3c4d',
                  load: false,
                  register_tips: '注册',
              }
          },
          methods: {
            // 跳转到登录页面
            toLogin() {
                this.$router.replace('/login')
            },

            // 注册
            toRegister() {
                // 去除首尾空格
                this.input_name = this.input_name.trim();
                this.input_password = this.input_password.trim();
                this.input_password_second = this.input_password_second.trim();

                // 验证
                if(!this.trueName(this.input_name)) {
                    this.alertError("昵称长度只允许2至10位!")
                    return;
                }
                if(this.input_password !== this.input_password_second) {
                    this.alertError("两次输入的密码不一致！");
                    return;
                }
                if(!this.truePassword(this.input_password)) {
                    this.alertError("密码长度只允许6至18位!");
                    return;
                }

                // 注册
                this.load = true;
                this.register_tips = '注册中...';
                this.$http.post(
                    "http://localhost/user/register",
                    {
                        name: this.input_name,
                        password: this.$md5(this.slat[0] + this.slat[2] + this.input_password + this.slat[5] + this.slat[4]),
                    }
                ).then((res)=>{
                    if (res.data.ret) {
                        this.alertSuccess("注册成功！");
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
                    this.register_tips = '注册';
                }).catch((res) => {
                    this.alertError("网络出现故障，请稍后再尝试！");
                    this.load = false;
                    this.register_tips = '注册';
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