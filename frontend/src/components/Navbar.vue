<template>
  <div class="nav-bar">

    <div class="style-toggle">
      <div class="btn-box">
        <a
           href="javascript:;"
           :style="language === 'zh' ? 'color: #34c388' : 'color: #b0b0b0'"
           @click="switchLanguage('language', 'zh')">中文
        </a>
        <span> / </span>
        <a
           href="javascript:;"
           :style="language === 'en' ? 'color: #34c388' : 'color: #b0b0b0'"
           @click="switchLanguage('language', 'en')">EN
         </a>
      </div>
      <div class="btn-box themes-box">
        <span
          title="light"
          :class="{ 'active-light': !themes }"
          @click="themesToggle('light-themes')">L
        </span>
        <span
          title="dark"
          :class="{ 'active-dark': themes }"
          @click="themesToggle('dark-themes')">D
        </span>
      </div>
    </div>

    <div class="bar-footer">
      <span>{{ username }}</span>
      <a href="javascript:;" @click="logout">
        <img src="../assets/exit.png">
      </a>
    </div>

  </div>
</template>


<script>
import { mapActions } from 'vuex'

import { setLocalStorage, getLocalStorage } from '../common/storage'
import { USER_LOGOUT, THEMES_SWITCH } from '../store/mutation-types'

export default {
  name: 'nav-bar',
  data() {
    return {
      temp: this.themes,
      language: '',
    }
  },
  computed: {
    themes() {
      const currentThemes = this.$store.state.themes.themes
      if (!currentThemes) {
        const savedThemes = localStorage.getItem('themes') || 'dark-themes'
        return savedThemes === 'dark-themes'
      }
      return currentThemes === 'dark-themes'
    },
    username() {
      return this.$store.state.user.username
    },
    nodeInfo() {
      return this.$store.state.node.nodeName
    },
  },
  methods: {
    ...mapActions([USER_LOGOUT, THEMES_SWITCH]),
    // logout
    logout() {
      this.USER_LOGOUT()
      this.$router.push({ path: '/login' })
    },
    // toggle theme
    themesToggle(str) {
      this.THEMES_SWITCH({ themes: str })
    },
    // default language
    loadLanguage() {
      this.language = getLocalStorage('language') || 'en'
    },
    // switch language
    switchLanguage(key, value) {
      if (getLocalStorage(key) !== value) {
        this.language = value
        setLocalStorage(key, value)
        location.reload();
      }
    },
  },
  mounted() {
    this.loadLanguage()
  },
}
</script>


<style lang="scss">
.nav-bar {
  div {
   /*border: 1px solid red;*/
  }
  position: fixed;
  top: 0;
  left: 200px;
  right: 0;
  height: 63px;
  line-height: 63px;
  z-index: 1001;
  border-left: none;
  border-right: none;
  .style-toggle {
    position: absolute;
    right: 160px;
    width: 200px;
    height: 64px;
    border-right: 1px solid #313437;
    border-left: 1px solid #313437;
    &::before {
      content: '';
      position: absolute;
      left: 50%;
      height: 64px;
      background-color: #313437;
      width: 1px;
    }
    .btn-box {
      width: 98px;
      display: inline-block;
      text-align: center;
      color: #b0b0b0;
      height: 64px;
      line-height: 64px;
      font-weight: normal !important;
      span {
        cursor: pointer;
        &:hover {
          color: #aeaeae;
        }
      }
      &.themes-box {
        span {
          display: inline-block;
          position: relative !important;
          line-height: 18px;
          border-radius: 2px;
          width: 18px;
          height: 18px;
          border: 1px solid #b0b0b0;
          z-index: 1000;
          &:first-child {
            transform: translate(6px, -5px);
          }
          &:last-child {
            transform: translate(-3px, 2px);
            background-color: #b0b0b0;
            border-color: #b0b0b0;
            color: #fff;
          }
          &.active-dark {
            background-color: #34c388;
            border: #34c388;
            color: #1d1e25;
            z-index: 1006;
          }
          &.active-light {
            border-color: #34c388;
            background-color: #fff;
            color: #34c388 !important;
            z-index: 1006;
          }
        }
      }
    }
  }
  .select-node {
    position: absolute;
    right: 380px;
  }

  .bar-footer {
    float: right;
    margin-right: 20px;
    height: 64px;
    line-height: 64px;
    text-align: center;
    span {
      font-size: 16px;
      font-weight: bolder;
      margin-right: 12px;
      vertical-align:middle;
      &:hover {
        color: #333;
      }
    }
    a {
      font-weight: bold;
      img {
        width: 24px;
        height: 24px;
        border: none;
        vertical-align: middle;
      }
    }
  }
}
</style>
