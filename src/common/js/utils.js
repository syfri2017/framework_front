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
       


    
    }
}