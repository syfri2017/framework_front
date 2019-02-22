
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
            <el-tooltip v-if="usertype == 'ENG'" effect="dark" :content="fullscreen?`Cancel FullScreen`:`FullScreen`" placement="bottom">
              <i class="el-icon-rank"></i>
            </el-tooltip>
            <el-tooltip v-else effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
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
              <el-dropdown-item v-if="personalFlag" command="personal" class="iconfont icon-personal iconfontDrop">&nbsp;
                <span v-if="usertype == 'ENG'">User Center</span>
                <span v-else>个人中心</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout" class="iconfont icon-logout iconfontDrop">&nbsp;
                <span v-if="usertype == 'ENG'">Log Out</span>
                <span v-else>退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-dialog :title="DialogTitle" :visible.sync="dialogVisible" width="30%">
        <el-form id="userForm" ref="userForm" :model="userForm" :label-width="labelWidth" :label-position="'left'" :rules="userInforRules">
          <el-row class="mb5">
            <el-col :span="21">
              <el-form-item prop="username" :label="usernameLabel" class="is-required">
                <el-input size="small" v-model="userForm.username" :placeholder="usernameLabel" :disabled="!userForm.usernameFlag" clearable></el-input>
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
              <el-form-item prop="messageCode" :label="messageCodeLabel" class="is-required">
                <el-input size="small" v-model="userForm.messageCode" :placeholder="messageCodeLabel" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="mb5">
            <el-col :span="21">
              <el-form-item prop="password" :label="passwordLabel" class="is-required">
                <el-input type="password" size="small" v-model="userForm.password" :placeholder="passwordLabel" :disabled="!userForm.passwordFlag" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="2">
              <el-button v-text="userForm.passwordText" type="text" @click="changePassword()"></el-button>
            </el-col>
          </el-row>
          <el-row class="mb5" v-show="userForm.passwordFlag">
            <el-col :span="21">
              <el-form-item prop="passwordAgain" :label="checkPassLabel" class="is-required">
                <el-input type="password" size="small" v-model="userForm.passwordAgain" :placeholder="checkPassLabel" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false"><span v-if="usertype=='ENG'">cancel</span><span v-else>取 消</span></el-button>
        <el-button size="small" type="primary" @click="confirm()"><span v-if="usertype=='ENG'">confirm</span><span v-else>确 定</span></el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
    import bus from '../../common/js/bus';
    export default {
      data() {
        return {
          collapse: false,
          fullscreen: false,
          currentUser: this.CONSTANT.currentUser,
          realname: null,
          //个人中心的Dialog显示与隐藏
          dialogVisible: false,
          //个人中心DropDown显示与隐藏
          personalFlag: false,
          //用户类型，中文还是英文
          usertype: 'CHN',
          //DialogTitle
          DialogTitle: "个人中心",
          usernameLabel: "用户名",
          messageCodeLabel: "验证码",
          passwordLabel: "密码",
          checkPassLabel: "确认密码",
          labelWidth: '80px',
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
              { validator: (rule, value, callback) => {
                  if (value == null || value == '') {
                    callback(new Error(this.usertype=='ENG' ? 'Please input a email.' : "请输入手机号"));
                  } else {
                    if (this.usertype == 'ENG') {
                      if (/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/.test(value) == false) {
                        callback(new Error("The email format is not correct."));
                      } else {
                        callback();
                      }
                    } else {
                      if (/^[1][3,4,5,7,8][0-9]{9}$/.test(value) == false) {
                        callback(new Error("手机号格式不正确"));
                      } else {
                        callback();
                      }
                    }
                    callback();
                  }
                }, trigger: 'blur'
              }
            ],
            messageCode: [
              { validator: (rule, value, callback) => {
                  if (!this.userForm.usernameFlag) {
                    callback();
                  } else {
                    if (value == null || value == '') {
                      callback(new Error(this.usertype=='ENG' ? 'Please input the verification code.' : "请输入验证码"));
                    } else if (value !== this.userForm.messageCodeReal) {
                      callback(new Error(this.usertype=='ENG' ? 'The verification code is error.' : "验证码输入错误"));
                    } else {
                      callback();
                    }
                  }
                }, trigger: 'blur' }
            ],
            password: [
              { validator: (rule, value, callback) => {
                  if (!this.userForm.passwordFlag) {
                    callback();
                  } else {
                    if (value == null || value == '') {
                      callback(new Error(this.usertype=='ENG' ? 'Please input a password.' : "请输入密码"));
                    } else if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value) == false) {
                      callback(new Error(this.usertype=='ENG' ? 'Password must be 6-16-bit alphanumeric combination.' : "密码应为6-16位字母和数字组合"));
                    } else {
                      callback();
                    }
                  }
                }, trigger: 'blur' }
            ],
            passwordAgain: [
              { validator: (rule, value, callback) => {
                if (!this.userForm.passwordFlag) {
                  callback();
                } else {
                  if (value == null || value == '') {
                    callback(new Error(this.usertype=='ENG' ? 'Please input the password again.' : "请再次输入密码"));
                  } else if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value) == false) {
                    callback(new Error(this.usertype=='ENG' ? 'Password must be 6-16-bit alphanumeric combination.' : "密码应为6-16位字母和数字组合"));
                  } else if (value !== this.userForm.password) {
                    callback(new Error(this.usertype=='ENG' ? 'The two entries do not match.' : "两次输入密码不一致"));
                  } else {
                    callback();
                  }
                }
              }, trigger: "blur" }
            ],
          },
        }
      },
      created() {
        let vm = this;
        if(vm.currentUser != null){
          vm.usertype = this.currentUser.usertype;
          vm.realname = this.currentUser.realname ? this.currentUser.realname : (vm.usertype=='ENG' ? 'Welcome!' : "欢迎您！");
          vm.personalFlag = this.currentUser.deptid == 'ZSYH' ? true : false;
          vm.userForm.userid = vm.currentUser.userid;
          vm.userForm.usernameWord = vm.currentUser.username;
          vm.userForm.passwordWord = "admin123";
        }
        //显示中文还是英文
        this.showCHNorENG();
      },
      methods:{
        //显示中文还是英文
        showCHNorENG() {
          let vm = this;
          if (vm.usertype == 'ENG') {
            vm.DialogTitle = 'Personal Center';
            vm.usernameLabel = 'username';
            vm.messageCodeLabel = 'validate code';
            vm.passwordLabel = 'password';
            vm.checkPassLabel = 'confirm password';
            vm.labelWidth = '150px';
          } else {
            vm.DialogTitle = "个人中心";
            vm.usernameLabel = "用户名";
            vm.messageCodeLabel = "验证码";
            vm.passwordLabel = "密码";
            vm.checkPassLabel = "确认密码";
            vm.labelWidth = '80px';
          }
        },
        //用户名下拉菜单选择事件
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
          this.userForm.usernameFlag = false;
          this.userForm.passwordFlag = false;
          this.timer = null;
          this.userForm.messageBtnFlag = false;
          if (this.usertype == 'ENG') {
            this.userForm.usernameText = 'edit';
            this.userForm.passwordText = 'edit';
            this.userForm.messageCodeText = 'Get Verification Code';
          } else {
            this.userForm.usernameText = "修改";
            this.userForm.passwordText = "修改";
            this.userForm.messageCodeText = "获取验证码";
          }
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
            this.userForm.usernameText = this.usertype == 'ENG' ? 'cancel' : "取消";
          } else if (this.userForm.usernameFlag == true) {
            this.userForm.usernameFlag = false;
            this.userForm.usernameText = this.usertype == 'ENG' ? 'edit' : "修改";
            this.userForm.username = this.userForm.usernameWord;
          }
        },
        //修改密码
        changePassword: function () {
          if (this.userForm.passwordFlag == false) {
            this.userForm.passwordFlag = true;
            this.userForm.passwordText = this.usertype == 'ENG' ? 'cancel' : "取消";
            this.userForm.password = "";
            this.userForm.passwordAgain = "";
          } else if (this.userForm.passwordFlag == true) {
            this.userForm.passwordFlag = false;
            this.userForm.passwordText = this.usertype == 'ENG' ? 'edit' : "修改";
            this.userForm.password = this.userForm.passwordWord;
          }
        },
        //获取验证码
        getMessageCode: function () {
          let vm = this;
          if (vm.userForm.username === vm.userForm.usernameWord) {
            vm.$message({
              message: this.usertype == 'ENG' ? 'The username did not change.' : '用户名未变化',
              type: 'error'
            });
            return;
          } else {
            //首先需要判断手机号码和邮箱是否符合规则
            if (this.usertype == 'ENG') {
              if (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/.test(vm.userForm.username))) {
                return false;
              } 
            } else {
              if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(vm.userForm.username))) { 
                return false;
              } 
            }
      
            vm.userForm.messageCode = "";
            vm.userForm.messageCodeText = this.usertype == 'ENG' ? 'sending...' : "发送中...";
            vm.userForm.messageBtnFlag = true;

            vm.$axios.get('/signin/getUsernameNum/' + vm.userForm.username + "/static").then(function (res) {
              if (res.data.result != 0) {
                vm.$message({
                  message: this.usertype == 'ENG' ? 'The email is registered.' : '用户名已存在',
                  type: 'error'
                });
                vm.userForm.messageCodeText = this.usertype == 'ENG' ? 'Get Verification Code' : "获取验证码";
                vm.userForm.messageBtnFlag = false;
              } else {
                //如果是中文展商，调用手机号收验证码的方法；如果是英文展商，调用邮箱收验证码的方法
                if (vm.usertype == 'ENG') {
                  vm.$axios.get('/signin/sendMailEng?mail=' + this.userForm.username).then(function (res) {
                      vm.userForm.messageCodeReal = res.data.msg;
                      var count = vm.time;
                      vm.timer = setInterval(() => {
                        if (count == 0) {
                            clearInterval(vm.timer);
                            vm.timer = null;
                            vm.userForm.messageCodeText = "Get Verification Code";
                            vm.userForm.messageBtnFlag = false;
                        } else {
                            vm.userForm.messageCodeText = count + "seconds later"
                            count--;
                            vm.userForm.messageBtnFlag = true;
                        }
                      }, 1000)
                  }.bind(this), function (error) {
                      console.log(error);
                  });
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
              message: this.usertype == 'ENG' ? 'The username and password did not change.' : '用户名密码未变化',
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
                      message: this.usertype == 'ENG' ? 'Modify success, log out after 3 seconds.' : '修改成功，3秒后退出登录',
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
                      message: this.usertype == 'ENG' ? 'Modify the failure, please try again.' : '修改失败，请重试',
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

