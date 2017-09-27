<template>
  <div class="leftbar">
    <div class="bar-title">
      <img src="../assets/emqlogo.png" class="logo">
      <span>Dashboard</span>
    </div>
    <el-menu :default-active="'/' + $route.path.split('/')[1]" mode="vertical" theme="dark" unique-opened router>
      <el-menu-item-group title="MONITORING">
        <el-menu-item index="/"><i class="fa fa-bar-chart"></i>Overview</el-menu-item>
      </el-menu-item-group>
        <el-menu-item index="/clients"><i class="fa fa-microchip"></i>Clients</el-menu-item>
        <el-menu-item index="/sessions"><i class="fa fa-exchange"></i>Sessions</el-menu-item>
        <el-menu-item index="/routes"><i class="fa fa-random"></i>Routes</el-menu-item>
        <el-menu-item index="/subscriptions"><i class="fa fa-rss-square"></i>Subscriptions</el-menu-item>
      <el-menu-item-group title="MANAGEMENT">
        <el-menu-item index="/plugins"><i class="fa fa-plug"></i>Plugins</el-menu-item>
        <el-menu-item index="/listeners"><i class="fa fa-superpowers"></i>Listeners</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="TOOLS">
        <el-menu-item index="/websocket"><i class="fa fa-html5"></i>Websocket</el-menu-item>
        <el-menu-item index="/http_api"><i class="fa fa-code"></i>API</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="ADMIN">
        <el-menu-item index="/users"><i class="fa fa-user-o"></i>Users</el-menu-item>
      </el-menu-item-group>
    </el-menu>
  </div>
</template>


<script>
import { Menu, MenuItem, MenuItemGroup } from 'element-ui'
import { mapActions } from 'vuex'
import { USER_LOGOUT } from '../store/mutation-types'

export default {
  name: 'leftbar',
  components: {
    'el-menu': Menu,
    'el-menu-item': MenuItem,
    'el-menu-item-group': MenuItemGroup,
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  methods: {
    ...mapActions([USER_LOGOUT]),
    logout() {
      this.USER_LOGOUT()
      this.$router.push({ path: '/login' })
    },
  },
}
</script>


<style lang="scss">
.leftbar {
  /*box-shadow: 3px 0 10px #c1c1c1;*/
  position: fixed;
  top: 0;
  bottom: 0;
  width: 200px;
  z-index: 1000;
  overflow-y: auto;
  .el-menu {
    position: relative;
    left: 0;
    top: 70px;
    width: 200px;
    padding-bottom: 52px;
  }
  .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
  .el-menu-item-group__title {
    font-weight: bolder;
    margin-bottom: 10px;
    margin-top: 15px;
    font-size: 14px;
  }
  .bar-title {
    position: fixed;
    top: 0;
    z-index: 1003;
    padding-left: 20px;
    display: flex;
    height: 63px;
    width: 180px;
    align-items: center;
    border-bottom: 1px solid #6c7786;
    span {
      font-size: 16px;
      color: #34c388;
      margin-left: 8px;
    }
    img {
      width: 48px;
    }
  }
  .fa {
    margin-right: 10px;
  }
  .el-submenu .el-menu-item {
    padding-left: 50px !important;
  }
}
</style>
