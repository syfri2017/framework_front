<template>
  <el-container>
    <el-header>
      <div class="header"></div>
    </el-header>
    <el-container>
      <el-aside class="aside" style="width: 240px;">
        <el-menu
          :show-timeout="200"
          :default-active="$route.path"
          mode="vertical"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <div
            v-for="route in routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
            v-if="route.meta"
          >
            <el-submenu v-if="route.children&&route.children.length > 0">
              <template slot="title">
                <span>{{route.meta.title}}</span>
              </template>
              <el-menu-item v-for="children in route.children" :key="children.path">
                <router-link :to="children.path">{{children.meta.title}}</router-link>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-if="!route.children">
              <router-link :to="route.path">{{route.meta.title}}</router-link>
            </el-menu-item>
          </div>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
export default {
  computed: {
    routes() {
      return this.$router.options.routes;
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      debugger;
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      debugger;
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      debugger;
      //this.$router.push({name: 'system/user'})
      console.log(key, keyPath);
    }
  }
};
</script>
<style scoped>
.header {
  background: url(/static/images/login/pic_logo.png) no-repeat center center;
  background-size: auto 100%;
  position: relative;
  width: 350px;
  height: 40px;
  margin-top: 10px;
}
.el-header,
.el-footer {
  background-color: #2d1113;
  color: #333;
  text-align: center;
  line-height: 50px;
}
.aside {
  width: 200px;
  height: 750px;
  background-color: rgb(70, 49, 50);
}
</style>
