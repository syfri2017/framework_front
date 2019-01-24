<template>
  <div id="header" class="header-box">
    <el-row class="container-box">
      <el-col :span="12"><div class="logo-title"></div></el-col>
      <el-col :span="12">
        <el-dropdown class="dropdown-position" @command="handleCommand">
          <div class="el-dropdown-link">
            <span id="realname" class="realname-font">欢迎您！</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="personal">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'top',
  data () {
    return {
    }
  },
  methods:{
    handleCommand(command) {
      if("personal" == command) {
        this.personal();
      }else if("logout" == command) {
        this.logout();
      }
    },
    personal() {
      alert("personal");
    },
    logout(){
      this.axios.get('/vueCliLogout').then(function (res) {
        if("success" == res.data) {
          this.$store.commit('$_setStorage', '');
          this.$store.commit('$_setLogin', 'N');
          this.$router.push({ path: '/' });
        }
      }.bind(this), function (error) {
        console.log(error)
      })
    }
  }
}
</script>

<style>
.header-box {
  position: relative;
  min-height: 40px;
  border-radius: 0;
  z-index: 10;
}
.container-box {
  margin-top: 10px;
  margin-left: -10px;
}
.logo-title {
  background: url(/static/images/login/pic_logo.png)no-repeat center center; background-size: auto 100%; position: relative;
  width: 350px;
  height: 40px;
}
.realname-font,
.el-icon-arrow-down {
  font-size: 12px;
  color: #fff;
}
.el-dropdown-link {
  margin-top: -5px;
  cursor: pointer;
  color: #409EFF;
}
.dropdown-position {
  display: inline-block;
  position: absolute;
  right: 15px;
}
</style>
