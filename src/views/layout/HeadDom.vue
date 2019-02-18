
<template>
    <div class="header">
      <!-- 折叠按钮 -->
      <div class="collapse-btn" @click="collapseChage">
        <i class="el-icon-menu el-icon-menu-position"></i>
      </div>
      <div class="logo"></div>
      <div class="header-right">
        <div class="header-user-con">
          <!-- 全屏显示 -->
          <div class="btn-fullscreen" @click="handleFullScreen">
            <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
              <i class="el-icon-rank"></i>
            </el-tooltip>
          </div>
          
          <!-- 用户名下拉菜单 -->
          <el-dropdown class="dropdown-position" @command="handleCommand">
            <div class="el-dropdown-link">
              <span id="realname">{{realname}}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="personalFlag" command="personal" class="iconfont icon-personal iconfontDrop">&nbsp;个人中心</el-dropdown-item>
              <el-dropdown-item command="logout" class="iconfont icon-logout iconfontDrop">&nbsp;退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-dialog title="个人中心" :visible.sync="dialogVisible" width="30%">
        <el-form id="userForm" ref="userForm" :model="userForm" label-width="80px" :label-position="'left'" :rules="userInforRules">
          <el-row class="mb5">
            <el-col :span="21">
              <el-form-item prop="username" label="用户名">
                <el-input size="small" v-model="userForm.username" placeholder="用户名" :disabled="!userForm.usernameFlag"></el-input>
                <el-button class="abs hqyzm" size="mini" v-text="userForm.messageCodeText" type="text" v-show="userForm.usernameFlag" :disabled="userForm.messageBtnFlag"
                    @click="getMessageCode()"></el-button>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
              <el-button v-text="userForm.usernameText" type="text" @click="changeUsername()"></el-button>
            </el-col>
          </el-row>
          <el-row class="mb5" v-show="userForm.usernameFlag">
            <el-col :span="21">
              <el-form-item prop="messageCode" label="验证码" :rules="this.userForm.usernameFlag?userInforRules.messageCode:[{ required: false, message: '请输入验证码', trigger: 'blur' }]">
                <el-input size="small" v-model="userForm.messageCode" placeholder="短信验证码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="mb5">
            <el-col :span="21">
              <el-form-item prop="password" label="密码">
                <el-input type="password" size="small" v-model="userForm.password" placeholder="密码" :disabled="!userForm.passwordFlag"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
              <el-button v-text="userForm.passwordText" type="text" @click="changePassword()"></el-button>
            </el-col>
          </el-row>
          <el-row class="mb5" v-show="userForm.passwordFlag">
            <el-col :span="21">
              <el-form-item prop="passwordAgain" label="确认密码" :rules="this.userForm.passwordFlag?userInforRules.passwordAgain:[{ required: false, message: '请输入确认密码', trigger: 'blur' }]">
                <el-input type="password" size="small" v-model="userForm.passwordAgain" placeholder="确认密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
    import bus from '../../common/js/bus';
    export default {
      data() {
        var validatePwdAgain = (rule, value, callback) => {
          if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value) == false) {
            callback(new Error("密码应为6-16位字母和数字组合"));
          } else if (value !== this.userForm.password) {
            callback(new Error("两次输入密码不一致"));
          } else {
            callback();
          }
        };
        var validateMsgCode = (rule, value, callback) => {
          if (value !== this.userForm.messageCodeReal) {
            callback(new Error("验证码输入错误"));
          } else {
            callback();
          }
        };
        return {
          collapse: false,
          fullscreen: false,
          currentUser: null,
          realname: null,
          //个人中心的Dialog显示与隐藏
          dialogVisible: false,
          //个人中心DropDown显示与隐藏
          personalFlag: false,
          //修改用户名密码的Form表单
          userForm: {
            usernameWord: "",//保存原用户名
            passwordWord: "",//仅用于显示
            userid: "",
            username: "",
            password: "admin123",
            passwordAgain: "admin123",
            messageCode: "",
            messageCodeReal: "",
            messageCodeText: "获取验证码",
            messageBtnFlag: false,
            //修改按钮文字
            usernameText: "修改",
            passwordText: "修改",
            //修改框标识位
            usernameFlag: false,
            passwordFlag: false,
          },
          time: 60,
          timer: "",
          //Form表单的Rules
          userInforRules: {
            username: [
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { pattern: /^1[34578]\d{9}$/, message: '请填写正确的手机号码', trigger: 'blur' }
            ],
            messageCode: [
              { required: true, message: '请输入验证码', trigger: 'blur' },
              { validator: validateMsgCode, trigger: 'blur' }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: '密码应为6-16位字母和数字组合', trigger: 'blur' }
            ],
            passwordAgain: [
              { required: true, message: '请再次输入密码', trigger: 'blur' },
              { validator: validatePwdAgain, trigger: "blur" }
            ],
          },
        }
      },
      created() {
        let vm = this;
        vm.currentUser = JSON.parse(localStorage.getItem("CURRENTUSER"));
        console.log(vm.currentUser);
        if(vm.currentUser != null){
          vm.realname = this.currentUser.realname ? this.currentUser.realname : "欢迎您！";
          vm.personalFlag = this.currentUser.deptid == 'ZSYH' ? true : false;
          vm.deptid = false;
          vm.userForm.userid = vm.currentUser.userid;
          vm.userForm.usernameWord = vm.currentUser.username;
          vm.userForm.passwordWord = "admin123";
        }
      },
      methods:{
        // 用户名下拉菜单选择事件
        handleCommand(command) {
          if("personal" == command) {
            this.personal();
          }else if("logout" == command) {
            this.logout();
          }
        },
        //退出
        logout(){
          let vm = this;
          vm.$axios.get('/logout').then(function (res) {
            if(res.data.code = '00000000') {
              localStorage.removeItem('isLogin');
              localStorage.removeItem('XTOKEN');
              localStorage.removeItem('CURRENTUSER');
              vm.$router.push({name: 'login'});
            }
          }.bind(this), function (error) {
            console.log(error)
          })
        },
        //个人中心
        personal: function () {
          this.dialogVisible = true;
          this.userForm.usernameText = "修改";
          this.userForm.passwordText = "修改";
          this.userForm.usernameFlag = false;
          this.userForm.passwordFlag = false;
          this.timer = null;
          this.userForm.messageCodeText = "获取验证码";
          this.userForm.messageBtnFlag = false;

          this.$nextTick(() => {
              this.$refs.userForm.resetFields();
          })

          this.userForm.username = this.userForm.usernameWord;
          this.userForm.password = this.userForm.passwordWord;
        },

        //修改用户名
        changeUsername: function () {
          if (this.userForm.usernameFlag == false) {
            this.userForm.usernameFlag = true;
            this.userForm.usernameText = "取消";
          } else if (this.userForm.usernameFlag == true) {
            this.userForm.usernameFlag = false;
            this.userForm.usernameText = "修改";
            this.userForm.username = this.userForm.usernameWord;
          }
        },
        //修改密码
        changePassword: function () {
          if (this.userForm.passwordFlag == false) {
            this.userForm.passwordFlag = true;
            this.userForm.passwordText = "取消";
            this.userForm.password = "";
            this.userForm.passwordAgain = "";
          } else if (this.userForm.passwordFlag == true) {
            this.userForm.passwordFlag = false;
            this.userForm.passwordText = "修改";
            this.userForm.password = this.userForm.passwordWord;
          }
        },
        //获取验证码
        getMessageCode: function () {
          let vm = this;

          if (vm.userForm.username === vm.userForm.usernameWord) {
            vm.$message({
              message: '用户名未变化',
              type: 'error'
            });
            return;
          } else {
            vm.userForm.messageCode = "";
            vm.userForm.messageCodeText = "发送中...";
            vm.userForm.messageBtnFlag = true;

            vm.$axios.get('/signin/getUsernameNum/' + vm.userForm.username + "/static").then(function (res) {
              if (res.data.result != 0) {
                vm.$message({
                  message: '用户名已存在',
                  type: 'error'
                });
                vm.userForm.messageCodeText = "获取验证码";
                vm.userForm.messageBtnFlag = false;
              } else {
                vm.$axios.get('/signin/sendMessage?phone=' + vm.userForm.username).then(function (res) {
                  vm.userForm.messageCodeReal = res.data.msg;
                  var count = vm.time;
                  vm.timer = setInterval(() => {
                    if (count == 0) {
                      clearInterval(vm.timer);
                      vm.timer = null;
                      vm.userForm.messageCodeText = "获取验证码";
                      vm.userForm.messageBtnFlag = false;
                    } else {
                      vm.userForm.messageCodeText = count + "秒后获取"
                      count--;
                      vm.userForm.messageBtnFlag = true;
                    }
                  }, 1000)
                }.bind(this), function (error) {
                    console.log(error);
                });
              }
            }.bind(this), function (error) {
                console.log(error)
            })
          } 
        },
        //Dialog中的确定按钮
        confirm: function () {
          let vm = this;
          if(!this.userForm.usernameFlag && !this.userForm.passwordFlag){
            this.$message({
              showClose: true,
              message: '用户名密码未修改！',
              type: 'warning'
            });
            return;
          }
          this.$refs["userForm"].validate((valid) => {
            if (valid) {
              var params = {
                userid: this.userForm.userid
              }
              if(vm.userForm.usernameFlag){
                params.username = vm.userForm.username;
              }
              if(vm.userForm.passwordFlag){
                params.password = vm.userForm.password;
              }
              //修改人、修改时间
              params.alterId = vm.currentUser.userid;
              params.alterName = vm.userForm.username;
              vm.$axios.post('/account/updateByVO', params).then(function (res) {
                var result = res.data.result;
                if (result == 1) {
                  vm.$message({
                      message: '修改成功，3秒后退出登录',
                      duration: 2000,
                      type: 'success'
                  });
                  var count = 3;
                  var timer2 = setInterval(() => {
                      if (count == 0) {
                        clearInterval(timer2);
                        this.logout();
                      } else {
                        count--;
                      }
                  }, 1000);
                } else {
                  this.$message({
                      message: '修改失败，请重试',
                      type: 'error'
                  });
                }
              }.bind(this), function (error) {
                  console.log(error)
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        // 侧边栏折叠
        collapseChage(){
          this.collapse = !this.collapse;
          bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen(){
          let element = document.documentElement;
          if (this.fullscreen) {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
          } else {
            if (element.requestFullscreen) {
              element.requestFullscreen();
            } else if (element.webkitRequestFullScreen) {
              element.webkitRequestFullScreen();
            } else if (element.mozRequestFullScreen) {
              element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
              // IE11
              element.msRequestFullscreen();
            }
          }
        this.fullscreen = !this.fullscreen;
      }
    },
    mounted(){
      if(document.body.clientWidth < 1500){
        this.collapseChage();
      }
    }
  }
</script>
<style scoped>
    /* .logo-title {
      background: url(/static/images/login/pic_logo.png)no-repeat center center; background-size: auto 100%; position: relative;
      width: 30px;
      height: 40px;
    } */
    .header {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      height: 70px;
      font-size: 22px;
      color: #fff;
    }
    .collapse-btn{
      float: left;
      padding: 0 3px;
      cursor: pointer;
      line-height: 60px;
    }
    .el-icon-menu-position {
      margin-left: -4px;
    }
    .header .logo{
      background: url(/static/images/login/pic_logo.png)no-repeat center center; background-size: auto 100%; position: relative;
      float: left;
      width:350px;
      height:40px;
      margin-top: 10px;
      margin-left: 10px;
    }
    .header-right{
      float: right;
      padding-right: 10px;
    }
    .header-user-con{
      display: flex;
      height: 70px;
      align-items: center;
    }
    .btn-fullscreen{
      transform: rotate(45deg);
      margin-top: -15px;
      margin-left: 10px;
      font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
      position: relative;
      width: 30px;
      height: 30px;
      text-align: center;
      border-radius: 15px;
      cursor: pointer;
    }
    .btn-bell-badge{
      position: absolute;
      right: 0;
      top: -2px;
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background: #f56c6c;
      color: #fff;
    }
    .btn-bell .el-icon-bell{
      color: #fff;
    }
    .user-name {
      margin-left: 10px;
    }
    .user-avator {
      margin-left: 20px;
    }
    .user-avator img {
      display: block;
      width:40px;
      height:40px;
      border-radius: 50%;
    }
    .el-dropdown-link {
      color: #fff;
      cursor: pointer;
    }
    .iconfontDrop {
      font-size: 14px;
    }
    .hqyzm {
      margin-top: -32px;
      margin-left: 70%;
      color:#EA2530;
    }
</style>

