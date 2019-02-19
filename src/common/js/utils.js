export default {
    install(Vue, options) {
        Vue.prototype.testAAA = function (msg) {
            return msg;
        };
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
        //当前页修改事件
        Vue.prototype.currentPageChange = function(val) {
            debugger;
            if(this.currentPage != val){
                this.currentPage = val;
                this.searchClick('page');
            }
        };
        //分页大小修改事件
        Vue.prototype.pageSizeChange = function(val) {
            this.pageSize = val;
            if(val == 10){
                tableheight = tableheight10;
            }else if(val == 20){
                tableheight = tableheight20;
            }else if(val == 30){
                tableheight = tableheight30;
            }
            this.searchClick('page');
        };


    
    }
}