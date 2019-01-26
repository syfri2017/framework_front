<template>
  <div id="asideDom">
  <!--
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group>
  -->
    <el-menu :default-active="$route.path" :collapse="isCollapse" mode="vertical" :unique-opened="isUniqueOpened" :router="isRouter"
              background-color="#463132" text-color="#ffffff" active-text-color="#E40613">
      <template v-for="menu in menus">
        <template v-if="menu.children">
          <el-submenu :index="menu.resourcename">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu.resourceinfo}}</span>
            </template>
            <el-menu-item v-for="(child, childIndex) in menu.children" :key="childIndex" :index="child.resourcename">
              {{child.resourceinfo}}
              <!--<router-link :to="children.path">{{children.meta.title}}</router-link>-->
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="menu.resourcename">
            <i class="el-icon-menu"></i>
            <span>{{menu.resourceinfo}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>

export default {
  name: 'AsideDom',
  data(){
    return {
      isCollapse: false,
      isUniqueOpened: true,
      isRouter: true,
      menus:[],
    };
  },
  methods: {
    //初始化菜单
    initMenu(){
      if (localStorage.getItem("shiroUser")) {
        this.menus = JSON.parse(localStorage.getItem("shiroUser")).resourceTrees;
      }
      /**通过请求方式获取菜单，暂不好用，跨域问题  by li.xue */
      /**
      let vm = this;
      vm.$axios.get('/getMenu').then(function (res) {
        console.log(res.data);
      }.bind(this), function (error) {
        console.log(error)
      })
      */
    }
  },
  mounted() {
      this.initMenu()
  },
}
</script>

<style>

</style>
