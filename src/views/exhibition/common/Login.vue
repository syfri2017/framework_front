<template>
  <div class="login">
    <el-row>
      <el-col :span="6">
        <p>
          <img class="imgstyle" src="/static/images/login/QRCode.jpg">
        </p>
      </el-col>
      <el-col :span="12" class="logincenter" style="text-align:-webkit-center">
        <p class="pstyle">
          <img class="titlestyle" src="/static/images/login/title.png">
        </p>
      </el-col>
      <el-col :span="6" style="text-align:-webkit-center">
        <p style="margin:30px 50px 0px 0px">
          <span>
            <i class="iconfont icon-help lana"></i>
            <a class="lana" href="http://61.161.226.197:8090/templates/帮助手册.doc">帮助手册</a>
          </span>
          <a class="lan">&nbsp;&nbsp;|&nbsp;&nbsp;</a>
          <span class="lana">中文</span>
          <a class="lan">&nbsp;&nbsp;|&nbsp;&nbsp;</a>
          <span class="lanb" @click="clk()">English</span>
        </p>
        <p style="margin:10px 0px 0px 80px;">
          <span>
            <i class="iconfont icon-help lana"></i>
            <a class="lana" href="http://61.161.226.197:8090/templates/展馆图片.zip">下载展位图</a>
          </span>
        </p>
        <p style="margin:10px 0px 0px 80px;background:rgba(0,0,0,0.3);color:#fff;">
          <span>
            <i class="iconfont icon-help lana"></i>
            <a class="lana" @click="zgclk">查看展位图</a>
          </span>
        </p>
      </el-col>
    </el-row>
    <!-- <login></login> -->
    <router-view></router-view>
    <!-- <el-tabs v-model="activeName">
      <el-tab-pane label="登录" name="first" :key="'first'">
        <login></login>
      </el-tab-pane>
      <el-tab-pane label="注册" name="second" :key="'second'">
        <register></register>
      </el-tab-pane>
      <el-tab-pane label="忘记用户名" name="third" :key="'third'">
        <forgetpassword></forgetpassword>
      </el-tab-pane>
      <el-tab-pane label="忘记密码" name="forth" :key="'forth'">
        <forgetusername></forgetusername>
      </el-tab-pane>
      <el-tab-pane label="重置账户" name="fifth" :key="'fifth'">
        <reset></reset>
      </el-tab-pane>
    </el-tabs> -->
    <el-row class="footerstyle">
      <el-col :span="4">&nbsp;</el-col>
      <el-col :span="16" class="footer">
        <div>建议使用谷歌、搜狗、360和火狐浏览器</div>
        <div>如在登录、注册、信息录入时遇到问题，请联系技术支持024-31530337，分机号608；13998821420</div>
      </el-col>
      <el-col :span="4">&nbsp;</el-col>
    </el-row>
  </div>
</template>

<script>
import Login from "@/views/exhibition/login/ch/Login";
import Register from "@/views/exhibition/login/ch/Register";
import Reset from "@/views/exhibition/login/ch/Reset";
import ForgetPassword from "@/views/exhibition/login/ch/ForgetPassword";
import ForgetUsername from "@/views/exhibition/login/ch/ForgetUsername";

export default {
  name: "Login",
  components: {
    login: Login,
    register: Register,
    forgetpassword: ForgetPassword,
    forgetusername: ForgetUsername,
    reset: Reset
  },
  data() {
    return {
      //默认第一个选项卡
      activeName: "first"
    };
  },
  methods: {
    clk(){
      this.$router.push({ path: '/login/en/Login' });
    },
    zgclk(){
      this.$router.push({ path: '/plan/planAnon' });
    }
    //适配屏幕分辨率
      // autoWide() {
      //     //判断是否宽屏
      //     var winWide = window.screen.availWidth;
      //     // alert(winWide);
      //     var wideScreen = false;
      //     var zm = winWide / 1920;
      //     document.body.style.zoom = zm * 1;
      //   },
  }
};
</script>

<style lang="scss" scoped>
// @import '../../common/scss/all.scss';
$height: 22rem; //全局变量声明
$width: 22rem;
$heightimg: 8.75rem;
$widthimg: 8.75rem;
$heighttitle: 90%;
$widthtitle: 90%;
$bottomfooter: 3.125rem;
$heightfooter: 3.125rem;
$widthlgbtn: 12rem;
$line-heightfooter: 3.125rem;
$widthfooter: 100%;
$bgcolor: #ea2530;
$bgcolor2: rgb(234, 109, 37);
$whitecolor: #fff;
$color166: rgb(251, 106, 116);
$top0: 0;
$left0: 0;
$right0: 0;
$bottom0: 0;
$blackcolor: #2c2c2c;
.login {
  position: absolute;
  top: $top0;
  left: $top0;
  right: $right0;
  bottom: $bottom0;
  overflow: hidden;
  overflow-y: auto;
  z-index: 1000;
  background: url("/static/images/login/login.png") center 100% #65809d;

  * {
    font-size: 0.8rem;
  }

  p {
    margin: 4rem 0 0 6rem;
  }

  .imgstyle {
    height: $heightimg;
    width: $widthimg;
  }

  .titlestyle {
    height: $heighttitle;
    width: $widthtitle;
  }

  .pstyle {
    margin: 5rem 0 0 0;
  }
}

.lana {
  color: $whitecolor;
  font-size: 1rem;
  cursor: pointer;
  letter-spacing: 0.1rem;
}

.lanb {
  color: $blackcolor;
  font-size: 1rem;
  cursor: pointer;
}

.filed {
  margin: 0px 1.875rem 1.25rem 1.875rem;
}

