<template>
  <div class="login">
    <el-row>
      <el-col :span="6" >
        <p>
        <img class="imgstyle" src="/static/images/login/QRCode.jpg">
        </p>
      </el-col>
      <el-col :span="12" class="logincenter" style="text-align:-webkit-center" >
        <p class="pstyle">
          <img class="titlestyle" src="/static/images/login/title.png">
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
    <el-row class="logincenter">
      <el-col :span="8" >&nbsp;</el-col>
      <el-col :span="8" style="text-align:-webkit-center">
        <div class="login-form" >
          <div class="filed left">
            <i class="iconfont icon-user"></i>
            <span >用户登录</span>
            <span class="signstyle">没有账户?<a >去注册</a></span>
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
              <span class="muchtab"><a>忘记用户名</a>  |  <a>忘记密码</a>  |  <a>重置账户</a></span>
            </div>
            <div class="filed lgin">
              <el-button type="danger" @click="GLYlogin" round>登录</el-button>
            </div>
          </form>
        </div>
      </el-col>
      <el-col :span="8">&nbsp;</el-col>
    </el-row>
    <el-row class="footerstyle">
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

<style lang="scss">
// @import '../../common/scss/all.scss';
$height:22rem; //全局变量声明
$width:22rem;
$heightimg:8.75rem;
$widthimg:8.75rem;
$heighttitle:90%; 
$widthtitle:90%;
$bottomfooter: 3.125rem;
$heightfooter: 3.125rem;
$widthlgbtn:12rem;
$line-heightfooter: 3.125rem;
$widthfooter: 100%;
$bgcolor:#EA2530;
$bgcolor2:rgb(234, 109, 37);
$whitecolor: #fff;
$color166:rgb(251, 106, 116);
$top0:0;
$left0: 0;
$right0:0;
$bottom0: 0;
$blackcolor:#2c2c2c;
.login {
  position: absolute;
  top:$top0;
  left: $top0;
  right:$right0;
  bottom: $bottom0;
  overflow: hidden;
  overflow-y: auto;
  z-index: 1000;
  background: url('/static/images/login/login.png') center 100% #65809d;

  * {
    font-size: 0.8rem;
  }

  p {
    margin:4rem 0 0 6rem;
  }

  .imgstyle{
      height:$heightimg;
      width:$widthimg;
    }

  .titlestyle{
    height:$heighttitle; 
    width:$widthtitle;
  } 

  .pstyle{
    margin:5rem 0 0 0;
  }
  
}

.lana {
  color: $whitecolor;
  font-size: 1rem;
  cursor: pointer;
  letter-spacing: 0.1rem;
}

.lanb {
  color:$blackcolor;
  font-size: 1rem;
  cursor: pointer;
}

.filed {
  margin: 0px 1.875rem 1.25rem 1.875rem;
}

.lgin{
  margin-top: 2.5rem;
  .el-button{
    width:$widthlgbtn;
    background-color: $bgcolor;
  }
  .el-button:hover{
    width:$widthlgbtn;
    background-color:$bgcolor2;
  }
}

.right {
  text-align: right;
  text-align: -webkit-right;
  color:$color166;
  
}

.left {
  color:$color166;
  padding-top:30px;
  text-align:-webkit-left;
}

.login-form {
  height: $height;
  width: $width;
  background: url('/static/images/login/form_bg.png') no-repeat;
  .signstyle {
    margin-left: 8.5rem;
    a{
      cursor: pointer;
    }
  }
}

.el-button {
  border: 0px solid #dcdfe6;
}

.login-btn {
  color:$whitecolor;
  background-color:$bgcolor;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.footer {
  text-align: -webkit-center;
  color: $whitecolor;
  font-size: 1rem;
  * {
    text-align: -webkit-center;
    color: $whitecolor;
    font-size: 1rem;
  }
}

.footerstyle{
  position: absolute;
  bottom: $bottomfooter;
  height: $heightfooter;
  text-align: center;
  line-height: $line-heightfooter;
  width: $widthfooter;
}

.logincenter{
  margin-top:3rem;
}

.muchtab{
  a{
    cursor: pointer;
  }
}
</style>