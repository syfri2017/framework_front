<template>
  <el-container>
    <el-header><headerDom/></el-header>
    <el-container>
      <el-aside class="aside"><asideDom/></el-aside>
      <el-main>
        <mainDom/>
      <!--
        <section class="app-main">
          <transition name="fade-transform" mode="out-in">
            <router-view/>
          </transition>
        </section>
        -->
      </el-main>
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
