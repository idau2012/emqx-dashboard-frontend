<template>
  <div class="home-view">
    <navbar></navbar>
    <leftbar></leftbar>
    <div class="home-content">
      <router-view></router-view>
    </div>
  </div>
</template>


<script>
import Leftbar from '../components/Leftbar'
import Navbar from '../components/Navbar'

export default {
  name: 'home-view',
  components: { Leftbar, Navbar },
}
</script>


<style lang="scss">
.home-view {
  min-height: 100%;
  /* top */
  margin-top: 70px;
  /* left */
  .home-content {
    margin: 0 20px 10px 220px;
  }
}
</style>

