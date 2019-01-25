<template>
  <div class="login">
    <el-row>
      <el-col :span="6" >
        <p style="margin:50px 0px 0px 80px">
        <img src="/static/images/login/QRCode.jpg" height="140px" width="140px">
        </p>
      </el-col>
      <el-col :span="12"  style="text-align:-webkit-center" >
        <p style="margin:80px 0px 0px 0px">
          <img src="/static/images/login/title.png" height="90%" width="90%" >
        </p>
      </el-col>
      <el-col :span="6" style="text-align:-webkit-center" >
          <p style="margin:30px 50px 0px 0px">
            <span>
              <i class="iconfont icon-help lana"></i>
              <a class="lana" href="http://61.161.226.197:8090/templates/帮助手册.doc">帮助手册</a>
            </span>
            <a class="lan">&nbsp;&nbsp;|&nbsp;&nbsp;</a>
            <span class="lana">中文</span><a class="lan">&nbsp;&nbsp;|&nbsp;&nbsp;</a>
            <span class="lanb">English</span>
          </p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" >&nbsp;</el-col>
      <el-col :span="8" style="text-align:-webkit-center">
        <div class="login-form" >
          <div class="filed left" style="padding-top:30px;text-align:-webkit-left;">
            <i class="iconfont icon-user" style="font-size:18px;"></i>
            <span style="margin-right:100px;font-size:18px;">用户登录</span>
            <span >没有账户?<a >去注册</a></span>
          </div>
          <form ref="GLYloginForm" id="GLYloginForm" autocomplete="off" name="loginform"  method="post">
            <div class="filed ">
              <el-input placeholder="用户名" v-model="GLYusername" prefix-icon="iconfont icon-user"></el-input>
            </div>
            <div class="filed">
              <el-input placeholder="密码" v-model="GLYpassword" prefix-icon="iconfont icon-passwd" type="password"></el-input>
            </div>
            <div class="filed left" >
              <span ><a>忘记用户名</a>  |  <a>忘记密码</a>  |  <a>重置账户</a></span>
            </div>
            <div class="filed">
              <el-button class="login-btn" @click="GLYlogin">
                &nbsp;&nbsp;&nbsp;&nbsp;登&nbsp;&nbsp;&nbsp;&nbsp;录&nbsp;&nbsp;&nbsp;&nbsp;
              </el-button>
            </div>
          </form>
        </div>
      </el-col>
      <el-col :span="8">&nbsp;</el-col>
    </el-row>
    <el-row style="margin-top:100px">
      <el-col :span="4" >&nbsp;</el-col>
      <el-col :span="16" class="footer">
        <div >建议使用谷歌、搜狗、360和火狐浏览器</div>
        <div >如在登录、注册、信息录入时遇到问题，请联系技术支持024-31530337，分机号608；13998821420</div>
      </el-col>
      <el-col :span="4" >&nbsp;</el-col>
    </el-row>
  </div>
</template>

<script>
// import axios from 'axios';
// axios.defaults.baseURL = window.config.domain;
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
      if (this.GLYusername == null || this.GLYusername == '') {
        alert("用户名不能为空！")
      } else if (this.GLYpassword == null || this.GLYpassword == '') {
        alert("密码不能为空！")
      } else {
        var params = {
          username: this.GLYusername,
          password: this.GLYpassword,
          loginType: this.GLYloginType
        }
        this.axios.post('/vueCliLogin', params).then(function (res) {
          var message = res.data;
          if ("success" == message) {
            this.axios.get('/shiro').then(function (res) {
              this.$store.commit('$_setStorage', res.data);
              this.$store.commit('$_setLogin', 'Y');
              this.$router.push({name: 'index'});
            }.bind(this), function (error) {
              console.log(error)
            })
          } else if ("kaptcha" == message) {
            this.$message.error('验证码错误');
          } else if ("unknown" == message) {
            this.$message.error('账号不存在');
          } else if ("incorrect" == message) {
            this.$message.error('密码不正确');
          } else if ("excessive" == message) {
            this.$message.error('密码输入错误次数超过5次');
          } else {
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

<style scoped>
.login{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  overflow-y: auto;
  z-index:1000;
  background: url('/static/images/login/login.png') center 100% #65809d;
}
.login *{
  font-size:12px;
}
.lana {
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    letter-spacing: 2px;
}
.lanb {
    color: #2c2c2c;
    font-size: 18px;
    cursor: pointer;
}
.filed{
    margin: 0px 30px 20px 30px;
}
.left{
  text-align: right;
  text-align:-webkit-right;
  color: rgb(251, 106, 116)
}
.login-form{
  height: 340px;
  width: 350px;
  background: url('/static/images/login/form_bg.png') no-repeat;
}
.login-form *{
  color:#EA2530
}
.el-button{
    border: 0px solid #dcdfe6
}
.login-btn{
  color:#fff;
  background-color:#EA2530;
  font-size:16px;
  margin-top: 10px;
}
.footer{
  text-align:-webkit-center;
  color:#fff;
  font-size: 18px;
}
.footer *{
  text-align:-webkit-center;
  color:#fff;
  font-size: 16px;
}
</style>
