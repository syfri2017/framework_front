<template>
  <el-container>
    <el-header><HeaderDom></HeaderDom></el-header>
    <el-container>
      <el-aside class="aside"><AsideDom></AsideDom></el-aside>
      <el-main>
        <Breadcrumb></Breadcrumb>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
//引入Header Component
import HeaderDom from '@/views/layout/HeadDom'
//引入Aside Component
import AsideDom from '@/views/layout/AsideDom'
//引入面包屑Breadcrumb
import Breadcrumb from '@/components/breadcrumb'
export default {
  components: {
    HeaderDom,
    AsideDom,
    Breadcrumb
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
.el-main {
  padding: 5px 10px 5px 10px;
}
</style>