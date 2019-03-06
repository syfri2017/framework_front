<template>
   <el-container class="wrapper">
    <el-header><HeaderDom></HeaderDom></el-header>
    <el-container>
      <el-aside width="240px"><AsideDom></AsideDom></el-aside>
      <el-main class="content-box" :class="{'content-collapse':collapse}">
          <div class="content">
            <Breadcrumb></Breadcrumb>
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
          </div>
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

import bus from '../../../common/js/bus';
export default {
  data(){
    return {
      collapse: false
    }
  },
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
  },
  created(){
      bus.$on('collapse', msg => {
          this.collapse = msg;
      })
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
/* .aside {
  width: 240px !important;
  height: 600px;
  background-color: rgb(70, 49, 50);
} */
.el-main {
  padding: 5px 10px 5px 10px;
}
.content-box {
    position: absolute;
    left: 240px;
    right: 0;
    top: 60px;
    bottom: 0;
    padding-bottom: 10px;
    -webkit-transition: left .3s ease-in-out;
    transition: left .3s ease-in-out;
    background: #fff; 

    display: flex;
    flex-direction: column;
}

.content {
    display: flex;
    flex: 1;
    flex-direction: column;
    box-sizing: border-box;
    width: auto;
    height: 100%;
    padding: 10px;
    overflow-y: auto;
}

.content-collapse {
    left: 65px;
}

.container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>