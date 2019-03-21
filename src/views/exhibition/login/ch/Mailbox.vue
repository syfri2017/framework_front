<template>
    <!-- 用户登录 -->
    <el-row class="logincenter">
      <el-col :span="8" >&nbsp;</el-col>
      <el-col :span="8" style="text-align:-webkit-center">
        <div class="login-form" >
          <div class="filed left">
            <i class="iconfont icou"></i>
            <span>密码修改</span>
            <span class="signstyle"><router-link :to="{path:'/exhibition/login/ch/login'}"><a @click="open()">返回登录</a></router-link></span>
          </div>
          <form ref="GLYloginForm" id="GLYloginForm" autocomplete="off" name="loginform"  method="post">
            <div class="filed">
            <el-input placeholder="邮箱" v-model="FPBmail" name="FPBmail" id="FPBmail" prefix-icon="iconfont icon-youxiang"></el-input>
            <button type="button" id="FUmail-btn" class="verficode phonebtn" @click="getFPBMailCode()" v-text=FPBmailCodeText :disabled="FPBmailBtnDisabled"></button>
            </div>
            <div class="filed">
            <el-input placeholder="邮件验证码"  v-model="FPBmailCode" name="FPBmailCode" id="FPBmailCode" prefix-icon="iconfont icon-youxiang1"></el-input>
            </div>
            <div class="filed lgin">
            <el-button type="danger" @click="FPBIdentify()" round>确定</el-button>
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
        FPBmailCodeText: "获取验证码",
        FPBtimer: null,
        FPCmobile: "",
        FPCmessageCode: "",
        FPCmessageCodeReal: "",
        FPCmessageCodeText: "获取验证码",
        FPCtimer: null,
        FPDusername: "",
        FPDpassword1: "",
        FPDpassword2: "",
        FPDregisterData: "",
        FPBmailBtnDisabled: false,
        FPCmobileBtnDisabled: false,
        //提交校验标识
        FPDpassword1TipFlag: false,
        FPDpassword1AlertFlag: false,
        FPDpassword2AlertFlag: false,
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
   //B
        FPBmailCheck() {
            if (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/.test(this.FPBmail))) {
                alert("邮箱格式不正确");
                return false;
            } else {
                return true;
            }
        },
        getFPBMailCode() {
            let vm = this;
            this.FPBmailCode = "";
            if (this.FPBmailCheck()) {
                this.FPBmailCodeText = "发送中...";
                this.FPBmailBtnDisabled = true;
                vm.$axios.get('/signin/getMailNum/' + this.FPBmail + "/static").then(function (res) {
                    if (res.data.result == 0) {
                        alert("该邮箱未注册！");
                        this.FPBmailCodeText = "获取验证码";
                        this.FPBmailBtnDisabled = false;
                    } else if (res.data.result == 1) {
                        vm.$axios.get('/signin/sendMail?mail=' + this.FPBmail).then(function (res) {
                            this.FPBmailCodeReal = res.data.msg;
                            var count = this.time;
                            this.FPBtimer = setInterval(() => {
                                if (count == 0) {
                                    clearInterval(this.FPBtimer);
                                    this.FPBtimer = null;
                                    this.FPBmailCodeText = "获取验证码";
                                    this.FPBmailBtnDisabled = false;
                                } else {
                                    this.FPBmailCodeText = count + "秒后获取"
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
        FPBIdentify() {
            let vm = this;
            if (this.FPBmail == null || this.FPBmail == '') {
                alert("邮箱不能为空！")
            } else if (this.FPBmailCode == null || this.FPBmailCode == '') {
                alert("验证码不能为空！")
            } else {
                if (this.FPBmailCode == this.FPBmailCodeReal) {
                    vm.$axios.get('/signin/findByMail/' + this.FPBmail + "/static").then(function (res) {
                        this.changeForm('FPDFlag');
                        this.FPDregisterData = res.data.result;
                        this.FPDusername = this.FPDregisterData[0].username;
                        // alert("请输入新密码！");
                    }.bind(this), function (error) {
                        console.log(error);
                    });
                } else {
                    alert("验证码输入错误，请核对后再试");
                }
            }
        },

  }
}
</script>

<style lang="scss" scoped>
@import '@/common/scss/login.scss';
</style>