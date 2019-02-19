<template>
  <div id="home">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'home',
  data(){
    return {
      currentUser: null
    }
  },
  created() {
    this.currentUser = this.CONSTANT.currentUser;
    if (this.currentUser.deptid == 'ZSYH') {
      if (this.currentUser.usertype == 'CHN') {
        this.$router.push({ path: '/prediction/exhprediction/edit' });
      } else if (this.currentUser.usertype == 'EHN') {
        this.$router.push({ path: '/prediction/exhprediction/edit_ENG' });
      }
    }
  },
  methods: {
    
  },
}
</script>

<style>

</style>
