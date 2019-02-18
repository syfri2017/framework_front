<template>
  <div class="login">
    <el-row>
      <el-col :span="6">
        <p>
          <img class="imgstyle" src="/static/images/login/QRCode.jpg">
        </p>
      </el-col>
      <el-col :span="12" class="logincenter" style="text-align:-webkit-center">
        <p class="pstyle">
          <img class="titlestyle" src="/static/images/login/title.png">
        </p>
      </el-col>
      <el-col :span="6" style="text-align:-webkit-center">
        <p style="margin:30px 50px 0px 0px">
          <span>
            <i class="iconfont icon-help lana"></i>
            <a class="lana" href="http://61.161.226.197:8090/templates/帮助手册.doc">帮助手册</a>
          </span>
          <a class="lan">&nbsp;&nbsp;|&nbsp;&nbsp;</a>
          <span class="lana">中文</span>
          <a class="lan">&nbsp;&nbsp;|&nbsp;&nbsp;</a>
          <span class="lanb">English</span>
        </p>
      </el-col>
    </el-row>
    <login></login>
    <router-view></router-view>
    <!-- <el-tabs v-model="activeName">
      <el-tab-pane label="登录" name="first" :key="'first'">
        <login></login>
      </el-tab-pane>
      <el-tab-pane label="注册" name="second" :key="'second'">
        <register></register>
      </el-tab-pane>
      <el-tab-pane label="忘记用户名" name="third" :key="'third'">
        <forgetpassword></forgetpassword>
      </el-tab-pane>
      <el-tab-pane label="忘记密码" name="forth" :key="'forth'">
        <forgetusername></forgetusername>
      </el-tab-pane>
      <el-tab-pane label="重置账户" name="fifth" :key="'fifth'">
        <reset></reset>
      </el-tab-pane>
    </el-tabs> -->
    <el-row class="footerstyle">
      <el-col :span="4">&nbsp;</el-col>
      <el-col :span="16" class="footer">
        <div>建议使用谷歌、搜狗、360和火狐浏览器</div>
        <div>如在登录、注册、信息录入时遇到问题，请联系技术支持024-31530337，分机号608；13998821420</div>
      </el-col>
      <el-col :span="4">&nbsp;</el-col>
    </el-row>
  </div>
</template>

<script>
import Login from "@/views/login/Login";
import Register from "@/views/login/Register";
import Reset from "@/views/login/Reset";
import ForgetPassword from "@/views/login/ForgetPassword";
import ForgetUsername from "@/views/login/ForgetUsername";

export default {
  name: "Login",
  components: {
    login: Login,
    register: Register,
    forgetpassword: ForgetPassword,
    forgetusername: ForgetUsername,
    reset: Reset
  },
  data() {
    return {
      //默认第一个选项卡
      activeName: "first"
    };
  },
  methods: {}
};
</script>

<style lang="scss">
// @import '../../common/scss/all.scss';
$height: 22rem; //全局变量声明
$width: 22rem;
$heightimg: 8.75rem;
$widthimg: 8.75rem;
$heighttitle: 90%;
$widthtitle: 90%;
$bottomfooter: 3.125rem;
$heightfooter: 3.125rem;
$widthlgbtn: 12rem;
$line-heightfooter: 3.125rem;
$widthfooter: 100%;
$bgcolor: #ea2530;
$bgcolor2: rgb(234, 109, 37);
$whitecolor: #fff;
$color166: rgb(251, 106, 116);
$top0: 0;
$left0: 0;
$right0: 0;
$bottom0: 0;
$blackcolor: #2c2c2c;
.login {
  position: absolute;
  top: $top0;
  left: $top0;
  right: $right0;
  bottom: $bottom0;
  overflow: hidden;
  overflow-y: auto;
  z-index: 1000;
  background: url("/static/images/login/login.png") center 100% #65809d;

  * {
    font-size: 0.8rem;
  }

  p {
    margin: 4rem 0 0 6rem;
  }

  .imgstyle {
    height: $heightimg;
    width: $widthimg;
  }

  .titlestyle {
    height: $heighttitle;
    width: $widthtitle;
  }

  .pstyle {
    margin: 5rem 0 0 0;
  }
}

.lana {
  color: $whitecolor;
  font-size: 1rem;
  cursor: pointer;
  letter-spacing: 0.1rem;
}

.lanb {
  color: $blackcolor;
  font-size: 1rem;
  cursor: pointer;
}

.filed {
  margin: 0px 1.875rem 1.25rem 1.875rem;
}

.lgin {
  margin-top: 2.5rem;
  .el-button {
    width: $widthlgbtn;
    background-color: $bgcolor;
  }
  .el-button:hover {
    width: $widthlgbtn;
    background-color: $bgcolor2;
  }
}

.right {
  text-align: right;
  text-align: -webkit-right;
  color: $color166;
}

.left {
  color: $color166;
  padding-top: 30px;
  text-align: -webkit-left;
}

.login-form {
  height: $height;
  width: $width;
  background: url("/static/images/login/form_bg.png") no-repeat;
  .signstyle {
    margin-left: 8.5rem;
    a {
      cursor: pointer;
    }
  }
}

.el-button {
  border: 0px solid #dcdfe6;
}

.login-btn {
  color: $whitecolor;
  background-color: $bgcolor;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.footer {
  text-align: -webkit-center;
  color: $whitecolor;
  font-size: 1rem;
  * {
    text-align: -webkit-center;
    color: $whitecolor;
    font-size: 1rem;
  }
}

.footerstyle {
  position: absolute;
  bottom: $bottomfooter;
  height: $heightfooter;
  text-align: center;
  line-height: $line-heightfooter;
  width: $widthfooter;
}

.logincenter {
  margin-top: 3rem;
}

.muchtab {
  a {
    cursor: pointer;
  }
}
</style>