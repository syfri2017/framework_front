<template>
  <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#463132"
            text-color="#ffffff" active-text-color="#E40613" unique-opened router>
           
      <template v-for="menu in menus">
        <template v-if="menu.children">
          <el-submenu :index="menu.resourcename" :key="menu.resourcename">
            <template slot="title">
              <i :class="getMenuIcon(menu.icon)"></i>
              <span>&nbsp;{{menu.resourceinfo}}</span>
            </template>
            <el-menu-item v-for="(child, childIndex) in menu.children" :key="childIndex" :index="child.resourcename">
              {{child.resourceinfo}}
              <!--<router-link :to="children.path">{{children.meta.title}}</router-link>-->
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="menu.resourcename" :key="menu.resourcename">
            <i :class="getMenuIcon(menu.icon)"></i>
            <span>&nbsp;{{menu.resourceinfo}}</span>
          </el-menu-item>
        </template>
      </template>
        </el-menu>
    </div>
</template>

<script>
  import bus from '../../common/js/bus';
  export default {
  name: 'AsideDom',
  data(){
    return {
       collapse: false,
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
  computed:{
      onRoutes(){
        return this.$route.path;
      }
  },
  created(){
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
          this.collapse = msg;
      })
  }
}
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 60px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 240px;
    }
    .sidebar > ul {
        height:100%;
    }
    .el-menu-item i {
      color: #ffffff;
    }
    .el-submenu__title i {
      color: #ffffff;
    }
</style>
