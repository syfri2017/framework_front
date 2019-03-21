<template>
    <!-- 用户登录 -->
    <el-row class="logincenter">
      <el-col :span="8" >&nbsp;</el-col>
      <el-col :span="8" style="text-align:-webkit-center">
        <div class="login-form" >
          <div class="filed left">
            <i class="iconfont icou"></i>
            <span >账户重置</span>
            <span class="signstyle"><router-link :to="{path:'/exhibition/login/ch/login'}"><a @click="open">返回登录</a></router-link></span>
          </div>
          <form  ref="GLYloginForm" id="GLYloginForm" autocomplete="off" name="loginform"  method="post">
            <div class="filed">
              <el-input v-model="REAcompanyName" name="REAcompanyName" id="REAcompanyName" placeholder="单位名称" prefix-icon="iconfont icon-danwei"></el-input>
            </div>
            <div class="filed">
              <el-input v-model="REAunscid" name="REAunscid" id="REAunscid" placeholder="统一社会信用代码" prefix-icon="iconfont icon-credentials_icon"></el-input>
            </div>
            <div class="filed lgin">
              <el-button type="danger" @click="REAIdentify()" round>确定</el-button>
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
        //重置账户
        REAcompanyName: "",
        REAunscid: "",
        REAtimer: null,
        REAmobile: "",
        REAmessageCode: "",
        REAmessageCodeReal: "",
        REAmessageCodeText: "获取验证码",
        REApassword1: "",
        REApassword2: "",
        REAregisterData: "",
        REAmobileBtnDisabled: false,
        //重置校验标识
        REAmobileAlertFlag: false,
        REAmessageCodeAlertFlag: false,
        REApassword1TipFlag: false,
        REApassword1AlertFlag: false,
        REApassword2AlertFlag: false,
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
    //忘记密码
    //A
    REAIdentify() {
        let vm = this;
        if (this.REAcompanyName == null || this.REAcompanyName == '') {
            alert("单位名称不能为空！")
        } else if (this.REAunscid == null || this.REAunscid == '') {
            alert("统一社会信用代码不能为空！")
        } else {
            var params = {
                unscid: this.REAunscid,
                companyname: this.REAcompanyName
            }
            vm.$axios.post('/signin/findByUnscid/', params).then(function (res) {
                this.REAregisterData = res.data.result;
                if (this.REAregisterData.length == 0) {
                    alert("无记录，请重新输入！");
                }
                else {
                    this.changeForm('REABFlag');
                    this.REAmobile = this.REAregisterData[0].username;
                }
            }.bind(this), function (error) {
                console.log(error);
            });
        }
    },

  }
}
</script>

<style lang="scss" scoped>
@import '@/common/scss/login.scss';
</style>