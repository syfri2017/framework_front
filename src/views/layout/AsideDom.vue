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
              <i :class="getMenuIcon(menu.icon)"></i>
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
            <i :class="getMenuIcon(menu.icon)"></i>
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
      let vm = this;
      vm.$axios.get('/resource/menuTree').then(function (res) {
        vm.menus = res.data.result; 
      }.bind(this), function (error) {
        console.log(error)
      })
    },
    getMenuIcon(value) {
      return "iconfont " + value;
    }
  },
  mounted() {
      this.initMenu();
  },
}
</script>

<style>

</style>
