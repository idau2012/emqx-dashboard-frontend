<template>
  <div class="signup-view">
    <el-row style="height: 100%;">
      <el-col :xs="20" :sm="10" :md="8" :lg="8" class="signup-form">
        <el-card class="box-card">
          <div slot="header">
            <span style="font-size: 16px">SIGN UP</span>
          </div>
          <el-form label-position="top">
            <el-form-item label="Username">
              <el-input
                v-model="username"
                v-bind:class="{ error: signupError.username }"
                v-bind:placeholder="signupError.username"
                @focus="signupError.username=''"
              ></el-input>
            </el-form-item>
            <el-form-item label="Password">
              <el-input type="password"
                v-model="password"
                v-bind:class="{ error: signupError.password }"
                v-bind:placeholder="signupError.password"
                @focus="signupError.password=''"
              ></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: right;">
            <el-button type="success" @click="signup">Sign Up</el-button>
          </div>
          <div>
            Is a member?<a href="javascript:;" @click="login"> Login now</a>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>


<script>
import { mapActions } from 'vuex'
import { Col, Row, Card, Form, FormItem, Input, Button } from 'element-ui'
import { httpPost } from '../store/api'
import { USER_LOGIN } from '../store/mutation-types'

export default {
  name: 'signup-view',
  components: {
    'el-col': Col,
    'el-row': Row,
    'el-card': Card,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-button': Button,
  },
  data() {
    return {
      username: '',
      password: '',
      signupError: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    ...mapActions([USER_LOGIN]),
    login() {
      this.$router.push({ path: '/login' })
    },
    signup() {
      if (this.username === '') {
        this.signupError.username = 'Username Required'
        return false
      } else if (this.password === '') {
        this.signupError.password = 'Password Required'
        return false
      }
      const data = {
        username: this.username,
        password: this.password,
        tag: 'viewer',
      }
      httpPost('/users', data).then((response) => {
        if (response.data.code === 0) {
          this.$router.push({ path: '/login' })
        } else {
          this.$message.error(response.data.message)
        }
      })
    },
  },

}
</script>


<style>
.signup-view {
  background-color: #181818;
  height: 100%;
}
.signup-view .signup-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.signup-view .el-card {
  background-color: #fff;
}
.signup-view .el-card__header {
  border-bottom: 1px solid #d1dbe5
}
.signup-view .el-input.error input {
  border: 2px solid #e0b4b4;
}
.signup-view .el-button {
  padding: 9px 25px;
}
</style>
