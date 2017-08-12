<template>
  <div class="leftbar">
    <div class="bar-title">
      <img src="../assets/emqlogo.png" class="logo">
      <span>EMQ X</span>
    </div>
    <el-menu :default-active="'/' + $route.path.split('/')[1]" mode="vertical" theme="dark" unique-opened router>
      <el-menu-item-group title="MONITORING">
        <el-menu-item index="/"><i class="fa fa-bar-chart"></i>Overview</el-menu-item>
      </el-menu-item-group>
        <el-menu-item index="/clients"><i class="fa fa-circle"></i>Clients</el-menu-item>
        <el-menu-item index="/sessions"><i class="fa fa-commenting"></i>Sessions</el-menu-item>
        <el-menu-item index="/routers"><i class="fa fa-plug"></i>Routers</el-menu-item>
        <el-menu-item index="/subscriptions"><i class="fa fa-rss-square"></i>Subscriptions</el-menu-item>
      <el-menu-item-group title="MANAGEMENT">
        <el-menu-item index="/plugins"><i class="fa fa-cubes"></i>Plugins</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="TOOLS">
        <el-menu-item index="/websocket"><i class="fa fa-rss"></i>Websocket</el-menu-item>
        <el-menu-item index="/api"><i class="fa fa-code"></i>API</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="ADMIN">
        <el-menu-item index="/users"><i class="fa fa-user-o"></i>Users</el-menu-item>
      </el-menu-item-group>
    </el-menu>

    <div class="bar-footer">
      <span>{{ user.username }} </span>
      <a @click="logout" href="javascript:;">
        <img src="../assets/exit.png">
      </a>
    </div>
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


<style>
.leftbar {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 200px;
  z-index: 1000;
}
.leftbar,
.leftbar .el-menu--dark {
  background-color: #242327;
}
.leftbar .el-menu-item-group__title {
  color: #fff;
  margin-bottom: 10px;
  margin-top: 15px;
  font-size: 12px;
}
.leftbar .el-menu-item {
  height: 40px;
  line-height: 40px;
  color: #a7a7a7;
}
.leftbar .fa {
  margin-right: 10px;
}
.leftbar .el-submenu .el-menu-item {
  padding-left: 50px !important;
}
.leftbar .el-menu-item.is-active,
.leftbar .el-menu-item:hover {
  color: #227D51;
  background-color: #37363b;
}
.leftbar .bar-title,
.leftbar .bar-footer {
  height: 60px;
  line-height: 60px;
  color: #fff;
}
.leftbar .bar-title {
  border-bottom: 1px solid #161616;
  font-size: 24px;
}
.leftbar .bar-title img {
  width: 48px;
  margin: 5px 10px 6px 20px;
  float: left;
}
.leftbar .bar-footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-top: 1px solid #161616;
  padding-left: 20px;
}
.leftbar .bar-footer img {
  width: 18px;
  vertical-align: top;
  margin-top: 21px;
}
.leftbar .bar-footer a {
  padding-left: 10px;
}
</style>
