<template>
  <div class="overview-view" v-loading="loading">
    <div class="page-title">Overview</div>
  </div>
</template>


<script>

export default {
  name: 'overview-view',
  data() {
    return {
      loading: false,
    }
  },
  beforeCreate() {
  },
  created() {
  },
  mounted() {
  },
  methods: {
  },
}
</script>


<style>
.overview-view {
  padding-top: 20px;
}
.overview-view .page-title {
  position: absolute;
  padding: 10px 0;
}
.overview-view .el-loading-spinner {
  top: 10%;
}
</style>

