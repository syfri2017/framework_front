<template>
    <!-- 用户登录 -->
    <el-row class="logincenter">
      <el-col :span="8" >&nbsp;</el-col>
      <el-col :span="8" style="text-align:-webkit-center">
        <div class="login-form" >
          <div class="filed left">
            <i class="iconfont icou"></i>
            <span >Username Recovery</span>
            <span class="signstyle"><router-link :to="{path:'/exhibition/login/en/login'}"><a @click="open()">Back to Login</a></router-link></span>
          </div>
          <form ref="GLYloginForm" id="GLYloginForm" autocomplete="off" name="loginform"  method="post">
            <div class="filed">
              <el-input placeholder="Association Email" v-model="FUmail" name="FUmail" id="FUmail" prefix-icon="iconfont icon-youxiang"></el-input>
              <button type="button" id="FUmail-btn" class="verficode phonebtn" @click="getFUMailCode()" v-text=FUmailCodeText :disabled="FUmailBtnDisabled"></button>
             </div>
            <div class="filed">
              <el-input placeholder="Mail Verification Code"  v-model="FUmailCode" name="FUmailCode" id="FUmailCode" prefix-icon="iconfont icon-youxiang1"></el-input>
            </div>
            <div class="filed lgin">
              <el-button type="danger" @click="FUIdentify()" round>Confirm</el-button>
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
         //忘记用户名
        FUmail: "",
        FUmailCode: "",
        FUmailCodeReal: "",
        FUmailCodeText: "Get Verification Code",
        FUtimer: null,
        FUmailBtnDisabled: false,
        //忘记用户名
        time: 60
    }
  },
  methods:{
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
    //忘记用户名
        FUmailCheck() {
            if (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/.test(this.FUmail))) {
                // 邮箱格式不正确
                alert("The email format is not correct");
                return false;
            } else {
                return true;
            }
        },
        getFUMailCode() {
            let vm = this;
            this.FUmailCode = "";
            if (this.FUmailCheck()) {
                this.FUmailCodeText = "Sending...";
                this.FUmailBtnDisabled = true;
                vm.$axios.get('/signin/getMailNumENG/' + this.FUmail + "/static").then(function (res) {
                    if (res.data.result == 0) { 
                        // 该邮箱未注册！
                        alert("The email is not registered!");
                        this.FUmailCodeText = "Get Verification Code";
                        this.FUmailBtnDisabled = false;
                    } else if (res.data.result == 1) {
                        vm.$axios.get('/signin/sendMailEng?mail=' + this.FUmail).then(function (res) {
                           
                            this.FUmailCodeReal = res.data.msg;
                            var count = this.time;
                            this.timer = setInterval(() => {
                                if (count == 0) {
                                    clearInterval(this.timer);
                                    this.timer = null;
                                    this.FUmailCodeText = "Get Verification Code";
                                    this.FUmailBtnDisabled = false;
                                } else {
                                    this.FUmailCodeText = count + "seconds later"
                                    count--;
                                    this.FUmailBtnDisabled = true;
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
        FUIdentify() {
            let vm = this;
            if (this.FUmail == null || this.FUmail == '') {
                alert("The email can not be empty!")
            } else if (this.FUmailCode == null || this.FUmailCode == '') {
                alert("The verification code can not be empty!")
            } else {
                if (this.FUmailCode == this.FUmailCodeReal) {
                    vm.$axios.get('/signin/getMailNumENG/' + this.FUmail + "/static").then(function (res) {
                        if (res.data.result == 0) {
                            alert("The email is not registered!");
                        } else if (res.data.result == 1) {
                            vm.$axios.get('/signin/getUsernameByMail/' + this.FUmail + "/static").then(function (res) {
                                alert("User name back to success!");
                                this.username = res.data;
                                // this.changeForm('loginFlag');
                            }.bind(this), function (error) {
                                console.log(error);
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    });

                } else {
                    //验证码输入错误，请核对后再试 
                    alert("Verification code input error, please check and try again");
                }
            }
        },

  }
}
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
  margin: 0px 1.875rem 1rem 1.875rem;
}

.lgin {
  margin-top: 8.8rem;
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
    margin-left: 4.5rem;
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

a {
    text-decoration: none;
    color:$bgcolor;
}

.icou{
  font-size:1.2rem;
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
  width: 100px;
}

</style>