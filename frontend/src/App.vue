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

<style>
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 300;
    src: local('Roboto Light'), local('Roboto-Light'), url(./assets/fonts/Roboto-Light.woff) format('woff'), url(./assets/fonts/Roboto-Light.ttf) format('truetype');
  }
  html, body, #app {
    height: 100%;
    margin: 0;
    background-color: #292929;
  }
  body {
    font-family: "Roboto", "Helvetica Neue", "Helvetica", "Work sans", Arial, sans-serif;
    -webkit-font-smoothing: subpixel-antialiased;
    color: #a7a7a7;
    font-size: 14px;
    font-weight: 400;
  }
  .h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
    color: #ffffff;
    font-weight: 400;
  }
  a {
    color: #00ab6b;
    text-decoration: none;
  }

  .el-button {
    font-family: "Roboto", "Helvetica Neue", "Helvetica", "Work sans", Arial, sans-serif;
  }

  /* button */
  .el-button i {
    margin-right: 5px;
  }
</style>
