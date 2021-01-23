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
                    <el-container style="height: 100%; width: 250px">
                        <!-- 文字头像 -->
                        <el-header>
                             <Avatar
                                :username="headname"
                                background-color="#606266"
                                color="#67C23A"
                                style="vertical-align: middle;"
                                :inline="true">
                            </Avatar>
                        </el-header>
                        <!-- 聊天列表 -->
                        <el-main style="margin: 5px 0; padding: 0;">
                            <el-col>
                                <el-menu ref="elMenu"
                                    default-active="2"
                                    class="el-menu-vertical-demo"
                                    background-color="#545c64"
                                    text-color="#409EFF"
                                    active-text-color="#ffd04b"
                                    style="text-align: left; border-right: 0">
                                    <el-submenu index="1">
                                        <template slot="title">
                                            <i class="el-icon-s-home" style="color: #67C23A"></i>
                                            <span>聊天室</span>
                                        </template>
                                        <el-menu-item 
                                            :index="('1-' + index)"
                                            v-for="(item,index) in roomList" :key="index"
                                            @click="chatInRoom(item)">
                                            {{item}}
                                        </el-menu-item>
                                    </el-submenu>
                                    
                                    <el-submenu index="2">
                                        <template slot="title">
                                            <i class="el-icon-star-on" style="color: #67C23A"></i>
                                            <span>群聊</span>
                                        </template>
                                        <el-menu-item style="color: #67C23A" @click="newGroupDialogVisible = true">新建群聊</el-menu-item>
                                        <el-menu-item style="color: #67C23A" @click="joinGroupDialogVisible = true">加入群聊</el-menu-item>
                                        <el-menu-item 
                                            :index="('2-' + index)"
                                            v-for="(item,index) in groupList" :key="index"
                                            @click="chatInGroup(item)">
                                            {{item}}
                                        </el-menu-item>
                                    </el-submenu>

                                    <el-submenu index="3">
                                        <template slot="title">
                                            <i class="el-icon-user-solid" style="color: #67C23A"></i>
                                            <span>好友</span>
                                        </template>
                                        <el-menu-item style="color: #67C23A" @click="addFriendDialogVisible = true">添加好友</el-menu-item>
                                        <el-menu-item style="color: #67C23A" @click="friendApplyDialogVisible = true">好友申请</el-menu-item>
                                        <el-menu-item style="color: #67C23A" @click="friendDialogVisible = true">好友列表</el-menu-item>
                                        <el-menu-item 
                                            :index="('3-' + index)"
                                            v-for="(item,index) in friendList" :key="index"
                                            @click="chatWithFriend(item)">
                                            {{item}}
                                        </el-menu-item>
                                    </el-submenu>
                                </el-menu>
                            </el-col>
                        </el-main>
                        <!-- 退出按钮 -->
                        <el-footer style="padding-top: 10px">
                            <el-button type="danger" round @click="logout">退出</el-button>
                        </el-footer>
                    </el-container>

                    <el-container style="width: 90%">
                        <!-- 聊天室名称 -->
                        <el-header style="text-align: center;">
                            <el-dropdown @command="handleCommand" style="heigth: 10px">
                                <span class="el-dropdown-link" style="color: #67C23A; font-size: 20px;">
                                    {{chatTitle}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item icon="el-icon-error" command="close" style="color: #67C23A">关闭</el-dropdown-item>
                                    <el-dropdown-item icon="el-icon-delete-solid" command="delete" style="color: #67C23A">退出</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-header>
                        
                        <!-- 聊天信息框 -->
                        <el-main style="padding: 5px 10px;">
                        </el-main>

                        <!-- 发送框 -->
                        <el-footer style="height: 130px; padding: 5px 10px;">
                            <el-input
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
                </el-container>
            </el-col>
        </el-row>

        <!-- 添加好友页面 -->
        <el-dialog
            title="添加好友"
            :visible.sync="addFriendDialogVisible"
            width="400px"
            top="200px"
            :close-on-click-modal=false
            :show-close=false
            center>
            <el-form :model="addFriendForm">
                <el-form-item label="好友名称：" :label-width="formLabelWidth">
                    <el-input v-model="addFriendForm.applyName" autocomplete="off" placeholder="请输入对方名称"></el-input>
                </el-form-item>
                <el-form-item label="申请信息：" :label-width="formLabelWidth">
                    <el-input v-model="addFriendForm.msg" autocomplete="off" placeholder="请输入申请消息"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="danger" @click="addFriendClose">关 闭</el-button>
                <el-button type="primary" @click="addFriend">申 请</el-button>
            </span>
        </el-dialog>

        <!-- 好友申请页面 -->
        <el-dialog
            title="好友申请列表"
            :visible.sync="friendApplyDialogVisible"
            width="600px"
            top="200px"
            center>
            <span>这是一段信息</span>
        </el-dialog>
        
        <!-- 好友列表 -->
        <el-dialog
            title="好友列表"
            :visible.sync="friendDialogVisible"
            width="600px"
            top="200px"
            center>
            <span>这是一段信息</span>
        </el-dialog>

        <!-- 新建群聊页面 -->
        <el-dialog
            title="新建群聊"
            :visible.sync="newGroupDialogVisible"
            width="400px"
            top="200px"
            :close-on-click-modal=false
            :show-close=false
            center>
            <el-form :model="newGroupForm">
                <el-form-item label="群聊名称：" :label-width="formLabelWidth">
                    <el-input v-model="newGroupForm.name" autocomplete="off" placeholder="请输入群聊名称"></el-input>
                </el-form-item>
                <el-form-item label="群聊密码：" :label-width="formLabelWidth">
                    <el-input v-model="newGroupForm.password"
                              autocomplete="off"
                              placeholder="请输入群聊密码"
                              show-password>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="danger" @click="newGroupClose">关 闭</el-button>
                <el-button type="primary" @click="newGroup">新 建</el-button>
            </span>
        </el-dialog>

        <!-- 加入群聊页面 -->
        <el-dialog
            title="加入群聊"
            :visible.sync="joinGroupDialogVisible"
            width="400px"
            top="200px"
            :close-on-click-modal=false
            :show-close=false
            center>
            <el-form :model="joinGroupForm">
                <el-form-item label="群聊名称：" :label-width="formLabelWidth">
                    <el-input v-model="joinGroupForm.name" autocomplete="off" placeholder="请输入群聊名称"></el-input>
                </el-form-item>
                <el-form-item label="群聊密码：" :label-width="formLabelWidth">
                    <el-input v-model="joinGroupForm.password"
                              autocomplete="off"
                              placeholder="请输入群聊密码"
                              show-password>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="danger" @click="joinGroupClose">关 闭</el-button>
                <el-button type="primary" @click="joinGroup">加 入</el-button>
            </span>
        </el-dialog>
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
                chatTitle: '聊天室',
                username: '',
                headname: '',
                chat_text: '',
                shift_flag: false,
                friendList: [
                    "一二三四五六七八九十",
                    "李四",
                    "王五"
                ],
                groupList: [
                    "西三游泳群",
                    "富婆包养群",
                    "有福同享 有难退群",
                    "性感沙雕在线夜聊",
                ],
                roomList: [
                    "北京",
                    "上海",
                    "广州",
                    "深圳",
                ],
                
                addFriendDialogVisible: false,
                friendApplyDialogVisible: false,
                newGroupDialogVisible: false,
                joinGroupDialogVisible: false,
                friendDialogVisible: false,
                
                addFriendForm: {
                    applyName: '',
                    msg: '',
                },
                newGroupForm: {
                    name: '',
                    password: '',
                },
                joinGroupForm: {
                    name: '',
                    password: '',
                },
                formLabelWidth: '120px',
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

            // 添加好友
            addFriend() {
                // 去除首尾的空格
                this.addFriendForm.applyName = this.addFriendForm.applyName.trim();
                this.addFriendForm.msg = this.addFriendForm.msg.trim();
                
                // 初步验证名称的正确性
                if (!this.trueName(this.addFriendForm.applyName)) {
                    this.alertError("名称长度在2至10位!");
                    return;
                }
                // 限制申请信息的长度为50
                if (this.addFriendForm.msg.length > 50) {
                    this.alertError("申请信息长度不能超过50!");
                    return;
                }
                
                this.$http.post(
                    "http://localhost/friendApply/add",
                    {
                        applyName: this.addFriendForm.applyName,
                        msg: this.addFriendForm.msg,
                    }
                ).then((res)=>{
                    if (res.data.ret) {
                        this.alertSuccess(res.data.msg);
                        this.addFriendForm.applyName = '';
                        this.addFriendForm.msg = '';
                    } else {
                        this.alertError(res.data.msg);
                    }
                }).catch((res) => {
                    this.alertError("网络出现故障，请稍后再尝试！");
                });
            },

            // 关闭添加好友页面
            addFriendClose() {
                this.addFriendDialogVisible = false;
                this.addFriendForm.applyName = '';
                this.addFriendForm.msg = '';
            },

            // 新建群聊
            newGroup() {
                this.alertSuccess("新建成功!");
            },

            // 关闭新建群聊页面
            newGroupClose() {
                this.newGroupDialogVisible = false;
                this.newGroupForm.name = '';
                this.newGroupForm.password = '';
            },

            // 加入群聊
            joinGroup() {
                this.alertSuccess("加入成功!");
            },

            // 关闭加入群聊页面
            joinGroupClose() {
                this.joinGroupDialogVisible = false;
                this.joinGroupForm.name = '';
                this.joinGroupForm.password = '';
            },

            // 聊天室内的操作
            handleCommand(command) {
                if (command == 'close') {
                    this.$refs.elMenu.activeIndex = null;
                    this.chatTitle = '聊天室';
                } else if (command == 'delete') {
                    this.alertSuccess("退出聊天室成功！");
                }
            },

            // 聊天室点击事件
            chatInRoom(item) {
                this.chatTitle = item;
                this.alertSuccess(item);
            },

            // 群聊点击事件
            chatInGroup(item) {
                this.chatTitle = item;
                this.alertSuccess(item);
            },

            // 好友点击事件
            chatWithFriend(item) {
                this.chatTitle = item;
                this.alertSuccess(item);
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
    };
</script>