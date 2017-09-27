<template>
  <div class="nav-bar">
    <div class="select-node">
      <el-select class="select-radius" v-model="nodeName" :disabled="loading" placeholder="Select Node" size="small" @change="changeSelect">
        <el-option
          v-for="item in select.nodes"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
    </div>

    <div class="themes-toggle">
      <span title="light themes" @click="themesToggle('light-themes')"></span>
      <span title="dark themes" @click="themesToggle('dark-themes')"></span>
    </div>
    <div class="bar-footer">
      <span>admin</span>
      <a href="javascript:;" @click="logout">
        <img src="../assets/exit.png">
      </a>
    </div>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import { Select, Option } from 'element-ui'

import { httpGet } from '../store/api'
import { USER_LOGOUT, CURRENT_NODE } from '../store/mutation-types'

export default {
  name: 'nav-bar',
  components: {
    'el-option': Option,
    'el-select': Select,
  },
  data() {
    return {
      loading: false,
      nodeName: '',
      select: {
        nodeName: '',
        nodes: {},
      },
      hello: '',
    }
  },
  mounted() {
    this.loadNode()
  },
  methods: {
    ...mapActions([CURRENT_NODE]),
    ...mapActions([USER_LOGOUT]),
    logout() {
      this.USER_LOGOUT()
      this.$router.push({ path: '/login' })
    },
    // set global nodeName
    setStore() {
      this.CURRENT_NODE({ nodeName: { current: this.nodeName } })
    },
    // load nodes form store or server then load data
    loadNode() {
      const currentNode = this.$store.state.nodeName.current
      httpGet('/management/nodes').then((response) => {
        // set default of select
        this.nodeName = currentNode || response.data.result[0].name || ''
        this.setStore()
        // could select
        this.select.nodes = response.data.result
      })
    },
    themesToggle(str) {
      document.body.removeAttribute('class')
      document.body.setAttribute('class', str)
    },
    changeSelect() {
      this.setStore()
    },
  },
}
</script>


<style lang="scss" scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 200px;
  right: 0;
  height: 64px;
  z-index: 1002;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .themes-toggle {
    display: flex;
    justify-content: center;
    position: absolute;
    right: 180px;
    span {
      width: 12px;
      padding: 1px;
      height: 12px;
      border: 2px solid #999;
      display: block;
      margin-right: 6px;
      cursor: pointer;
      &:first-child {
        border-color: #42d885;
      }
      &:last-child {
        border-color: #b0b0b0;
      }
    }
  }
  .active-themes {
    background-color: #42d885 !important;
  }
  .select-node {
    position: absolute;
    right: 280px;
  }

  .bar-footer {
    margin-right: 20px;
    display: flex;
    align-items: center;
    span {
      font-size: 16px;
      font-weight: bolder;
      margin-right: 20px;
      &:hover {
        color: #333;
      }
    }
    a {
      font-weight: bold;
      img {
        width: 24px;
        margin-top: 4px;
      }
    }
  }
}
</style>
