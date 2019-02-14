<template>
<div class="breadcrumb-line">
  <el-breadcrumb class="app-breadcrumb" separator=">">
    <el-breadcrumb-item v-for="(item, index) in levelList" :key="index">
      <span v-if="item.meta.isRedirect===false" class="no-redirect">
        <span v-if="index==0" class="iconfontBread icon-breadcrumb">&nbsp;</span>
        {{item.meta.title}}
      </span>
      <a v-else @click.prevent="handleLink(item)" class="yes-redirect">
        <span v-if="index==0" class="iconfontBread icon-breadcrumb">&nbsp;</span>
        {{item.meta.title}}
      </a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</div>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.meta.title);
      //面包屑第一项：带首页
      /** 
      const first = matched[0]
      if (first && first.name !== 'home') {
        matched = [{ path: '/home', meta: { title: '首页' }}].concat(matched)
      } 
      */
      this.levelList = matched.filter(item => item.meta && item.meta.title);
      
      /**面包屑最后一级不跳转  by li.xue 2019/2/14 */
      if(this.levelList!=null && this.levelList.length>1){
        this.levelList[this.levelList.length-1].meta.isRedirect = false;
      }
    },
    pathCompile(path) {
      const { params } = this.$route;
      var toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      const { path } = item;
      if (path) {
        this.$router.push(path);
        return;
      }
      this.$router.push(this.pathCompile(path));
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .breadcrumb-line {
    border-bottom: 1px solid;
    border-color: #BFCBD9;
    margin-bottom: 10px;
    padding: 2px 0px 2px 0px;
    .iconfontBread {
      font-family: "iconfont" !important;
    }
    .app-breadcrumb.el-breadcrumb {
      // display: inline-block;
      font-size: 14px;
      line-height: 30px;
      .no-redirect {
        color: #666666;
        cursor: text;
      }
      .yes-redirect {
        color: #337AB7;
        cursor: text;
      }
    }
  }
  .el-breadcrumb__inner a, .el-breadcrumb__inner.is-link {
    font-weight: 400;
  }
</style>
