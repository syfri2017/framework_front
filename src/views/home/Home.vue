<template>
  <div id="home">
  <h1>HOME</h1>
   <el-button type="primary" @click="navigate">跳转</el-button>
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    navigate(){
      this.$router.replace({name:"exhprediction"})
    }
  },
}
</script>

<style>

</style>
