<template>
<div style="border-bottom:1px;">
  <el-breadcrumb class="app-breadcrumb" separator=">">
    <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
      <span v-if="item.meta.isRedirect===false" class="no-redirect">
        {{item.meta.title}}
      </span>
      <a v-else @click.prevent="handleLink(item)">{{item.meta.title}}</a>
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
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)

      //面包屑第一项：带首页
      
      const first = matched[0]
      if (first && first.name !== 'home') {
        
        matched = [{ path: '/home', meta: { title: '首页' }}].concat(matched)
      } 
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
    },
    pathCompile(path) {
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 30px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
