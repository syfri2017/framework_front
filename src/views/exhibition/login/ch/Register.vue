<template>
  <!-- 用户登录 -->
  <el-row class="logincenter">
    <el-col :span="8">&nbsp;</el-col>
    <el-col :span="8" style="text-align:-webkit-center">
      <div class="login-form">
        <div class="filed left">
          <i class="iconfont icou"></i>
          <span class="formTitleStyle">用户注册</span>
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
@import '@/common/scss/login.scss';
.lgin {
  margin-top: 4rem;
}
</style>