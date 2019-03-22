<template>
    <!-- 用户登录 -->
    <el-row class="logincenter">
      <el-col :span="8" >&nbsp;</el-col>
      <el-col :span="8" style="text-align:-webkit-center">
        <div class="login-form" >
          <div class="filed left">
            <i class="iconfont icou"></i>
            <span class="formTitleStyle">Password Modification</span>
            <span class="signstyle"><router-link :to="{path:'/exhibition/login/en/login'}"><a @click="open()">Return Login</a></router-link></span>
          </div>
          <form ref="GLYloginForm" id="GLYloginForm" autocomplete="off" name="loginform"  method="post">
            <div class="filed">
            <el-input placeholder="Email" v-model="FPBmail" name="FPBmail" id="FPBmail" prefix-icon="iconfont icon-youxiang"></el-input>
            <button type="button" id="FUmail-btn" class="verficode phonebtnEN" @click="getFPBMailCode11()" v-text=FPBmailCodeText :disabled="FPBmailBtnDisabled"></button>
            </div>
            <div class="filed">
            <el-input placeholder="Mail Verification Code"  v-model="FPBmailCode" name="FPBmailCode" id="FPBmailCode" prefix-icon="iconfont icon-youxiang1"></el-input>
            </div>
            <div class="filed lgin">
            <el-button type="danger" @click="FPBIdentifyen()" round>Confirm</el-button>
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
       //忘记密码
        FPBmail: "",
        FPBmailCode: "",
        FPBmailCodeReal: "",
        FPBmailCodeText: "Get Verification Code",
        FPBtimer: null,
        FPDusername: "",
        FPDpassword1: "",
        FPDpassword2: "",
        FPDregisterData: "",
        FPBmailBtnDisabled: false,
        //忘记密码
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
   //忘记密码
        //B
        FPBmailCheck() {
            if (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/.test(this.FPBmail))) {
                //邮箱格式不正确
                alert("The email format is not correct");
                return false;
            } else {
                return true;
            }
        },
        getFPBMailCode11() {
            let vm = this;
            this.FPBmailCode = "";
            if (this.FPBmailCheck()) {
                this.FPBmailCodeText = "Sending...";
                this.FPBmailBtnDisabled = true;
                vm.$axios.get('/signin/getUsernameNum/' + this.FPBmail + "/static").then(function (res) {
                    if (res.data.result == 0) {
                        //该邮箱未注册！
                        alert("The email is not registered!");
                        this.FPBmailCodeText = "Get Verification Code";
                        this.FPBmailBtnDisabled = false;
                    } else if (res.data.result == 1) {
                        vm.$axios.get('/signin/sendMailEng?mail=' + this.FPBmail).then(function (res) {
                            this.FPBmailCodeReal = res.data.msg;
                            var count = this.time;
                            this.FPBtimer = setInterval(() => {
                                if (count == 0) {
                                    clearInterval(this.FPBtimer);
                                    this.FPBtimer = null;
                                    this.FPBmailCodeText = "Get Verification Code";
                                    this.FPBmailBtnDisabled = false;
                                } else {
                                    this.FPBmailCodeText = count + "seconds later"
                                    count--;
                                    this.FPBmailBtnDisabled = true;
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
        changeForm(flag) {
            if (flag == 'loginFlag') {
            } else if (flag == 'regFlag') {
            } else if (flag == 'FUAFlag') {
                this.FUmail = "";
                this.FUmailCode = "";
            } else if (flag == 'FPBFlag') {
                this.FPBmail = "";
                this.FPBmailCode = "";
                this.FPBmailCodeReal = "";
                this.FPBmailCodeText = "Get Verification Code";
                this.FPBtimer = null;
            } else if (flag == 'FPDFlag') {
                this.FPDusername = "";
                this.FPDpassword1 = "";
                this.FPDpassword2 = "";
            } else if (flag == 'bakFlag') {
                // 未保存的数据将丢失，确定返回吗？
                var r = confirm("Unsaved data will be lost. Do you want to return?");
                if (r == false) {
                    return;
                }
            }
            this.formFlag = flag;
        },
        FPBIdentifyen() {
          
            let vm = this;
            if (this.FPBmail == null || this.FPBmail == '') {
                // 邮箱不能为空！
                alert("The email can not be empty!")
            } else if (this.FPBmailCode == null || this.FPBmailCode == '') {
                //验证码不能为空!
                alert("The verification code can not be empty!")
            } else {
                if (this.FPBmailCode == this.FPBmailCodeReal) {
                      //  console.log(2222222222222)
                      vm.$axios.get('/signin/findByUsername/' + this.FPBmail + "/static").then(function (res) {
                      // console.log(11111111)
                       alert("Verification code input error, please check and try again.");
                      this.changeForm('FPDFlag');
                      this.FPDregisterData = res.data.result;
                      this.FPDusername = this.FPDregisterData[0].username;
                      // alert("请输入新密码！");
                    }.bind(this), function (error) {
                        console.log(error);
                    });
                } else {
                    //验证码输入错误，请核对后再试
                    alert("Verification code input error, please check and try again.");
                }
            }
        },
        //D
        FPDpassword1Check() {
            if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.FPDpassword1))) {
                this.FPDpassword1TipFlag = false;
                this.FPDpassword1AlertFlag = true;
                return false;
            } else {
                this.FPDpassword1TipFlag = false;
                this.FPDpassword1AlertFlag = false;
                return true;
            }
        },
        FPDpassword1Tip() {
            this.FPDpassword1TipFlag = true;
            this.FPDpassword1AlertFlag = false;
        },
        FPDpassword2Check() {
            if (this.FPDpassword1 !== this.FPDpassword2) {
                this.FPDpassword2AlertFlag = true;
                return false;
            } else {
                this.FPDpassword2AlertFlag = false;
                return true;
            }
        },
        FPregister() {
            let vm = this;
            this.FPDpassword1Check();
            this.FPDpassword2Check();
            if (this.FPDpassword1Check() && this.FPDpassword2Check() && this.FPDmessageCode == this.FPDmessageCodeReal) {
                var params = {
                    userid: this.FPDregisterData[0].userid,
                    username: this.FPDusername,
                    password: this.FPDpassword1,
                }
                vm.$axios.post('/xfxhapi/signin/updateByVO', params).then(function (res) {
                    if (res.data.result == 1) {
                        //密码修改成功！
                        alert("Password changed successfully!");
                        this.username = this.FPDusername;
                        this.password = this.FPDpassword1;
                        // this.changeForm('loginFlag');
                    }
                }.bind(this), function (error) {
                    console.log(error)
                })
            }
        },

  }
}
</script>

<style lang="scss" scoped>
@import '@/common/scss/login.scss';
.lgin {
  margin-top: 10.8rem;
}
</style>