.lgin {
  margin-top: 2.5rem;
  .el-button {
    width: $widthlgbtn;
    background-color: $bgcolor;
  }
  .el-button:hover {
    width: $widthlgbtn;
    background-color: $bgcolor2;
  }
}

.right {
  text-align: right;
  text-align: -webkit-right;
  color: $color166;
}

.left {
  color: $color166;
  padding-top: 30px;
  text-align: -webkit-left;
}

.login-form {
  height: $height;
  width: $width;
  background: url("/static/images/login/form_bg.png") no-repeat;
  .signstyle {
    margin-left: 7.5rem;
    a {
      cursor: pointer;
    }
  }
}

.el-button {
  border: 0px solid #dcdfe6;
}

.login-btn {
  color: $whitecolor;
  background-color: $bgcolor;
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

.footerstyle {
  position: absolute;
  bottom: $bottomfooter;
  height: $heightfooter;
  text-align: center;
  line-height: $line-heightfooter;
  width: $widthfooter;
}

.logincenter {
  margin-top: 3rem;
}

.muchtab {
  a {
    cursor: pointer;
  }
}

.clearfix:after{
    content:'';
    display:block;
    height:0;
    clear:both;
}
.login_or_register{
    background-color: #f2f2f5;
    padding-bottom: 50px;
}
/*logo*/
.logo1{
    text-align: center;
    padding:40px 0 50px ;
    margin:0 auto;
}
/*login和register部分*/
.login_bac{
    width:1180px;
    height: 728px;
    background-size: 1180px 728px;
    margin: 0 auto;
    position: relative;
}
.register_content{
    width:400px;
    background-color: #fff;
    box-shadow: 0 0 15px rgba(0, 0, 0, .5);
    position: absolute;
    left:60px;
    top:80px;
    padding-left: 30px;
    padding-bottom: 50px;
}
.tianxie_img{
    width:26px;
    vertical-align: middle;
    margin-right: 10px;
}
.tishixiaoxi{
    font-size: 14px;
    color:#ed711f;
    display: block;
    margin-left: 30px;
    line-height: 30px;
   
}
.yanzhengma_input{
  width: 170px;
}
.disappear{
     visibility:hidden;
}
.register_content p{
    margin-top: 30px;
    font-size: 25px;
    line-height: 18px;
    margin-bottom: 15px;
}
.register_content input{
    padding: 5px 0 5px 10px;
    margin-left: 30px;
    height: 30px;
    border: 1px solid #e6e6e6;
}
.register_content_input{
    width:300px;
    height: 30px;
    padding: 5px 0 5px 10px;
    border: 1px solid #e6e6e6;
    margin-left: 30px;
}
.verification{
    vertical-align: middle;
    margin-left: 10px;
}
.agreement{
    position: relative;
    top: -10px;
}
.read_already{
    position: relative;
    top:-21px;
    font-size: 12px;
    color: #999;
    cursor: pointer;
    margin-left: 5px;
}
.read_already a{
    color:#053d84;
}
.send_message{
    display: inline-block;
    height: 40px;
    line-height: 40px;
    color:#ccc;
    padding-left: 45px;
    padding-right: 5px;
    background: url('/static/img/message.png') no-repeat 10px 8px;
    background-size: 25px;
    border: 1px solid #f3f3f3;
    margin-left: 10px;
    cursor: pointer;
}
.next{
    display: block;
    width: 287px;
    height: 50px;
    font-size: 18px;
    text-align: center;
    line-height: 50px;
    color: #fff;
    background-color: #053d84;
    border-radius: 5px;
    margin-left: 40px;
    cursor: pointer;

}
/*登录模块*/
.login_content1{
    width:400px;
    background-color: #fff;
    box-shadow: 0 0 15px rgba(0, 0, 0, .5);
    position: absolute;
    right:60px;
    top:80px;
    padding-left: 30px;
    padding-bottom: 50px;
}
.user_login{
    display: block;
    width: 287px;
    height: 50px;
    font-size: 18px;
    text-align: center;
    line-height: 50px;
    color: #fff;
    background-color: #a2be3c;
    border-radius: 5px;
    margin-left: 40px;
    cursor:pointer;
}
.login_content1 p{
    margin-top: 30px;
    font-size: 25px;
    line-height: 18px;
    margin-bottom: 15px;
}
.login_content1 input{
    padding: 5px 0 5px 10px;
    margin-left: 30px;
    height: 30px;
    border: 1px solid #e6e6e6;
}
.verification1{
    // vertical-align: middle;
    // transform: translate(-15px,0);
    height: 2.5rem;
    width: 7.1875rem;
}
.forget{
    text-align: right;
    position: relative;
    top:-20px;
    cursor: pointer;
}
.forget a{
    font-size: 14px;
    color:#053d84;
    margin-right: 80px;
}
#code{
    font-size: 18px;
    letter-spacing:3px;
    color: #053d84;
    background: #f2f2f5;
}
/*弹窗*/
.tanchuang{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color:rgba(0,0,0,.5);
    z-index:100;
}
.hiddenTanchuang{
    display: none;
}
.inTanchuang{
    position: absolute;
    text-align: center;
    width: 300px;
    height: 169px;
    padding-top: 10px;
    left: 50%;
    top: 50%;
    border-radius: 10px;
    -webkit-transform: translateX(-50%) translateY(-50%);
    -ms-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
    background-color: #fff;
}
.errorIcon{
    width:55px;
}
.register_content  .cue{
    font-size: 14px;
    text-align: center;
    margin-top: 15px;
}
.sure{
    display: inline-block;
    color: #fff;
    width: 100px;
    height: 20px;
    padding: 6px 10px;
    background: #053D84;
    border-radius: 5px;
    font-size: 18px;
    line-height: 18px;
    margin-top: 10px;
    cursor: pointer;
}

</style>