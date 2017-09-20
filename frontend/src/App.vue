<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss">
  /* themes-dark */
  @import "./assets/themes/dark.scss";
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    src: local('Roboto Light'), local('Roboto-Light'), url(./assets/fonts/Roboto-Light.woff) format('woff'), url(./assets/fonts/Roboto-Light.ttf) format('truetype');
  }
</style>
