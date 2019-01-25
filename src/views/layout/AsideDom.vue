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
      <template v-for="route in routes">
        <template v-if="route.children">
          <el-submenu :index="route.path">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{route.meta.title}}</span>
            </template>
            <el-menu-item v-for="(children, childrenIndex) in route.children" :key="childrenIndex" :index="children.path">
            {{children.meta.title}}
              <!--<router-link :to="children.path">{{children.meta.title}}</router-link>-->
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="route.path">
            <i class="el-icon-menu"></i>
            <span>{{route.meta.title}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'AsideDom',
  data: function(){
    return {
      isCollapse: false,
      isUniqueOpened: true,
      isRouter: true,
    };
  },
  computed: {
    routes() {
      /**
      if(this.$store.state.menus.length === 0) {
        var menus = [];
        if(this.$store.state.user.resourceTrees == undefined) {
          var resourceTrees = JSON.parse(this.$store.state.user).resourceTrees;
        } else {
          var resourceTrees = this.$store.state.user.resourceTrees;
        }
        for (var i in resourceTrees) {
          var children = [];
          for (var j in resourceTrees[i].children) {
            var tempChild = {
              path: resourceTrees[i].children[j].resourcename,
              name: resourceTrees[i].children[j].resourcename,
              meta: {title: resourceTrees[i].children[j].resourceinfo, auth: true},
              component(resolve) {
                let componentPathChild = '@/views' + resourceTrees[i].children[j].resourcename;
                require([`${componentPathChild}.vue`], resolve);
              },
            };
            children.push(tempChild);
          }
          var temp = {
            path: resourceTrees[i].resourcename,
            name: resourceTrees[i].resourcename,
            meta: {title: resourceTrees[i].resourceinfo, auth: true},
            component(resolve) {
              let componentPath = '@/views/layout/Index';
              require([`${componentPath}.vue`], resolve);
            },
            children: children.length>0 ? children : null
          };
          menus.push(temp);
          this.$router.options.routes[1].children.push(temp);
        }
        this.$store.commit('$_setMenus', menus);
      }
       */
      console.log(2222222222222);
      console.log(this.$router.options.routes);
      console.log(this.$router.options.routes[1].children);
      
      return this.$router.options.routes[1].children;
    },
  },
}
</script>

<style>

</style>
