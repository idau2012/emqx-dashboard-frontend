<template>
  <div class="home-view">
    <leftbar></leftbar>
    <div class="home-content">
      <router-view></router-view>
    </div>
  </div>
</template>


<script>
import Leftbar from '../components/Leftbar'

export default {
  name: 'home-view',
  components: { Leftbar },
}
</script>


<style lang="scss">
.home-view {
  box-sizing: border-box;
  min-height: 100%;
  .home-content {
    margin: 0 20px 0 220px;
    padding-bottom: 20px;
  }
}
</style>
