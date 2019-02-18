<template>
  <div id="home">
  <h1>HomeList</h1>
   <el-button type="primary" @click="navigate">跳转</el-button>
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    navigate(){
      console.log(this.CONSTANT.currentUser);
      this.$router.replace({name:"home/detail"})
    }
  },
}
</script>

<style>

</style>
