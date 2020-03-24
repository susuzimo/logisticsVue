// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {uploadFileRequest} from "./utils/api";


Vue.config.productionTip = false

Vue.prototype.postRequest=postRequest;
Vue.prototype.putRequest=putRequest;
Vue.prototype.deleteRequest=deleteRequest;
Vue.prototype.getRequest=getRequest;
Vue.prototype.uploadFileRequest=uploadFileRequest;

Vue.use(ElementUI);
/* eslint-disable no-new */
//当页面跳转时，会触发该方法
//to 去哪儿
// from 从哪个页面来
// next表示继续执行的函数
router.beforeEach((to, from, next) => {
  if (to.path == '/' || window.sessionStorage.getItem("user")) {
    next();
  } else {
    next('/');
  }
})



new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
