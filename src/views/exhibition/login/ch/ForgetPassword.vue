<template>
    <!-- 用户登录 -->
    <el-row class="logincenter">
      <el-col :span="8" >&nbsp;</el-col>
      <el-col :span="8" style="text-align:-webkit-center">
        <div class="login-form" >
          <div class="filed left">
            <i class="iconfont icou"></i>
            <span >密码修改</span>
            <span class="signstyle"><router-link :to="{path:'/exhibition/login/ch/login'}"><a @click="open()">返回登录</a></router-link></span>
          </div>
          <form ref="GLYloginForm" id="GLYloginForm" autocomplete="off" name="loginform"  method="post">
            <div class="filed lgin">
                <router-link :to="{path:'/exhibition/login/ch/mailbox'}"><el-button type="danger" round>邮箱找回</el-button></router-link>
            </div>
            <div class="filed lgin">
                <router-link :to="{path:'/exhibition/login/ch/phone'}"><el-button type="danger" round>手机找回</el-button></router-link>
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
     //消息提示框
     open() {
        this.$alert('未保存的数据将丢失，确定返回吗？', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `未保存的数据将丢失！`
            });
          }
        });
      },
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

<style lang="scss" scoped>
@import '@/common/scss/login.scss';
.lgin {
  margin-top: 3.5rem;
  .el-button {
    font-size:20px;
    color:#fff;
    width: 280px;
    background-color: #ea2530;
  }
  .el-button:hover {
    font-size:20px;
    color:#fff;
    width: 280px;
    background-color: #ea2530;
  }
}
</style>