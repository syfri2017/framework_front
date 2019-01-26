// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import {Message,Loading} from 'element-ui';
import utils from './common/js/utils';
import 'element-ui/lib/theme-chalk/index.css';
import './common/scss/index.scss';

Vue.config.productionTip = false
Vue.config.devtools = true;
Vue.use(ElementUI);
Vue.use(VueAxios, axios);
Vue.use(utils);

// 后台项目地址
axios.defaults.baseURL = window.config.domain;
//解决跨域
Vue.prototype.$http.defaults.withCredentials = true;
//axios请求
Vue.prototype.$axios = axios;

//路由拦截
router.beforeEach((to, from, next) => {
  /**如果用户需要跳转登录页或者跳转不需要验证的页面，直接next() by li.xue 2019/1/25 */
  if (to.path !== '/' && to.matched.some(m => m.meta.auth)) {
    if (localStorage.isLogin === 'TRUE') {
        next();
    }
  } else if (to.path == '/') {
    if (localStorage.isLogin === 'TRUE') {
      next({path: '/index'});
    } else {
      next();
    }
  }else {
    next();
  }
});

//添加请求拦截器
axios.interceptors.request.use(
  config => {
    //在发送请求之前做某事
    config.headers.PATHURL = router.currentRoute.path;
    config.headers.PATHNAME = encodeURI(router.currentRoute.name);

    if(config.url != '/vueCliLogin' && config.url != '/vueCliLogout'){
      var isLogin = localStorage.getItem('isLogin');
      if(isLogin != 'TRUE'){
        router.push({path: '/'});
      }
    }
    /**采用TOKEN验证方式  by li.xue */
    /**
    var token = this.localStorage.getItem("XTOKEN")
    if (token != null){
      config.headers.XTOKEN = this.localStorage.getItem("XTOKEN");
    }
    */
      return config;
    },
  error => {
    //请求错误时做些事
    return Promise.reject(error);
  });

  //添加响应拦截器
// axios.interceptors.response.use(
//   response => {
//       //展示请求错误信息
//       //错误提示键值对
//       let errorObj = {1010100003: '请求参数错误'};
//       if (errorObj.hasOwnProperty(response.data.respCode)) {
//         return response;
//       }
//   },
//   error => {
//     Message.error({
//       showClose: true,
//       message: error,
//       type: 'error',
//       duration: 0
//     });
//     //请求超时跳转到登录页面
//     if("Network Error"==error.message){
//       router.push({name: 'login'});
//       localStorage.clear(); 
//     }
//     return Promise.reject(error);
//   })

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
