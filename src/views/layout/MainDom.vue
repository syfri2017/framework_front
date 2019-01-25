<template>
  <div id="mainDom">
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <router-view/>
      </transition>
    </section>
  </div>
</template>

<script>
export default {
  name: 'MainDom'
}
</script>

<style>
.app-main {
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
}
</style>
