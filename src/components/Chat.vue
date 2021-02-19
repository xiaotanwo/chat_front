<template>
    <div>
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
            width="700px"
            top="200px"
            center>
            <el-table :data="friendApplyTableData">
                <el-table-column prop="name" label="用户" width="160">
                </el-table-column>
                <el-table-column prop="msg" label="申请信息">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="146">
                    <template slot-scope="scope">
                        <el-button @click="agreeFriendApply(scope.$index, friendApplyTableData)" type="success" size="small">同意</el-button>
                        <el-button @click="refuseFriendApply(scope.$index, friendApplyTableData)" type="danger" size="small">拒绝</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        
        <!-- 好友列表 -->
        <el-dialog
            title="好友列表"
            :visible.sync="friendsDialogVisible"
            width="400px"
            top="200px"
            center>
            <el-table :data="friendsTableData">
                <el-table-column prop="friend" label="好友名称">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="76">
                    <template slot-scope="scope">
                        <el-button @click="deleteFriend(scope.$index, friendsTableData)" type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
                    <el-container style="height: 100%; width: 260px">
                        <!-- 文字头像 -->
                        <el-header>
                             <Avatar
                                :username="headname"
                                background-color="#606266"
                                color="#67C23A"
                                style="vertical-align: middle;"
                                :inline="true">
                            </Avatar>
                            <!-- 离线时显示 -->
                            <el-tag
                                v-if="outConnecting"
                                type="danger"
                                style="background-color: transparent; border: 0;">
                                --离线中--
                            </el-tag>
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
                                    :unique-opened=true
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
                                        <el-menu-item style="color: #67C23A" @click="friendsDialogVisible = true;">好友列表</el-menu-item>
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

                    <el-container style="width: 85%">
                        <!-- 聊天室名称 -->
                        <el-header style="text-align: center;">
                            <el-dropdown @command="handleCommand">
                                <span class="el-dropdown-link" style="color: #67C23A; font-size: 20px;">
                                    {{chatTitle}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item icon="el-icon-error" command="close" style="color: #67C23A">关闭</el-dropdown-item>
                                    <el-dropdown-item icon="el-icon-delete-solid" command="delete" style="color: #67C23A">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-header>
                        
                        <!-- 聊天信息框 -->
                        <el-main style="margin: 5px 10px;" id="scrollDiv">
                            <div v-html="info">
                            </div>
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
                                v-model="chatText">
                            </el-input>
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
            // 获取登录后的用户名
            this.username = this.$route.query.username;
            this.headname = this.username[0] + ' ' + this.username[1];

            // 初始化数据
            this.init();

            // 初始化websocket
            this.initWebpack();
        },

        // 待完善
        updated(){
            // 聊天定位到底部
            let ele = document.getElementById('scrollDiv');
            ele.scrollTop = ele.scrollHeight;
        },


        data() {
            return {
                // 密码加密
                slat: '1a2b3c4d',

                // 默认聊天室的名称
                chatTitle: '聊天室',

                // 用户名
                username: '',

                // 头像文本
                headname: '',

                // 离线显示标志
                outConnecting: true,

                // 聊天信息
                chatText: '',

                // 聊天类型，-1：没有选中聊天对象，0：聊天室，1：群聊，2：好友
                chatType: -1,

                // 聊天输入框换行的shift标志
                shiftFlag: false,

                // 好友
                friendList: [],

                // 群聊列表
                groupList: [],

                // 聊天室，测试数据
                roomList: [
                    '一二三四五六七八九十',
                    '北京',
                    '上海',
                    '广州',
                    '深圳',
                    '北京',
                    '上海',
                    '广州',
                    '深圳',
                    '北京',
                    '上海',
                    '广州',
                    '深圳',
                ],
                
                // 弹窗
                addFriendDialogVisible: false,
                friendApplyDialogVisible: false,
                newGroupDialogVisible: false,
                joinGroupDialogVisible: false,
                friendsDialogVisible: false,
                
                // 表单数据
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

                // 列表数据
                friendApplyTableData: [],
                friendsTableData: [],

                // 显示的聊天信息
                info: '',

                // websocket对象
                ws: null, // 建立的连接
                lockReconnect: false, // 是否真正建立连接
                timeout: 10*1000, // 10秒一次心跳
                timeoutObj: null, // 心跳心跳倒计时
                serverTimeoutObj: null, // 心跳倒计时
                timeoutnum: null, // 断开 重连倒计时

                logout_flag: false, // 退出标志
            }
        },


        methods: {
            // 初始化
            init() {
                // 获取好友申请
                this.$http.get(
                    "http://localhost/friendApply/search",
                ).then((res)=>{
                    if (res.data.ret) {
                        this.friendApplyTableData = res.data.obj;
                    } else {
                        this.alertError(res.data.msg);
                    }
                }).catch((res) => {
                    this.alertError("网络出现故障，请稍后再尝试！");
                });
            },

            // 初始化ws
            initWebpack(){
                // 判断是否支持websocket
                if(typeof(WebSocket) === "undefined"){
                    alert("您的浏览器不支持socket！请更换浏览器！");
                    return;
                }
                // 创建websocket对象,全局变量
                this.ws = new WebSocket("ws://localhost/chat");
                this.ws.onopen = this.onopen;
                this.ws.onmessage = this.onmessage;
                this.ws.onclose = this.onclose;
                this.ws.onerror = this.onerror;
            },

            // 重新连接
            reconnect() {
                var that = this;
                if(that.lockReconnect) {
                    return;
                };
                that.lockReconnect = true;
                // 没连接上会一直重连，设置延迟避免请求过多
                that.timeoutnum && clearTimeout(that.timeoutnum);
                that.timeoutnum = setTimeout(function () {
                    // 新连接
                    that.initWebpack();
                    that.lockReconnect = false;
                }, 5000);
            },

            // 重置心跳
            reset(){
                var that = this;
                // 清除时间
                clearTimeout(that.timeoutObj);
                clearTimeout(that.serverTimeoutObj);
                // 重启心跳
                that.start();
            },

            // 开启心跳
            start(){
                var self = this;
                self.timeoutObj && clearTimeout(self.timeoutObj);
                self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
                self.timeoutObj = setTimeout(function(){
                    // 这里发送一个心跳，后端收到后，返回一个心跳消息
                    // 连接正常，可以通讯的状态 1
                    if (self.ws.readyState == 1) {
                        self.ws.send("ping");
                        console.log("?")
                    } else {
                        // 重连
                        self.reconnect();
                    }
                    // 设置定时器，如果后端有数据返回，则这个定时器会销毁，
                    // 否则就是超时，关闭ws
                    self.serverTimeoutObj = setTimeout(function() {
                        // 超时关闭
                        self.ws.close();
                    }, self.timeout);
                }, self.timeout)
            }, 

    　　　　 onopen() {
                // 设置在线
                this.outConnecting = false;
                // 开启心跳
                this.start();
            },

            onmessage(evt) {
                // 收到服务器信息，心跳重置
                this.reset();
                // 心跳返回
                if (evt.data == "pang") {
                    console.log("!")
                    return ;
                }
                // 获取服务端推送过来的消息，转换成JSON格式
                var res = JSON.parse(evt.data);

                // 取整，不然可能是小数
                var fristType = parseInt(res.type / 10);
                var secendType = res.type % 10;
                
                switch(fristType) {
                    case 0:
                        // 聊天室
                        switch(secendType) {
                            case 0:
                                // 聊天列表
                                this.roomList = res.obj;
                                break;
                            case 1:
                                // 聊天消息
                                var chatData = sessionStorage.getItem(0 + res.toName);
                                var str = this.infoToHtml(res.fromName, res.obj);
                                var tmp = '';
                                if (chatData != null) {
                                    tmp += chatData;
                                }
                                tmp += str;
                                sessionStorage.setItem(0 + res.toName, tmp);
                                if (this.chatType == 0 && this.chatTitle == res.toName) {
                                    this.info = tmp;
                                }
                                break;
                        }
                        break;
                    case 1:
                        // 群聊
                        switch(secendType) {
                            case 0:
                                // 群聊列表
                                this.groupList = res.obj;
                                break;
                            case 1:
                                // 上线通知
                                var chatData = sessionStorage.getItem(1 + res.toName);
                                var str = this.showTip(res.fromName + " 上线了");
                                var tmp = '';
                                if (chatData != null) {
                                    tmp += chatData;
                                }
                                tmp += str;
                                sessionStorage.setItem(1 + res.toName, tmp);
                                if (this.chatType == 1 && this.chatTitle == res.toName) {
                                    this.info = tmp;
                                }
                                break;
                            case 2:
                                // 聊天消息
                                var chatData = sessionStorage.getItem(1 + res.toName);
                                var str = this.infoToHtml(res.fromName, res.obj);
                                var tmp = '';
                                if (chatData != null) {
                                    tmp += chatData;
                                }
                                tmp += str;
                                sessionStorage.setItem(1 + res.toName, tmp);
                                if (this.chatType == 1 && this.chatTitle == res.toName) {
                                    this.info = tmp;
                                }
                                break;
                            case 3:
                                // 群友离线通知
                                var chatData = sessionStorage.getItem(1 + res.toName);
                                var str = this.showTip(res.fromName + " 下线了");
                                var tmp = '';
                                if (chatData != null) {
                                    tmp += chatData;
                                }
                                tmp += str;
                                sessionStorage.setItem(1 + res.toName, tmp);
                                if (this.chatType == 1 && this.chatTitle == res.toName) {
                                    this.info = tmp;
                                }
                                break;
                            case 4:
                                // 用户加入群聊通知
                                var chatData = sessionStorage.getItem(1 + res.toName);
                                var str = this.showTip(res.fromName + " 加入了群聊");
                                var tmp = '';
                                if (chatData != null) {
                                    tmp += chatData;
                                }
                                tmp += str;
                                sessionStorage.setItem(1 + res.toName, tmp);
                                if (this.chatType == 1 && this.chatTitle == res.toName) {
                                    this.info = tmp;
                                }
                                break;
                            case 5:
                                // 群友退群通知
                                var chatData = sessionStorage.getItem(1 + res.toName);
                                var str = this.showTip(res.fromName + " 退出了群聊");
                                var tmp = '';
                                if (chatData != null) {
                                    tmp += chatData;
                                }
                                tmp += str;
                                sessionStorage.setItem(1 + res.toName, tmp);
                                if (this.chatType == 1 && this.chatTitle == res.toName) {
                                    this.info = tmp;
                                }
                                console.log("nihhao")
                                break;
                        }
                        break;
                    case 2:
                        // 好友
                        switch(secendType) {
                            case 0:
                                // 好友列表
                                this.friendsTableData = res.obj;
                                break;
                            case 1:
                                // 在线好友列表
                                this.friendList = res.obj;
                                break;
                            case 2:
                                // 添加在线好友（不重复添加）, 待完善
                                if(this.friendList.indexOf(res.fromName) == -1){
                                    this.friendList.push(res.fromName);
                                }
                                break;
                            case 3:
                                // 显示好友发来的聊天信息
                                var chatData = sessionStorage.getItem(2 + res.fromName);
                                var str = this.infoToHtml(res.fromName, res.obj);
                                var tmp = '';
                                if (chatData != null) {
                                    tmp += chatData;
                                }
                                tmp += str;
                                sessionStorage.setItem(2 + res.fromName, tmp);
                                if (this.chatType == 2 && this.chatTitle == res.fromName) {
                                    this.info = tmp;
                                }
                                break;
                            case 4:
                                // 发送的好友已离线提示
                                var chatData = sessionStorage.getItem(2 + res.toName);
                                var str = this.showTip(res.toName + " 已下线");
                                var tmp = '';
                                if (chatData != null) {
                                    tmp += chatData;
                                }
                                tmp += str;
                                sessionStorage.setItem(2 + res.toName, tmp);
                                if (this.chatType == 2 && this.chatTitle == res.toName) {
                                    this.info = tmp;
                                }
                                break;
                            case 5:
                                // 好友离线通知
                                var index = this.friendList.indexOf(res.fromName)
                                if (index >= 0) {
                                    this.friendList.splice(index, 1);
                                }
                                break;
                            case 6:
                                // 好友申请通知
                                this.friendApplyTableData.push({
                                    name: res.fromName,
                                    msg: res.obj
                                });
                                break;
                            case 7:
                                // 好友申请通过通知
                                this.friendList.push(res.fromName);
                                this.friendsTableData.push({
                                    friend: res.fromName
                                })
                                break;
                            case 8:
                                // 好友删除通知
                                var index = -1;
                                for (var i=0; i<this.friendsTableData.length; ++i) {
                                    if (this.friendsTableData[i].friend == res.fromName) {
                                        index = i;
                                        break;
                                    }
                                }
                                if (index >= 0) {
                                    this.friendsTableData.splice(index, 1);
                                }
                                break;
                        }
                        break;
                }
            },

            onclose() {
                // 设置离线标志
                this.outConnecting = true;
                // 将ws设置为空，因为重连和不重连都不需要原来的ws了
                this.ws = null;
                // 超时的关闭，需要重连
                if (!this.logout_flag) {
                    //重连
                    this.reconnect();
                }
            },

            onerror() {
                // 设置离线标志
                this.outConnecting = true;
                // 将ws设置为空，因为重连和不重连都不需要原来的ws了
                this.ws = null;
                // 超时的错误，需要重连
                if (!this.logout_flag) {
                    //重连
                    this.reconnect();
                }
            },

            // 注销
            logout() {
                this.logout_flag = true;
                // 关闭ws
                if (this.ws != null) this.ws.close();
                // 注销
                this.$http.get(
                    "http://localhost/user/logout"
                ).then((res)=>{
                    if (res.data.ret) {
                        this.alertSuccess(res.data.msg);
                    } else {
                        this.alertError(res.data.msg);
                    }
                    this.$router.replace("/login")
                    sessionStorage.clear();
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

            // 同意好友申请
            agreeFriendApply(index, rows) {
                this.$http.get(
                    "http://localhost/friendApply/agree/" + rows[index].name,
                ).then((res)=>{
                    if (res.data.ret) {
                        this.alertSuccess("已同意该好友的申请！");
                        // 已经是好友则无需再添加
                        if ('已是好友！' != res.data.msg) {
                            // 添加好友到好友列表中
                            this.friendsTableData.push({
                                friend: rows[index].name
                            });
                        }
                        // 移除好友申请
                        rows.splice(index, 1);
                    } else {
                        this.alertError(res.data.msg);
                    }
                }).catch((res) => {
                    this.alertError("网络出现故障，请稍后再尝试！");
                });
            },

            // 拒绝好友申请
            refuseFriendApply(index, rows) {
                this.$http.get(
                    "http://localhost/friendApply/refuse/" + rows[index].name,
                ).then((res)=>{
                    if (res.data.ret) {
                        this.alertSuccess("已拒绝该好友的申请！");
                        rows.splice(index, 1);
                    } else {
                        this.alertError(res.data.msg);
                    }
                }).catch((res) => {
                    this.alertError("网络出现故障，请稍后再尝试！");
                });
            },

            // 双向删除好友
            deleteFriend(index, rows) {
                this.$http.get(
                    "http://localhost/friend/delete/" + rows[index].friend,
                ).then((res)=>{
                    if (res.data.ret) {
                        this.alertSuccess("双向删除好友成功！");
                        rows.splice(index, 1);
                    } else {
                        this.alertError(res.data.msg);
                    }
                }).catch((res) => {
                    this.alertError("网络出现故障，请稍后再尝试！");
                });
            },


            // 新建群聊
            newGroup() {
                // 去除首尾的空格
                this.newGroupForm.name = this.newGroupForm.name.trim();
                this.newGroupForm.password = this.newGroupForm.password.trim();

                // 初步验证名称的正确性
                if (!this.trueName(this.newGroupForm.name)) {
                    this.alertError("群聊名长度在2至10位!");
                    return;
                }
                // 限制申请信息的长度为50
                if (!this.truePassword(this.newGroupForm.password)) {
                    this.alertError("密码长度在6至18位!");
                    return;
                }

                this.$http.post(
                    "http://localhost/group/newGroup",
                    {
                        name: this.newGroupForm.name,
                        password: this.$md5(this.slat[0] + this.slat[2] + this.newGroupForm.password + this.slat[5] + this.slat[4])
                    }
                ).then((res)=>{
                    if (res.data.ret) {
                        this.alertSuccess("新建群聊：" + this.newGroupForm.name + " 成功!");
                        // 添加新建的群聊
                        this.groupList.push(this.newGroupForm.name);
                        // 清空新建群聊信息
                        this.newGroupForm.name = '';
                        this.newGroupForm.password = '';
                    } else {
                        this.alertError(res.data.msg);
                    }
                }).catch((res) => {
                    this.alertError("网络出现故障，请稍后再尝试！");
                });
            },

            // 关闭新建群聊页面
            newGroupClose() {
                this.newGroupDialogVisible = false;
                this.newGroupForm.name = '';
                this.newGroupForm.password = '';
            },

            // 加入群聊
            joinGroup() {
                // 去除首尾的空格
                this.joinGroupForm.name = this.joinGroupForm.name.trim();
                this.joinGroupForm.password = this.joinGroupForm.password.trim();

                // 初步验证名称的正确性
                if (!this.trueName(this.joinGroupForm.name)) {
                    this.alertError("群聊名长度在2至10位!");
                    return;
                }
                // 限制申请信息的长度为50
                if (!this.truePassword(this.joinGroupForm.password)) {
                    this.alertError("密码长度在6至18位!");
                    return;
                }

                this.$http.post(
                    "http://localhost/groupMember/joinGroup",
                    {
                        name: this.joinGroupForm.name,
                        password: this.$md5(this.slat[0] + this.slat[2] + this.joinGroupForm.password + this.slat[5] + this.slat[4])
                    }
                ).then((res)=>{
                    if (res.data.ret) {
                        this.alertSuccess("加入群聊：" + this.joinGroupForm.name + " 成功!");
                        // 添加加入的群聊
                        this.groupList.push(this.joinGroupForm.name);
                        // 清空新建群聊信息
                        this.joinGroupForm.name = '';
                        this.joinGroupForm.password = '';
                    } else {
                        this.alertError(res.data.msg);
                    }
                }).catch((res) => {
                    this.alertError("网络出现故障，请稍后再尝试！");
                });
            },

            // 关闭加入群聊页面
            joinGroupClose() {
                this.joinGroupDialogVisible = false;
                this.joinGroupForm.name = '';
                this.joinGroupForm.password = '';
            },

            // 头像的html
            getAvatar(name, col) {
                return '<div style="margin: 0 0 10px 0"><div aria-hidden="true" class="vue-avatar--wrapper" style="display: inline-flex; width: 50px; height: 50px; border-radius: 50%; font: 20px / 50px Helvetica, Arial, sans-serif; align-items: center; justify-content: center; text-align: center; user-select: none; background-color: rgb(96, 98, 102); color: ' + col + '; vertical-align: middle;"><span>' + name.substring(0,2) + '</span></div></div>'
            },

            // msg的html
            getMsg(msg, dir, col) {
                return  "<div style='color: " + col + "; text-align: " + dir + "; padding: 3px; margin: 3px'>" +
                            msg +
                        "</div>"
            },

            // 聊天信息转成html进行插入
            infoToHtml(name, msg) {
                // 自己发送的，右边
                if (name == this.username) {
                    return "<div style='margin: 2px 5px 2px 52px; display: flex; justify-content: flex-end; align-items: flex-start;'>" +
                                this.getMsg(msg, "right", "#67C23A") + this.getAvatar(name, "#67C23A") +
                            "</div>"
                } else { // 别人发送的，左边
                    return "<div style='margin: 2px 52px 2px 5px ; display: flex; justify-content: flex-start; align-items: flex-start;'>" +
                                this.getAvatar(name, "#E6A23C") + this.getMsg(msg, "left", "#E6A23C") +
                            "</div>"
                }
            },

            // 聊天通知的显示
            showTip(tip) {
                return '<div><span style="color: #F56C6C">' + tip + '</span></div>';
            },

            // 聊天框内的操作
            handleCommand(command) {
                if (command == 'close') {
                    this.$refs.elMenu.activeIndex = null;
                    this.chatTitle = '聊天室';
                    this.chatType = -1;
                    this.info = '';
                } else if (command == 'delete') {
                    if (this.chatType == 1) {
                        // 群聊删除
                        this.$http.get(
                            "http://localhost/groupMember/delete/" + this.chatTitle,
                        ).then((res)=>{
                            if (res.data.ret) {
                                var index = this.groupList.indexOf(this.chatTitle)
                                if (index >= 0) {
                                    this.groupList.splice(index, 1);
                                }
                                this.alertSuccess("群聊删除成功！");
                                this.$refs.elMenu.activeIndex = null;
                                this.chatTitle = '聊天室';
                                this.chatType = -1;
                                this.info = '';
                            } else {
                                this.alertError(res.data.msg);
                            }
                        }).catch((res) => {
                            this.alertError("网络出现故障，请稍后再尝试！");
                        });
                    } else if (this.chatType == 2) {
                        // 好友删除
                        this.$http.get(
                            "http://localhost/friend/delete/" + this.chatTitle,
                        ).then((res)=>{
                            if (res.data.ret) {
                                var index = this.friendList.indexOf(this.chatTitle)
                                if (index >= 0) {
                                    this.friendList.splice(index, 1);
                                }
                                index = -1;
                                for (var i=0; i<this.friendsTableData.length; ++i) {
                                    if (this.friendsTableData[i].friend == this.chatTitle) {
                                        index = i;
                                        break;
                                    }
                                }
                                if (index >= 0) {
                                    this.friendsTableData.splice(index, 1);
                                }
                                this.alertSuccess("好友删除成功！");
                                this.$refs.elMenu.activeIndex = null;
                                this.chatTitle = '聊天室';
                                this.chatType = -1;
                                this.info = '';
                            } else {
                                this.alertError(res.data.msg);
                            }
                        }).catch((res) => {
                            this.alertError("网络出现故障，请稍后再尝试！");
                        });
                    } else {
                        this.alertError("不能对此页面进行删除！");
                    }
                }
            },

            // 聊天室点击事件
            chatInRoom(item) {
                this.chatTitle = item;
                this.chatType = 0;
                this.info = sessionStorage.getItem(this.chatType + this.chatTitle);
                if (this.info == null) this.info = '';
            },

            // 群聊点击事件
            chatInGroup(item) {
                this.chatTitle = item;
                this.chatType = 1;
                this.info = sessionStorage.getItem(this.chatType + this.chatTitle);
                if (this.info == null) this.info = '';
            },

            // 好友点击事件
            chatWithFriend(item) {
                this.chatTitle = item;
                this.chatType = 2;
                this.info = sessionStorage.getItem(this.chatType + this.chatTitle);
                if (this.info == null) this.info = '';
            },

            // 发送聊天信息
            toSend(event) {
                // 监听回车事件
                if (!this.shiftFlag && event.keyCode == 13) {
                    if (this.chatType == -1) {
                        this.alertError("请选择聊天对象！");
                        return;
                    }
                    if (this.outConnecting) {
                        // 离线状态，即ws已经断开，无法发送
                        this.alertError("您已断开连接，请检查网络或重新登录！");
                        return;
                    }
                    // 去掉首尾的空格
                    this.chatText = this.chatText.trim();
                    if (this.chatText == '') {
                        this.alertError("聊天信息不嫩为空！");
                        return;
                    }
                    var sendMsg = this.chatText.replace(/(\r\n)|(\n)/g,'<br>');
                    var str = this.infoToHtml(this.username, sendMsg);
                    // 本地聊天信息添加和保存
                    this.info += str;
                    sessionStorage.setItem(this.chatType + this.chatTitle, this.info);
                    // 清空
                    this.chatText = '';
                    // 发送聊天信息
                    var jsonData = {"type": this.chatType, "toName": this.chatTitle, "obj": sendMsg};
                    this.ws.send(JSON.stringify(jsonData));

                } else if (event.keyCode == 16) {
                    this.shiftFlag = false;
                }
            },

            // 设置shift标志
            downshift() {
                this.shiftFlag = true;
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