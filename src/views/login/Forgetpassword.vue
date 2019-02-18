<template>
    <!-- 用户登录 -->
          <el-row class="logincenter">
            <el-col :span="8" >&nbsp;</el-col>
            <el-col :span="8" style="text-align:-webkit-center">
              <div class="login-form" >
                <div class="filed left">
                  <i class="iconfont icon-user"></i>
                  <span >密码修改</span>
                  <span class="signstyle"><a >返回登录</a></span>
                </div>
                <form ref="GLYloginForm" id="GLYloginForm" autocomplete="off" name="loginform"  method="post">
                  <div class="filed ">
                    <el-input placeholder="用户名" v-model="GLYusername" prefix-icon="iconfont icon-icon_zhanghao"></el-input>
                  </div>
                  <div class="filed">
                    <el-input placeholder="密码" v-model="GLYpassword" prefix-icon="iconfont icon-password" type="password"></el-input>
                  </div>
                  <div class="filed">
                    <el-input placeholder="验证码" prefix-icon="iconfont icon-zhanghaoquanxianguanli"></el-input>
                  </div>
                  <div class="filed right" >
                    <span class="muchtab"><a></a>  |  <a></a>  |  <a></a></span>
                  </div>
                  <div class="filed lgin">
                    <el-button type="danger" @click="GLYlogin" round>确定</el-button>
                  </div>
                </form>
              </div>
            </el-col>
            <el-col :span="8">&nbsp;</el-col>
          </el-row>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
        GLYusername: "",
        GLYpassword: "",
        GLYsrc: "/imageCode",
        GLYvalidateCode: "",
        GLYmessages: "",
        GLYloginType: "MyShiro"
    }
  },
  methods:{
    GLYlogin(){
      let vm = this;
      if (this.GLYusername == null || this.GLYusername == '') {
        alert("用户名不能为空！")
      } else if (this.GLYpassword == null || this.GLYpassword == '') {
        alert("密码不能为空！")
      } else {
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
  }
}
</script>