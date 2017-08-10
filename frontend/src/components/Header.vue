<template>
  <div class="topbar">
    <div class="right-part">
      <span>{{ user.username }} </span>
      <a @click="logout" href="javascript:;">
        <img src="../assets/exit.png">
      </a>
    </div>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import { USER_LOGOUT } from '../store/mutation-types'

export default {
  name: 'topbar',
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
.topbar {
  background-color: #fff;  
  padding: 0 30px 0 220px;
  height: 60px;
  line-height: 60px;
  text-align: right;
}
.topbar .right-part {
  display: inline-block;  
}
.topbar img {
  width: 18px;  
  vertical-align: top;
  margin-top: 21px;
}
.topbar .right-part a {
  padding-left: 8px;  
}
</style>
