<template>
  
</template>


<script>
export default {
  name: 'topbar',

  components: {},

  data() {
    return {
      lang: window.localStorage.getItem('language') || 'en',
    }
  },

  computed: {
    activeLink() {
      return this.$route.path === '/help'
    },
  },

  methods: {
    openLink(type) {
      let link = ''
      if (type === 'enterprise') {
        link = this.lang === 'en'
          ? 'https://www.emqx.io/downloads#enterprise'
            : 'https://www.emqx.io/cn/downloads#enterprise'
      } else if (type === 'github') {
        link = 'https://github.com/emqx/emqx'
      }
      const windowUrl = window.open(link)
      windowUrl.opener = null
    },
  },
}
</script>


<style lang="scss">
.topbar {
  height: 60px;
  line-height: 60px;
  padding-left: 110px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 4;
  .top-area {
    background-color: #242327;
    height: 100%;
    padding: 0 32px;
    text-align: right;
    .topbar-right {
      .help-link {
        display: inline;
        line-height: 32px;
        .link {
          display: inline-block;
          color: #82858F;
          padding: 0 20px;
          border-right: 1px solid #2B2C30;
          position: relative;
          top: 3px;
          .icon-bangzhu {
            font-size: 20px;
          }
        }
        a.active {
          color: #34C388;
        }
      }
      .el-button {
        width: 135px;
        border-radius: 40px;
        border-width: 2px;
        margin-left: 20px;
        font-size: 14px;
        font-weight: 400;
        line-height: 15px;
        background: transparent;
        &.enterprise-btn {
          color: #34C388;
          border-color: #34C388;
          .icon-arrow {
            position: relative;
            top: 1px;
          }
        }
        &.github-btn {
          color: #ADAFB4;
          border-color: #ADAFB4;
        }
        .iconfont {
          margin-left: 5px;
        }
      }
      .el-button--medium {
        padding: 9px 20px;
      }
    }
  }
}
</style>
