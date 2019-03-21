<template>
  <!-- 用户登录 -->
  <el-row class="logincenter">
    <el-col :span="8">&nbsp;</el-col>
    <el-col :span="8" style="text-align:-webkit-center">
      <div class="login-form">
        <div class="filed left">
          <i class="iconfont icou"></i>
          <span class="formTitleStyle">User Registration</span>
          <span class="signstyle">Exist Account?<router-link :to="{path:'/exhibition/login/en/login'}"><a @click="open()">Login</a></router-link>
          </span>
        </div>
        <form autocomplete="off" name="reg-form">
          <div class="filed">
            <el-input v-model="mail" name="mail" id="mail" placeholder="Email" @blur="mailCheck" type="text" class="inputstyle" prefix-icon="iconfont icon-youxiang"></el-input>
            <button type="button" id="mail-btn" class="verficode phonebtn" @click="getMailCode()" v-text=mailCodeText :disabled="mailBtnDisabled"></button>
            <p class="alert" v-show="mailAlertFlag">*Please fill in the correct E-mail number.</p>
          </div>
          <div class="filed">
            <el-input v-model="mailCode" name="mailCode" id="mailCode" placeholder="Mail Verification Code" @blur="mailCodeCheck" prefix-icon="iconfont icon-youxiang1"></el-input>
            <p class="alert1" v-show="mailCodeAlertFlag">*The verification code can not be empty.</p>
          </div>
          <div class="filed">
            <el-input placeholder="Please input a password" prefix-icon="iconfont icon-password" type="password" class="inputstyle" v-model="password1" name="password1"
              id="password1" @focus="password1Tip" @blur="password1Check"></el-input>
            <p class="tip" v-show="password1TipFlag">*Password must be 6-16-bit alphanumeric combination.</p>
            <p class="alert2" v-show="password1AlertFlag">*Password is not in order. Please fill it out again.</p>
          </div>
          <div class="filed">
            <el-input type="password" class="inputstyle" v-model="password2" name="password2" id="password2"
              placeholder="Please input the password again" @blur="password2Check" prefix-icon="iconfont icon-querenmima-copy"></el-input>
            <p class="alert3" v-show="password2AlertFlag">*The two entries do not match. Please fill in again.</p>
          </div>
          <div class="filed lgin">
            <el-button type="danger" @click="register()" round>Register</el-button>
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
      mail: "",
      mailCode: "",
      mailCodeReal: "",
      mailCodeText: "Get Verification Code",
      mailBtnDisabled: false,
      password1: "",
      password2: "",
      //注册校验标识
      mailAlertFlag: false,
      mailCodeAlertFlag: false,
      password1TipFlag: false,
      password1AlertFlag: false,
      password2AlertFlag: false,
    };
  },
  methods: {
    //消息提示框
    open() {
      this.$alert('Unsaved data will be lost. Are you sure to return it?', 'Tips', {
        confirmButtonText: 'Sure',
        callback: action => {
          this.$message({
            type: 'info',
            message: `Unsaved data will be lost!`
          });
        }
      });
    },
    //注册
    mailCheck() {
      if (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/.test(this.mail))) {
        // 邮箱格式不正确
        this.mailAlertFlag = true;
        return false;
      } else {
        this.mailAlertFlag = false;
        return true;
      }
    },
    getMailCode() {
      let vm = this;
      this.mailCode = "";
      if (this.mailCheck()) {
        this.mailCodeText = "Sending...";
        this.mailBtnDisabled = true;
        vm.$axios.get('/signin/getMailNumENG/' + this.mail + "/static").then(function (res) {
          if (res.data.result !== 0) {
            // 该邮箱已注册！
            alert("The email is registered!");
            this.mailCodeText = "Get Verification Code";
            this.mailBtnDisabled = false;
          } else {
            vm.$axios.get('/signin/sendMailEng?mail=' + this.mail).then(function (res) {
              this.mailCodeReal = res.data.msg;
              var count = this.time;
              this.timer = setInterval(() => {
                if (count == 0) {
                  clearInterval(this.timer);
                  this.timer = null;
                  this.mailCodeText = "Get Verification Code";
                  this.mailBtnDisabled = false;
                } else {
                  this.mailCodeText = count + "seconds later"
                  count--;
                  this.mailBtnDisabled = true;
                }
              }, 1000)
            }.bind(this), function (error) {
                console.log(error);
            });
          }
        }.bind(this), function (error) {
            console.log(error);
        });
      }
    },
    mailCodeCheck: function () {
      if (!(/^[0-9a-zA-Z]{6}$/.test(this.mailCode))) {
        this.mailCodeAlertFlag = true;
        return false;
      } else {
        this.mailCodeAlertFlag = false;
        return true;
      }
    },
    password1Check: function () {
      if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.password1))) {
        this.password1TipFlag = false;
        this.password1AlertFlag = true;
        return false;
      } else {
        this.password1TipFlag = false;
        this.password1AlertFlag = false;
        return true;
      }
    },
    password1Tip: function () {
      this.password1TipFlag = true;
      this.password1AlertFlag = false;
    },
    password2Check: function () {
      if (this.password1 !== this.password2) {
        this.password2AlertFlag = true;
        return false;
      } else {
        this.password2AlertFlag = false;
        return true;
      }
    },
    register: function () {
      this.$router.replace({name:"exhibition/login/en/Login", query: {username: this.mail, password: this,password1, type: 'register'}});
      return;
      let vm = this;
      this.mailCheck();
      this.mailCodeCheck();
      this.password1Check();
      this.password2Check();
      
      if (this.mailCheck() && this.mailCodeCheck() && this.password1Check() && this.password2Check() && this.mailCode == this.mailCodeReal) {
        var params = {
          username: this.mail,
          password: this.password1,
          usertype: "ENG",
          deptid: "ZSYH"
        }
        vm.$axios.post('/signin/insertByVO', params).then(function (res) {
          //注册成功！ 
          alert("Registration is successful.");
          this.username = this.mail;
          this.password = this.password1;
          this.$router.push({name:"exhibition/login/en/Login", query: {username: this.mail, password: this,password1, type: 'register'}});
          // this.changeForm('loginFlag');
        }.bind(this), function (error) {
          console.log(error)
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/common/scss/login.scss';
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
    font-size: 0.9rem;
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
    float: right;
    margin-top: 1.4rem;
    // margin-left: 0.6rem;
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

/*Get Verification Code样式*/
.phonebtn {
  position: absolute;
  margin-top: -2.52rem;
  margin-left: 2.2rem;
  border: none;
  background:rgba(0, 0, 0, 0);
  color: #fb6a74;
  cursor: pointer;
  width: 120px;
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
.formTitleStyle{
  font-size: 1.5rem;
}
</style>