<template>
  <div id="asideDom">
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group>
    <el-menu :default-active="$route.path" :collapse="isCollapse" mode="vertical"
              background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
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
  </div>
</template>

<script>
export default {
  name: 'AsideDom',
  computed: {
    routes() {
      console.log(this.$store.state.user.resourceTrees);
      return this.$store.state.user.resourceTrees;
    },
    isCollapse() {
      return this.$store.state.isCollapse;
    }
  },
}
</script>

<style>

</style>
