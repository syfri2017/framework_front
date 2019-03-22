<template>
  <!-- 用户登录 -->
  <el-row class="logincenter">
    <el-col :span="8">&nbsp;</el-col>
    <el-col :span="8" style="text-align:-webkit-center">
      <div class="login-form">
        <div class="filed left">
          <i class="iconfont icou"></i>
          <span class="formTitleStyle">用户名找回</span>
          <span class="signstyle">
            <router-link :to="{path:'/exhibition/login/ch/login'}">
              <a @click="back()">返回登录</a>
            </router-link>
          </span>
        </div>
        <form ref="GLYloginForm" id="GLYloginForm" autocomplete="off" name="loginform" method="post">
          <div class="filed">
            <el-input placeholder="邮箱" v-model="FUmail" name="FUmail" id="FUmail" prefix-icon="iconfont icon-youxiang" @blur="FUmailCheck"></el-input>
            <button type="button" id="FUmail-btn" class="verficode phonebtn" @click="getFUMailCode()" v-text=FUmailCodeText :disabled="FUmailBtnDisabled"></button>
            <p class="alert" v-show="mailAlertFlag">*邮箱格式不正确</p>
          </div>
          <div class="filed">
            <el-input placeholder="邮件验证码" v-model="FUmailCode" name="FUmailCode" id="FUmailCode" prefix-icon="iconfont icon-youxiang1" @blur="mailCodeCheck"></el-input>
            <p class="alert1" v-show="mailCodeAlertFlag">*验证码输入错误</p>
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
  name: "Login",
  data() {
    return {
      //忘记用户名
      FUmail: "",
      FUmailCode: "",
      FUmailCodeReal: "",
      FUmailCodeText: "获取验证码",
      FUtimer: null,
      time: 60,
      //验证邮箱标识位
      mailAlertFlag: false,
      mailCodeAlertFlag: false,
      //获取邮箱验证码是否可点击
      FUmailBtnDisabled: false
    };
  },
  methods: {
    //返回登录
    back() {
      this.$alert("未保存的数据将丢失，确定返回吗？", "提示", {
        confirmButtonText: "确定",
        callback: action => {
          this.$message({
            type: "info",
            message: "已返回"
          });
        }
      });
    },
    //邮箱格式校验
    FUmailCheck() {
      if (!/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/.test(this.FUmail)) {
        this.mailAlertFlag = true;
        return false;
      } else {
        this.mailAlertFlag = false;
        return true;
      }
    },
    //邮箱验证码验证
    mailCodeCheck() {
      if (this.FUmailCode != this.FUmailCodeReal || this.FUmailCode == '') {
        this.mailCodeAlertFlag = true;
        return false;
      } else {
        this.mailCodeAlertFlag = false;
        return true;
      }
    },
    //发送验证码
    getFUMailCode() {
      let vm = this;
      vm.FUmailCode = "";
      if (vm.FUmailCheck()) {
        vm.FUmailCodeText = "发送中...";
        vm.FUmailBtnDisabled = true;
        vm.$axios.get("/signin/getMailNum/" + vm.FUmail + "/static").then(
          function(res) {
            if (res.data.result == 0) {
              this.$message({
                type: "error",
                message: "该邮箱未注册！"
              });
              vm.FUmailCodeText = "获取验证码";
              vm.FUmailBtnDisabled = false;
            } else if (res.data.result == 1) {
              vm.$axios.get("/signin/sendMail?mail=" + vm.FUmail).then(
                function(res) {
                  vm.FUmailCodeReal = res.data.msg;
                  var count = vm.time;
                  vm.timer = setInterval(() => {
                    if (count == 0) {
                      clearInterval(vm.timer);
                      vm.timer = null;
                      vm.FUmailCodeText = "获取验证码";
                      vm.FUmailBtnDisabled = false;
                    } else {
                      vm.FUmailCodeText = count + "秒后获取";
                      count--;
                      vm.FUmailBtnDisabled = true;
                    }
                  }, 1000);
                }.bind(vm),
                function(error) {
                  console.log(error);
                }
              );
            }
          }.bind(vm),
          function(error) {
            console.log(error);
          }
        );
      }
    },
    //找回用户名方法
    FUIdentify() {
      let vm = this;
      if (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/.test(vm.FUmail))) {
        vm.mailAlertFlag = true;
      } else if (vm.FUmailCode != vm.FUmailCodeReal || vm.FUmailCode == '') {
        vm.mailCodeAlertFlag = true;
      } else {
        vm.$axios.get("/signin/getMailNum/" + vm.FUmail + "/static").then(
            function(res) {
              if (res.data.result == 0) {
                vm.$message({
                  type: "error",
                  message: "该邮箱未注册！"
                });
              } else if (res.data.result == 1) {
                vm.$axios.get("/signin/getUsernameByMail/" + vm.FUmail + "/static").then(function(res) {
                  vm.$message({
                    type: "success",
                    message: "用户名找回成功！"
                  });
                  vm.username = res.data;
                  //vm.changeForm("loginFlag");
                  vm.$router.push({name:"exhibition/login/ch/Login", query: {username: vm.username, type: 'forgetUsername'}});
                }.bind(vm),function(error) {
                  console.log(error);
                }
              );
          }
        }.bind(vm),function(error) {
          console.log(error);
        });
      }
    },
   
    
  }
};
</script>

<style lang="scss" scoped>
@import "@/common/scss/login.scss";
</style>