<template>
  <!-- 用户登录 -->
  <el-row class="logincenter">
    <el-col :span="8">&nbsp;</el-col>
    <el-col :span="8" style="text-align:-webkit-center">
      <div class="login-form">
        <div class="filed left">
          <i class="iconfont icou"></i>
          <span>用户注册</span>
          <span class="signstyle">没有账户?
            <router-link :to="{path:'/exhibition/login/ch/login'}">
              <a @click="open()">去登录</a>
            </router-link>
          </span>
        </div>

        <form autocomplete="off" name="reg-form">
          <div class="filed">
            <el-input type="text" class="inputstyle" v-model="mobile" name="mobile" id="mobile" placeholder="请输入手机号" prefix-icon="iconfont icon-web-icon-"
              @blur="mobileCheck"
            ></el-input>
            <button
              type="button"
              id="mobile-btn"
              class="verficode phonebtn"
              @click="getMessageCode()"
              v-text="messageCodeText"
              :disabled="mobileBtnDisabled"
            ></button>
             <p class="alert" v-show="mobileAlertFlag">*请填写正确的手机号码</p>
          </div>
          <div class="filed">
            <el-input
              v-model="messageCode" 
              name="messageCode" 
              id="messageCode"
              placeholder="请输入手机验证码"
              @blur="messageCodeCheck"
              prefix-icon="iconfont icon-message-channel"
            ></el-input>
            <p class="alert1" v-show="messageCodeAlertFlag">*请填写正确的手机验证码</p>
          </div>
          <div class="filed">
            <el-input
              placeholder="请输入密码"
              prefix-icon="iconfont icon-password"
              type="password"
              class="inputstyle"
              v-model="password1"
              name="password1"
              id="password1"
              @focus="password1Tip"
              @blur="password1Check"
            ></el-input>
            <p class="tip" v-show="password1TipFlag">*密码需为6-16位字母数字组合</p>
            <p class="alert2" v-show="password1AlertFlag">*密码不合规，请重新填写</p>
          </div>
          <div class="filed">
            <el-input
              type="password"
              class="inputstyle"
              v-model="password2"
              name="password2"
              id="password2"
              placeholder="请再次输入密码"
              @blur="password2Check"
              prefix-icon="iconfont icon-querenmima-copy"
            ></el-input>
            <p class="alert3" v-show="password2AlertFlag">*两次填写不一致，请重新填写</p>
          </div>

          <div class="filed lgin">
            <el-button type="danger" @click="register()" round>注册</el-button>
          </div>
        </form>
      </div>
    </el-col>
    <el-col :span="8">&nbsp;</el-col>
  </el-row>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      //注册
      time: 60,
      timer: null,
      mobile: "",
      messageCode: "",
      messageCodeReal: "",
      messageCodeText: "获取验证码",
      password1: "",
      password2: "",
      mobileBtnDisabled: false,
      //注册校验标识
        mobileAlertFlag: false,
        messageCodeAlertFlag: false,
        password1TipFlag: false,
        password1AlertFlag: false,
        password2AlertFlag: false
    };
  },
  methods: {
    //校验
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
    //注册
    mobileCheck() {
      if (!/^1[34578]\d{9}$/.test(this.mobile)) {
        this.mobileAlertFlag = true;
        return false;
      } else {
        this.mobileAlertFlag = false;
        return true;
      }
    },
    getMessageCode() {
      
      let vm = this;
      this.messageCode = "";
      if (this.mobileCheck()) {
        this.messageCodeText = "发送中...";
        this.mobileBtnDisabled = true;
        vm.$axios.get("/signin/getUsernameNum/" + this.mobile + "/static").then(
          function(res) {
            if (res.data.result != 0) {
              alert("用户名已存在！");
              this.messageCodeText = "获取验证码";
              this.mobileBtnDisabled = false;
            } else {
              vm.$axios.get("/signin/sendMessage?phone=" + this.mobile).then(
                function(res) {
                  this.messageCodeReal = res.data.msg;
                  var count = this.time;
                  this.timer = setInterval(() => {
                    if (count == 0) {
                      clearInterval(this.timer);
                      this.timer = null;
                      this.messageCodeText = "获取验证码";
                      this.mobileBtnDisabled = false;
                    } else {
                      this.messageCodeText = count + "秒后获取";
                      count--;
                      this.mobileBtnDisabled = true;
                    }
                  }, 1000);
                }.bind(this),
                function(error) {
                  console.log(error);
                }
              );
            }
          }.bind(this),
          function(error) {
            console.log(error);
          }
        );
      }
    },
    messageCodeCheck() {
      if (!/^[0-9a-zA-Z]{6}$/.test(this.messageCode)) {
        this.messageCodeAlertFlag = true;
        return false;
      } else {
        this.messageCodeAlertFlag = false;
        return true;
      }
    },
    password1Check() {
      if (
        !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.password1)
      ) {
        this.password1TipFlag = false;
        this.password1AlertFlag = true;
        return false;
      } else {
        this.password1TipFlag = false;
        this.password1AlertFlag = false;
        return true;
      }
    },
    password1Tip() {
      this.password1TipFlag = true;
      this.password1AlertFlag = false;
    },
    password2Check() {
      if (this.password1 !== this.password2) {
        this.password2AlertFlag = true;
        return false;
      } else {
        this.password2AlertFlag = false;
        return true;
      }
    },
    register() {
      let vm = this;
      this.mobileCheck();
      this.messageCodeCheck();
      this.password1Check();
      this.password2Check();
      if (
        this.mobileCheck() &&
        this.messageCodeCheck() &&
        this.password1Check() &&
        this.password2Check() &&
        this.messageCode == vm.messageCodeReal
      ) {
        var params = {
          username: this.mobile,
          password: this.password1,
          usertype: "CHN",
          deptid: "ZSYH"
        };
        vm.$axios.post("/signin/insertByVO", params).then(
          function(res) {
            alert("注册成功！");
            this.username = this.mobile;
            this.password = this.password1;
            this.changeForm("loginFlag");
          }.bind(this),
          function(error) {
            console.log(error);
          }
        );
      }
    }
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
    font-size: 1rem;
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
  margin: 0px 1.875rem 1rem 1.875rem;
}

