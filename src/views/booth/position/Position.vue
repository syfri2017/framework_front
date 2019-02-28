<template>
  <div id="position" class="ploterstyle">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'position'
}
</script>

<style>
/* .content[data-v-57ee01a8]{
  overflow-y: hidden;
} */

</style>
