<template>
    <!-- 用户登录 -->
    <el-row class="logincenter">
      <el-col :span="8" >&nbsp;</el-col>
      <el-col :span="8" style="text-align:-webkit-center">
        <div class="login-form" >
          <div class="filed left">
            <i class="iconfont icou"></i>
            <span >用户名找回</span>
            <span class="signstyle"><router-link :to="{path:'/exhibition/login/ch/login'}"><a @click="open()">返回登录</a></router-link></span>
          </div>
          <form ref="GLYloginForm" id="GLYloginForm" autocomplete="off" name="loginform"  method="post">
            <div class="filed">
              <el-input placeholder="邮箱" v-model="FUmail" name="FUmail" id="FUmail" prefix-icon="iconfont icon-youxiang"></el-input>
              <button type="button" id="FUmail-btn" class="verficode phonebtn" @click="getFUMailCode()" v-text=FUmailCodeText :disabled="FUmailBtnDisabled"></button>
            </div>
            <div class="filed">
              <el-input placeholder="邮件验证码"  v-model="FUmailCode" name="FUmailCode" id="FUmailCode" prefix-icon="iconfont icon-youxiang1"></el-input>
            </div>
            <div class="filed lgin">
              <el-button type="danger" @click="FUIdentify()" round>确定</el-button>
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
        FUmailCodeText: "获取验证码",
        FUtimer: null,
        FUusername: "",
        FUmessageCode: "",
        FUmessageCodeReal: "",
        FUmessageCodeText: "获取验证码",
        FUpassword: "",
        FUsrc: "/xfxhapi/imageCode",
        FUvalidateCode: "",
        FUmailBtnDisabled: false,
        FUmobileBtnDisabled: false,
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
    //忘记用户名
    FUmailCheck() {
            if (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/.test(this.FUmail))) {
                alert("邮箱格式不正确");
                return false;
            } else {
                return true;
            }
        },
        getFUMailCode() {
            let vm = this;
            this.FUmailCode = "";
            if (this.FUmailCheck()) {
                this.FUmailCodeText = "发送中...";
                this.FUmailBtnDisabled = true;
                vm.$axios.get('/signin/getMailNum/' + this.FUmail + "/static").then(function (res) {
                    if (res.data.result == 0) {
                        alert("该邮箱未注册！");
                        this.FUmailCodeText = "获取验证码";
                        this.FUmailBtnDisabled = false;
                    } else if (res.data.result == 1) {
                        vm.$axios.get('/signin/sendMail?mail=' + this.FUmail).then(function (res) {
                            this.FUmailCodeReal = res.data.msg;
                            var count = this.time;
                            this.timer = setInterval(() => {
                                if (count == 0) {
                                    clearInterval(this.timer);
                                    this.timer = null;
                                    this.FUmailCodeText = "获取验证码";
                                    this.FUmailBtnDisabled = false;
                                } else {
                                    this.FUmailCodeText = count + "秒后获取"
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
                alert("邮箱不能为空！")
            } else if (this.FUmailCode == null || this.FUmailCode == '') {
                alert("验证码不能为空！")
            } else {
                if (this.FUmailCode == this.FUmailCodeReal) {
                    vm.$axios.get('/signin/getMailNum/' + this.FUmail + "/static").then(function (res) {
                        if (res.data.result == 0) {
                            alert("该邮箱未注册！");
                        } else if (res.data.result == 1) {
                            axios.get('/signin/getUsernameByMail/' + this.FUmail + "/static").then(function (res) {
                                alert("用户名找回成功！");
                                this.username = res.data;
                                this.changeForm('loginFlag');
                            }.bind(this), function (error) {
                                console.log(error);
                            });
                        }
                    }.bind(this), function (error) {
                        console.log(error);
                    });

                } else {
                    alert("验证码输入错误，请核对后再试");
                }
            }
        },
        //作废
        getFUMessageCode() {
            let vm = this;
            vm.$axios.get('/signin/sendMessage?phone=' + this.FUusername).then(function (res) {
                this.FUmessageCodeReal = res.data.msg;
                var count = this.time;
                this.FUtimer = setInterval(() => {
                    if (count == 0) {
                        clearInterval(this.FUtimer);
                        this.FUtimer = null;
                        this.FUmessageCodeText = "获取验证码";
                        this.FUmobileBtnDisabled = false;
                    } else {
                        this.FUmessageCodeText = count + "秒后获取"
                        count--;
                        this.FUmobileBtnDisabled = true;
                    }
                }, 1000)
            }.bind(this), function (error) {
                console.log(error);
            });
        },
        reloadFUCode() {
            // this.FUsrc = '/xfxhapi/imageCode?' + ((new Date()).valueOf());
            this.FUsrc = '/imageCode?' + ((new Date()).valueOf());
        },
        FUlogin() {
            if (this.FUusername == null || this.FUusername == '') {
                alert("用户名不能为空！")
            } else if (this.FUmessageCode == null || this.FUmessageCode == '') {
                alert("短信验证码不能为空！")
            } else if (this.FUpassword == null || this.FUpassword == '') {
                alert("密码不能为空！")
            } else if (this.FUvalidateCode == null || this.FUvalidateCode == '') {
                alert("验证码不能为空！")
            } else {
                this.username = this.FUusername;
                this.password = this.FUpassword;
                this.validateCode = this.FUvalidateCode;
                this.$refs.loginForm.submit();
            }
        },

  }
}
</script>

<style lang="scss" scoped>
@import '@/common/scss/login.scss';
</style>