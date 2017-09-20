<template>
  <div class="not-found text-center">
    <p>404 Not Found</p>
    <a href="javascript:;" @click="back">HomePage</a>
    <a href="javascript:;" @click="back(true)">Back to last page</a>
  </div>
</template>


<script>
export default{
  name: 'NotFound',
  data() {
    return {
    }
  },
  methods: {
    back(history = false) {
      if (history) {
        this.$router.go(-2)
      } else {
        this.$router.push({ path: '/' })
      }
    },
  },
  components: {
  },
}
</script>


<style lang="scss">
.not-found {
  padding: 50px;
  p {
    margin-top: 30px;
    font-size: 20px;
  }
  a {
    margin-right: 20px;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
