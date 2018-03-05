<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style lang="scss">
  @import "./assets/common";

  @import "./assets/themes/dark";
  @import "./assets/themes/light";
</style>
