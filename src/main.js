// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './common/router'
import axios from 'axios';
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import {Message,Loading} from 'element-ui';
import utils from '../static/common/utils.js';
import store from './store/index';
import 'element-ui/lib/theme-chalk/index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import './common/scss/index.scss';

Vue.config.productionTip = false
Vue.config.devtools = true;
Vue.use(ElementUI);
Vue.use(VueAxios, axios);
// 后台项目地址
axios.defaults.baseURL = window.config.domain;
//解决跨域
Vue.prototype.$http.defaults.withCredentials = true;

Vue.use(utils);
Vue.use(store);

//路由拦截
router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth)) {
    if (window.localStorage.isLogin === 'Y') {
      next();
    } else if (to.path !== '/') {
      next({path: '/'});
      Vue.prototype.$message.warning('您还未登录，请登陆');
    }
  } else {
    next();
  }
  //关闭错误弹窗
  // //Message.closeAll();

  //跳转到路由请求页面
  // //next();

  // axios.get('/xfxhapi/getMenu').then(function (res) {
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


    if(config.url != '/vueCliLogin' && config.url != '/vueCliLogout' && config.url != '/getSession' && config.url != "/shiro"){
      axios.get('/getSession').then(function (res) {
        if(res.data == '0'){
          localStorage.setItem('user', null);
          localStorage.setItem('isLogin', 'N');
          Vue.prototype.$message.error('用户超时，请重新登陆'); 
          vm.$router.push({path: '/'});
        }
      }.bind(this), function (error) {
          console.log(error)
      })
  }
  return config;

    /**
    if (localStorage.getItem("userToken")) {
      var userToken = JSON.parse(localStorage.getItem('userToken'));
      config.headers.LOGINTOKEN = userToken.accessToken;
    }
    */
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
let vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created() {
    if(localStorage.getItem("isLogin") == null) {
      localStorage.setItem("isLogin", '');
    }
    this.$store.state.isLogin = localStorage.getItem("isLogin");
  }
})
