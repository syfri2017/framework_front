<template>
    <!-- 用户登录 -->
    <el-row class="logincenter">
      <el-col :span="8" >&nbsp;</el-col>
      <el-col :span="8" style="text-align:-webkit-center">
        <div class="login-form" >
          <div class="filed left">
            <i class="iconfont icou"></i>
            <span class="formTitleStyle">密码修改</span>
            <span class="signstyle"><router-link :to="{path:'/exhibition/login/ch/login'}"><a @click="open()">返回登录</a></router-link></span>
          </div>
          <form ref="loginForm" id="loginForm" autocomplete="off" name="loginform"  method="post">
            <div class="filed">
              <el-input placeholder="手机号" v-model="FPCmobile" name="FPCmobile" id="FPCmobile" prefix-icon="iconfont icon-login-phone"></el-input>
              <button type="button" id="FUmail-btn" class="verficode phonebtn"  @click="getFPCMessageCode()" v-text=FPCmessageCodeText :disabled="FPCmobileBtnDisabled"></button>
            </div>
            <div class="filed">
              <el-input v-model="FPCmessageCode" name="FPCmessageCode" id="FPCmessageCode" placeholder="短信验证码" prefix-icon="iconfont icon-login-validate"></el-input>
            </div>
            <div class="filed lgin">
              <el-button type="danger"  @click="FPCIdentify()" round>确定</el-button>
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
      if(this.FPCmobile != '' || this.FPCmessageCode != ''){
        this.$confirm("未保存的数据将丢失，确定返回吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({path:"/exhibition/login/ch/login"});
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });   
        });
      }else{
        this.$router.push({path:"/exhibition/login/ch/login"});
      }   
    },
    FPCmobileCheck() {
      if (this.FPCmobile == null || this.FPCmobile == '') {
        alert("手机号不能为空！")
        return false;
      } else if (!(/^1[34578]\d{9}$/.test(this.FPCmobile))) {
        alert("请填写正确的手机号码！")
        return false;
      } else {
        return true;
      }
    },
    getFPCMessageCode() {
        let vm = this;
        this.FPCmessageCode = "";
        if (this.FPCmobileCheck()) {
            this.FPCmessageCodeText = "发送中...";
            this.FPCmobileBtnDisabled = true;
            vm.$axios.get('/signin/getUsernameNum/' + this.FPCmobile + "/static").then(function (res) {
                if (res.data.result == 0) {
                    alert("用户名不存在！");
                    this.FPCmessageCodeText = "获取验证码";
                    this.FPCmobileBtnDisabled = false;
                } else {
                    vm.$axios.get('/signin/sendMessage?phone=' + this.FPCmobile).then(function (res) {
                        this.FPCmessageCodeReal = res.data.msg;
                        var count = this.time;
                        this.FPCtimer = setInterval(() => {
                            if (count == 0) {
                                clearInterval(this.FPCtimer);
                                this.FPCtimer = null;
                                this.FPCmessageCodeText = "获取验证码";
                                this.FPCmobileBtnDisabled = false;
                            } else {
                                this.FPCmessageCodeText = count + "秒后获取"
                                count--;
                                this.FPCmobileBtnDisabled = true;
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
    FPCIdentify() {
      let vm = this;
      if (this.FPCmobile == null || this.FPCmobile == '') {
        alert("手机号不能为空！")
      } else if (this.FPCmessageCode == null || this.FPCmessageCode == '') {
        alert("验证码不能为空！")
      } else {
        if (this.FPCmessageCode == this.FPCmessageCodeReal) {
          vm.$axios.get('/signin/findByUsername/' + this.FPCmobile + "/static").then(function (res) {
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