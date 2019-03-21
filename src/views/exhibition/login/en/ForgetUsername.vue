<template>
    <!-- 用户登录 -->
    <el-row class="logincenter">
      <el-col :span="8" >&nbsp;</el-col>
      <el-col :span="8" style="text-align:-webkit-center">
        <div class="login-form" >
          <div class="filed left">
            <i class="iconfont icou"></i>
            <span class="formTitleStyle">Username Recovery</span>
            <span class="signstyle"><router-link :to="{path:'/exhibition/login/en/login'}"><a @click="open()">Back to Login</a></router-link></span>
          </div>
          <form ref="GLYloginForm" id="GLYloginForm" autocomplete="off" name="loginform"  method="post">
            <div class="filed">
              <el-input placeholder="Association Email" v-model="FUmail" name="FUmail" id="FUmail" prefix-icon="iconfont icon-youxiang"></el-input>
              <button type="button" id="FUmail-btn" class="verficode phonebtnEN" @click="getFUMailCode()" v-text=FUmailCodeText :disabled="FUmailBtnDisabled"></button>
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
@import '@/common/scss/login.scss';
</style>