<template>
  <div class="nav-bar">
    <div class="bar-title">
      <img src="../assets/emqlogo.png" class="logo">
      <span>Dashboard</span>
    </div>

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
    loginout() {

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
  left: 0;
  right: 0;
  height: 64px;
  z-index: 1002;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .bar-title {
    margin-left: 20px;
    display: flex;
    align-items: center;
    span {
      font-size: 20px;
      font-weight: bold;
      color: #34c388;
      margin-left: 10px;
    }
    img {
      width: 54px;
    }
  }

  .select-node {
    position: absolute;
    right: 200px;
  }

  .bar-footer {
    margin-right: 20px;
    display: flex;
    align-items: center;
    span {
      font-size: 18px;
      margin-right: 10px;
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
