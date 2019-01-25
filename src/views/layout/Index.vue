<template>
  <el-container>
    <el-header><headerDom></headerDom></el-header>
    <el-container>
      <asideDom class="aside"></asideDom>

<!--
      <el-aside class="aside">
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
      -->
      <el-container>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
//引入Header Component
import headerDom from '@/views/layout/HeadDom'
//引入Aside Component
import asideDom from '@/views/layout/AsideDom'
//引入Main Component
import mainDom from '@/views/layout/MainDom'
export default {
  components: {
    headerDom,
    asideDom,
    mainDom
  },
  computed: { 
    routes() {
      return this.$router.options.routes;
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style scoped>
.el-header,
.el-footer {
  background-color: #2d1113;
  color: #333;
  text-align: center;
  line-height: 50px;
}
.aside {
  width: 240px !important;
  height: 600px;
  background-color: rgb(70, 49, 50);
}
</style>
