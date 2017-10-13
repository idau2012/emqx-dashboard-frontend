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
  @import "./assets/themes/light";
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    src: local('Roboto Light'), local('Roboto-Light'), url(./assets/fonts/Roboto-Light.woff) format('woff'), url(./assets/fonts/Roboto-Light.ttf) format('truetype');
  }
  .page-title {
    padding: 30px 0 10px 0 !important;
  }
  ::-ms-clear, ::-ms-reveal {
    display:none;
  }
</style>
