# chat_front

> A Vue.js project

## 即时聊天系统前端

## 后端项目：https://github.com/xiaotanwo/chat

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# 安装element-ui
npm i element-ui

# 引入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

# 安装axios
npm install axios --save-dev

# 引入
import axios from 'axios'
Vue.prototype.$http=axios;

# 使用
this.$http.get('url').then((res)=>{})
this.$http.post('url').then((res)=>{})

# 安装md5
npm install --save js-md5

# 引入
import md5 from 'js-md5'
Vue.prototype.$md5 = md5

# 使用
this.$md5()
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