.lgin {
  margin-top: 4rem;
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
  height: 400px;
  width: 400px;
  background: url("/static/images/login/form_bg.png") no-repeat;
  background-size:100% 100%; 
  .signstyle {
    margin-left: 8.3rem;
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

.clearfix:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
}
.login_or_register {
  background-color: #f2f2f5;
  padding-bottom: 50px;
}
/*logo*/
.logo1 {
  text-align: center;
  padding: 40px 0 50px;
  margin: 0 auto;
}
/*login和register部分*/
.login_bac {
  width: 1180px;
  height: 728px;
  background-size: 1180px 728px;
  margin: 0 auto;
  position: relative;
}
.register_content {
  width: 400px;
  background-color: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  position: absolute;
  left: 60px;
  top: 80px;
  padding-left: 30px;
  padding-bottom: 50px;
}
.tianxie_img {
  width: 26px;
  vertical-align: middle;
  margin-right: 10px;
}
.tishixiaoxi {
  font-size: 14px;
  color: #ed711f;
  display: block;
  margin-left: 30px;
  line-height: 30px;
}
.yanzhengma_input {
  width: 170px;
}
.disappear {
  visibility: hidden;
}
.register_content p {
  margin-top: 30px;
  font-size: 25px;
  line-height: 18px;
  margin-bottom: 15px;
}
.register_content input {
  padding: 5px 0 5px 10px;
  margin-left: 30px;
  height: 30px;
  border: 1px solid #e6e6e6;
}
.register_content_input {
  width: 300px;
  height: 30px;
  padding: 5px 0 5px 10px;
  border: 1px solid #e6e6e6;
  margin-left: 30px;
}
.verification {
  vertical-align: middle;
  margin-left: 10px;
}
.agreement {
  position: relative;
  top: -10px;
}
.read_already {
  position: relative;
  top: -21px;
  font-size: 12px;
  color: #999;
  cursor: pointer;
  margin-left: 5px;
}
.read_already a {
  color: #053d84;
}
.send_message {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  color: #ccc;
  padding-left: 45px;
  padding-right: 5px;
  background: url("/static/img/message.png") no-repeat 10px 8px;
  background-size: 25px;
  border: 1px solid #f3f3f3;
  margin-left: 10px;
  cursor: pointer;
}
.next {
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
.login_content1 {
  width: 400px;
  background-color: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  position: absolute;
  right: 60px;
  top: 80px;
  padding-left: 30px;
  padding-bottom: 50px;
}
.user_login {
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
  cursor: pointer;
}
.login_content1 p {
  margin-top: 30px;
  font-size: 25px;
  line-height: 18px;
  margin-bottom: 15px;
}
.login_content1 input {
  padding: 5px 0 5px 10px;
  margin-left: 30px;
  height: 30px;
  border: 1px solid #e6e6e6;
}
.verification1 {
  // vertical-align: middle;
  // transform: translate(-15px,0);
  height: 2.5rem;
  width: 7.1875rem;
}
.forget {
  text-align: right;
  position: relative;
  top: -20px;
  cursor: pointer;
}
.forget a {
  font-size: 14px;
  color: #053d84;
  margin-right: 80px;
}
#code {
  font-size: 18px;
  letter-spacing: 3px;
  color: #053d84;
  background: #f2f2f5;
}
/*弹窗*/
.tanchuang {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.hiddenTanchuang {
  display: none;
}
.inTanchuang {
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
.errorIcon {
  width: 55px;
}
.register_content .cue {
  font-size: 14px;
  text-align: center;
  margin-top: 15px;
}
.sure {
  display: inline-block;
  color: #fff;
  width: 100px;
  height: 20px;
  padding: 6px 10px;
  background: #053d84;
  border-radius: 5px;
  font-size: 18px;
  line-height: 18px;
  margin-top: 10px;
  cursor: pointer;
}

a {
  text-decoration: none;
  color: $bgcolor;
}

.icou {
  font-size:2.2rem;
}

/*获取验证码样式*/
.phonebtn {
  position: absolute;
  margin-top: -1.82rem;
  margin-left: 4.2rem;
  border: none;
  background: #ffffff;
  color: #fb6a74;
  cursor: pointer;
}

.alert{
  position:absolute;
  top:69px;
  margin-left:0px !important;
  color:#EA2530;
  }

  .alert1{
  position:absolute;
  top:125px;
  margin-left:0px !important;
  color:#EA2530;
  }

  .alert2{
  position:absolute;
  top:181px;
  margin-left:0px !important;
  color:#EA2530;
  }

  .tip{
  position:absolute;
  top:181px;
  margin-left:0px !important;
  color:#EA2530;
  }

  .alert3{
  position:absolute;
  top:239px;
  margin-left:0px !important;
  color:#EA2530;
  }
</style>