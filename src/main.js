// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

// 引入elementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 引入axios
import axios from 'axios'
Vue.prototype.$http=axios;
axios.defaults.withCredentials = true;  //允许axios请求携带cookie等凭证

// 引入md5
import md5 from 'js-md5'
Vue.prototype.$md5 = md5

// 引入公共样式
import './assets/css/global.css' 

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
