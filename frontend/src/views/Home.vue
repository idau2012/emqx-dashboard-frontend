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
  min-height: 100%;
  padding-bottom: 50px;
  .home-content {
    margin: 0 20px 0 220px;
  }
}
</style>

