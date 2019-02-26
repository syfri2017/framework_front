export default {
  install(Vue, options) {
      
      //验证当前用户是否有操作权限
      Vue.prototype.hasPermission = function(val){
          var permissions = JSON.parse(localStorage.getItem("CURRENTUSER")).permissions;
          var index = permissions.indexOf(val);
          if(index == -1){
            return false;
          }else{
            return true;
          }
      };
      //table日期格式化
      Vue.prototype.tableDateFormat = function (row, column) { 
        var rowDate = row[column.property];
        if (rowDate == null || rowDate == "") {
          return '';
        } else {
          var date = new Date(rowDate);
          if (date == undefined) {
            return rowDate;
          }
          var month = '' + (date.getMonth() + 1),
            day = '' + date.getDate(),
            year = date.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;

          var newDate = [year, month, day].join('-');
          return newDate;
        }
      }

      //table中NULL值格式化
      Vue.prototype.tableNullFormat = function (row, column) {
      var rowDate = row[column.property];
      if (rowDate == null || rowDate == "") {
        return '无';
      } else {
        return rowDate;
      }
    }

    //table中性别格式化
    Vue.prototype.tableSexFormat = function(row, column) {
      switch (row[column.property]) {
        case "1":
          return "男";
          break;
        case "2":
          return "女";
          break;
        default:
          return "";
      }
    }
  }
}