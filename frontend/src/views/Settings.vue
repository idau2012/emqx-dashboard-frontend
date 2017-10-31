<template>
  <div class="settings-view">
    <div class="page-title">{{ $t('leftbar.settings') }}</div>

    <el-card>
      <el-row :gutter="20">
        <el-form ref="options" :model="options" label-width="100px" label-position="top">
          <el-col :span="12">
            <el-form-item :label="$t('settings.themes')">
              <el-radio-group v-model="options.themes" @change="switchThemes">
                <el-radio label="dark-themes">dark-themes</el-radio>
                <el-radio label="light-themes">light-themes</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="$t('settings.language')">
              <el-radio-group v-model="options.language">
                <el-radio label="en">EN</el-radio>
                <el-radio label="zh">中文</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="confirm-btn">
            <el-form-item>
              <el-button
                type="success"
                size="small"
                :plain="true"
                :disabled="notChanged"
                @click="applySetting">
                {{ $t('settings.apply') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import {
  Form, FormItem, Row, Col, Radio,
  RadioGroup, Button, Card,
} from 'element-ui'

import { setLocalStorage, getLocalStorage } from '../common/storage'
import { USER_LOGOUT, THEMES_SWITCH } from '../store/mutation-types'

export default {
  name: 'settings-view',
  components: {
    'el-radio-group': RadioGroup,
    'el-radio': Radio,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-card': Card,
    'el-row': Row,
    'el-col': Col,
  },
  data() {
    return {
      options: {
        themes: '', // true: dark
        language: '', // true: en
      },
      defaultConfig: '',
      defaultThemes: '',
    }
  },
  computed: {
    notChanged() {
      return this.defaultConfig === JSON.stringify(this.options)
    },
  },
  methods: {
    ...mapActions([USER_LOGOUT, THEMES_SWITCH]),
    init() {
      let currentThemes = this.$store.state.themes.themes
      if (!currentThemes) {
        currentThemes = getLocalStorage('themes') || 'dark-themes'
      }
      this.options.themes = currentThemes
      this.defaultThemes = currentThemes
      this.options.language = getLocalStorage('language') || 'en'
      this.defaultConfig = JSON.stringify(this.options)
    },
    // toggle theme
    themesToggle() {
      this.defaultThemes = this.options.themes
      this.THEMES_SWITCH({ themes: this.defaultThemes })
    },
    applySetting() {
      this.$message.success(this.$t('settings.success'))
      this.themesToggle()
      this.switchLanguage('language', this.options.language)
      this.defaultConfig = JSON.stringify(this.options)
    },
    switchThemes() {
      document.getElementsByTagName('html')[0].setAttribute('class', this.options.themes)
    },
    // switch language
    switchLanguage(key, value) {
      if (getLocalStorage(key) !== value) {
        this.language = value
        setLocalStorage(key, value)
        setTimeout(() => {
          location.reload()
        }, 600)
      }
    },
  },
  created() {
    this.init()
  },
  beforeRouteLeave(to, from, next) {
    this.THEMES_SWITCH({ themes: this.defaultThemes })
    next()
  },
}
</script>


<style lang="scss">
.settings-view {
  .el-card {
    margin-top: 24px;
  }
  .el-switch {
    &.is-checked{
      .el-switch__core {
        background-color: #42d885;
        border-color: #42d885;
      }
    }
  }
  .confirm-btn {
    .el-form-item {
      margin-bottom: 4px !important;
    }
  }
}
</style>
