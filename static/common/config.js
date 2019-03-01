var urlMatches = /(.*:\d+)\/.*/.exec(window.location.href);
window.config = {
  domain: 'http://localhost:8809/', 
  'booth':{
    'selectRefreshTime':'120000', //选择展位更新时间
    'anontRefreshTime':'120000' ,//查看展位更新时间
    'showHideTime': '2018-12-27 9:25:34'// 显示内部展位时间
  }
   //baseURL: 'http://192.168.1.119'
  // baseURL: 'http://localhost/' // 本地mock数据地址配置
}
