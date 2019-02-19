<template>
    <!-- 用户登录 -->
    <el-row class="logincenter">
      <el-col :span="8" >&nbsp;</el-col>
      <el-col :span="8" style="text-align:-webkit-center">
        <div class="login-form" >
          <div class="filed left">
            <router-link :to="{path:'/login/Administrator'}"><i class="iconfont icon-yonghu"></i></router-link>
            <span >用户登录</span>
            <span class="signstyle">没有账户?<router-link :to="{path:'/login/Register'}"><a>去注册</a></router-link></span>
          </div>
          <form ref="GLYloginForm" id="GLYloginForm" autocomplete="off" name="loginform"  method="post">
            <div class="filed ">
              <el-input placeholder="用户名" v-model="GLYusername" prefix-icon="iconfont icon-username"></el-input>
            </div>
            <div class="filed">
              <el-input placeholder="密码" v-model="GLYpassword" prefix-icon="iconfont icon-password" type="password"></el-input>
            </div>
            <div class="filed">
              <el-input placeholder="验证码" class="yanzhengma_input"  v-model="picLyanzhengma" prefix-icon="iconfont icon-validate"></el-input>
              <input type="button" id="code" @click="createCode"  class="verification1" v-model="checkCode"/>
            </div>
            <div class="filed right" >
              <span class="muchtab"><router-link :to="{path:'/login/ForgetUsername'}"><a>忘记用户名</a></router-link>  |  <router-link :to="{path:'/login/ForgetPassword'}"><a>忘记密码</a></router-link>  |  <router-link :to="{path:'/login/Reset'}"><a>重置账户</a></router-link></span>
            </div>
            <div class="filed lgin">
              <el-button type="danger" @click="GLYlogin" round>登录</el-button>
            </div>
          </form>
        </div>
      </el-col>
      <el-col :span="8">&nbsp;</el-col>
    </el-row>
</template>

<script>
var code ; //在全局定义验证码
export default {
  name: 'Login',
  data () {
    return {
        GLYusername: "",
        GLYpassword: "",
        GLYsrc: "/imageCode",
        GLYvalidateCode: "",
        GLYmessages: "",
        GLYloginType: "MyShiro",
        userPhone:'',
        dialog: false,
        UserPhone:'',
        LUserPsd:'',
        picLyanzhengma:'',
        checkCode:''
    }
  },
  methods:{
     // 图片验证码
      createCode(){
          code = "";    
          var codeLength = 4;//验证码的长度   
          var random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',   
           'S','T','U','V','W','X','Y','Z');//随机数   
          for(var i = 0; i < codeLength; i++) {//循环操作   
              var index = Math.floor(Math.random()*36);//取得随机数的索引（0~35）   
              code += random[index];//根据索引取得随机数加到code上   
          }   
              this.checkCode = code;//把code值赋给验证码   
      },
      // 失焦验证图和密码
      checkLpicma(){
          this.picLyanzhengma.toUpperCase();//取得输入的验证码并转化为大写         
          if(this.picLyanzhengma == '') {
              $(".login_content1 span:eq(2)").text("请输入验证码")
              $(".login_content1 span:eq(2)").removeClass("disappear");
          }else if(this.picLyanzhengma.toUpperCase() != this.checkCode ) { //若输入的验证码与产生的验证码不一致时    
              console.log(this.picLyanzhengma.toUpperCase())
              console.log(code)           
              $(".login_content1 span:eq(2)").text("验证码不正确")
              $(".login_content1 span:eq(2)").removeClass("disappear");
              this.createCode();//刷新验证码   
              this.picLyanzhengma = '';
          }else { //输入正确时   
              $(".login_content1 span:eq(2)").addClass("disappear");
              $(".login_content1 span:eq(2)").text("请输入验证码")
              return true;
          } 

      },
    GLYlogin(){
      let vm = this;
      if (this.GLYusername == null || this.GLYusername == '') {
        alert("用户名不能为空！")
      } else if (this.GLYpassword == null || this.GLYpassword == '') {
        alert("密码不能为空！")
      } 
      else if(this.checkLpicma() == true){
        alert("验证码错误！")
      } 
      else {
        var params = {
          username: vm.GLYusername,
          password: vm.GLYpassword,
          loginType: vm.GLYloginType
        }
        vm.$axios.post('/login', params).then(function (res) {
          if (res.data.code == '00000000') {          
            localStorage.removeItem('isLogin');
            localStorage.removeItem('XTOKEN');
            localStorage.removeItem('CURRENTUSER');
            localStorage.setItem('isLogin', 'TRUE');
            localStorage.setItem('XTOKEN',  res.data.data.token);
            localStorage.setItem('CURRENTUSER',  JSON.stringify(res.data.data.currentUser));
            this.CONSTANT.currentUser = res.data.data.currentUser;
            this.$router.push({ path: '/index' });
          } else if (res.data.code == '22222222') {
            this.$message.error("账号不存在");
          } else if (res.data.code == '33333333') {
            this.$message.error("密码不正确");
          } else {
            this.$message.error("登录失败");
            this.$router.push({ path: '/' });
          }          
        }.bind(this), function (error) {
          console.log(error)
        })
      }
    }
  },
    created(){
        this.createCode();
    }
}
</script>