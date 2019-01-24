// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './common/router'
import axios from 'axios';
import ElementUI from 'element-ui';
import {Message,Loading} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './common/scss/index.scss';

Vue.config.productionTip = false
Vue.config.devtools = true;
Vue.use(ElementUI);
// 后台项目地址
axios.defaults.baseURL = window.config.domain;

//路由拦截
router.beforeEach((to, from, next) => {
  //关闭错误弹窗
  Message.closeAll();

  //跳转到路由请求页面
  next();
  // debugger
  // axios.get('/xfxhapi/getMenu').then(function (res) {
  //   debugger
  //   //router.addRoutes(menus)
  // }.bind(this), function (error) {
  //     console.log(error)
  // })
});

//添加请求拦截器
let loadingInstance = null;
axios.interceptors.request.use(
  config => {

    //在发送请求之前做某事
    config.headers.PATHURL = router.currentRoute.path;
    config.headers.PATHNAME = encodeURI(router.currentRoute.name);
    if (localStorage.getItem("userToken")) {
      var userToken = JSON.parse(localStorage.getItem('userToken'));
      config.headers.LOGINTOKEN = userToken.accessToken;
    }

    //添加加载过渡效果
    //loadingInstance = Loading.service({ fullscreen: true });
    return config;
  },
  error => {
    //请求错误时做些事
    return Promise.reject(error);
  })

//添加响应拦截器
axios.interceptors.response.use(
  response => {
      //展示请求错误信息
      //错误提示键值对
      let errorObj = {1010100003: '请求参数错误'};
      if (errorObj.hasOwnProperty(response.data.respCode)) {
      Message.error({
          showClose: true,
          message: errorObj[response.data.respCode],
          type: 'error',
          duration: 0
        });
      }
      //关闭加载过渡效果
      //loadingInstance.close();
      return response;
  },
  error => {
    /*loadingInstance.close();*/
    Message.error({
      showClose: true,
      message: error,
      type: 'error',
      duration: 0
    });
    //请求超时跳转到登录页面
    if("Network Error"==error.message){
      router.push({name: 'login'});
      localStorage.clear();
    }
    return Promise.reject(error);
  })

Vue.prototype.$axios = axios;//axios请求

Vue.prototype.$dicFormat = (dicCode,itemCode) => {
  let key = dicCode+"_"+itemCode;
  let formats = JSON.parse(localStorage.getItem('format'));
	return formats[key];
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
