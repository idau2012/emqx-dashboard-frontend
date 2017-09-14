<template>
  <div class="users-view">
    <div class="page-title">
      Users
      <div style="float: right">
        <el-button :plain="true" type="success" icon="plus" size="small"
                   @click="showDialog('new', {})">New user
        </el-button>
      </div>
    </div>

    <el-table :data="users" v-loading="loading" border>
      <el-table-column prop="username" label="Username"></el-table-column>
      <el-table-column prop="tags" label="Remark"></el-table-column>
      <el-table-column width="140" label="Oper">
        <template scope="props">
          <el-button size="mini" type="warning"
            @click="showDialog('edit', props.row)">Edit
          </el-button>
          <el-popover placement="right" :value="popoverVisible" ref="popoverDeleted">
            <p>Confirm delete？</p>
            <div style="text-align: right">
              <el-button size="mini" type="text" @click="hidePopover">Cancel</el-button>
              <el-button size="mini" type="success"
                :loading="btnLoading"
                v-on:click="deleteUser(props.row.username)"
              >Confirm</el-button>
            </div>
          </el-popover>
          <el-button size="mini" type="danger"
                     v-popover:popoverDeleted
                     v-if="props.row.username!=='admin'">Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="oper === 'new' ? 'New user' : 'Edit user'"
               @keyup.enter.native="save"
               v-model="dialogVisible">
      <label>Username</label>
      <el-input v-model="user.username"
        :disabled="oper==='edit'"
        :class="{ error: formError.username }"
        :placeholder="formError.username"
        @focus="formError.username=''"
      ></el-input>

      <label>Remark</label>
      <el-input v-model="user.tags"
                :class="{ error: formError.tags }"
                :placeholder="formError.tags"
                @focus="formError.tags=''"
      ></el-input>

      <div v-show="oper === 'new' || changePassword">
        <!--add password & edit.Oldpassword-->
        <label>{{ changePassword && oper === 'edit' ? 'Old Password' : 'Password' }}</label>
        <el-input v-model="user.password" type="password"
                  :class="{ error: formError.password }"
                  :placeholder="formError.password"
                  @focus="formError.password=''"
        ></el-input>
        <!--edit new password-->
        <label v-show="oper === 'edit'">New Password</label>
        <el-input v-show="oper === 'edit'" v-model="user.newPassword" type="password"
                  :class="{ error: formError.newPassword }"
                  :placeholder="formError.newPassword"
                  @focus="formError.newPassword=''"
        ></el-input>

        <!--add confirm password & edit.OldPassword-->
        <label>{{ oper === 'edit' && changePassword ? 'Confirm New Password' : 'Confirm Password' }}</label>
        <el-input v-model="user.repeatPassword" type="password"
                  :class="{ error: formError.repeatPassword }"
                  :placeholder="formError.repeatPassword"
                  @focus="formError.repeatPassword=''"
        ></el-input>
      </div>

      <el-button v-if="oper === 'edit'" class="toggle-btn" type="text" @click="changePassword = !changePassword">{{ changePassword ? 'Don\'t Change Password' : 'Change Password ?'}}</el-button>

      <span slot="footer" class="dialog-footer">
        <el-button icon="close" size="small" @click="dialogVisible=false" style="margin-right: 20px">Cancel</el-button>
        <el-button type="success" icon="check" size="small"
          :loading="btnLoading"
          @click="save">Save
        </el-button>
      </span>
    </el-dialog>

  </div>
</template>


<script>
import { Row, Button, Table, TableColumn, Popover, Dialog, Input } from 'element-ui'
import { mapActions } from 'vuex'

import { USER_LOGOUT } from '../store/mutation-types'
import { httpGet, httpPost, httpPut, httpDelete } from '../store/api'

export default {
  name: 'users-view',
  components: {
    'el-row': Row,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-popover': Popover,
    'el-dialog': Dialog,
    'el-input': Input,
  },
  data() {
    return {
      loading: false,
      btnLoading: false,
      changePassword: false,
      users: [],
      user: {
        username: '',
        password: '',
        repeatPassword: '',
        newPassword: '',
        tags: '',
      },
      formError: {
        username: '',
        password: '',
        repeatPassword: '',
        newPassword: '',
        tags: '',
      },
      popoverVisible: false,
      dialogVisible: false,
      oper: '', // 'new' or 'edit'
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapActions([USER_LOGOUT]),
    logout() {
      this.USER_LOGOUT()
      this.$router.push({ path: '/login' })
    },
    hidePopover() {
      this.popoverVisible = true
      setTimeout(() => {
        this.popoverVisible = false
      }, 0)
    },
    showDialog(oper, row) {
      this.formError = {
        username: '',
        password: '',
        repeatPassword: '',
        newPassword: '',
        tags: '',
      }
      this.user = {
        username: '',
        password: '',
        repeatPassword: '',
        newPassword: '',
        tags: 'viewer',
      }
      this.oper = oper
      this.changePassword = false
      if (oper === 'edit') {
        this.user = { ...row }
      }
      this.dialogVisible = true
    },
    loadData() {
      this.loading = true
      httpGet('/users').then((response) => {
        this.users = response.data.result
        this.loading = false
      })
    },
    save() {
      if (!this.user.username) {
        this.formError.username = 'Username required'
        return false
      }
      if (!this.user.tags) {
        this.formError.tags = 'Remark required'
        return false
      }
      // add new user
      if (this.oper === 'new') {
        if (!this.user.password) {
          this.formError.password = 'Password required'
          return false
        }
        if (this.user.password !== this.user.repeatPassword) {
          this.user.repeatPassword = ''
          this.user.password = ''
          this.formError.repeatPassword = 'Password is inconsistent'
          this.formError.password = 'Password is inconsistent'
          return false
        }
        this.btnLoading = true
        this.user.tag = this.user.tags
        httpPost('/users', this.user).then((response) => {
          if (response.data.code === 0) {
            this.$message.success('Create user success.')
            this.dialogVisible = false
            this.loadData()
          } else {
            this.$message.error(response.data.message)
          }
          this.btnLoading = false
        })
      } else {
        // edit
        // edit password
        if (this.changePassword) {
          if (!this.user.password) {
            this.formError.password = 'Old password required'
            return false
          }
          if (!this.user.newPassword) {
            this.formError.newPassword = 'New password required'
            return false
          }
          if (this.user.newPassword !== this.user.repeatPassword) {
            this.user.repeatPassword = ''
            this.user.newPassword = ''
            this.formError.repeatPassword = 'Password is inconsistent'
            this.formError.newPassword = 'Password is inconsistent'
            return false
          }
          // this.updateUser()
          // change password
          const chageUser = {
            old_pwd: this.user.password,
            new_pwd: this.user.newPassword,
          }
          this.btnLoading = true
          httpPut(`/change_pwd/${this.user.username}/`, chageUser).then((response) => {
            if (response.data.code === 0) {
              // old === now && user.now === edit.user, need't re authentication
              if (this.$store.state.user.username === this.user.username &&
              this.user.password !== this.user.newPassword) {
                this.$message.error('You have changed your password. Please re authenticate！')
                this.logout()
              } else {
                this.updateUser()
              }
            } else {
              this.$message.error(response.data.message)
            }
            this.btnLoading = false
          })
        } else {
          this.updateUser()
        }
        this.btnLoading = true
      }
    },
    deleteUser(username) {
      this.btnLoading = true
      httpDelete(`/users/${username}`).then((response) => {
        if (response.data.code === 0) {
          this.$message.success('Delete success!')
          this.loadData()
        } else {
          this.$message.error('Delete failure!')
        }
        this.btnLoading = false
        this.hidePopover()
      })
    },
    updateUser(changePassword = false) {
      this.btnLoading = true
      httpPut(`/users/${this.user.username}`, this.user).then((response) => {
        if (response.data.code === 0) {
          if (!changePassword) {
            this.$message.success('Edit success!')
          }
          this.dialogVisible = false
          this.loadData()
        } else if (!changePassword) {
          this.$message.error('Edit failure!')
        }
        this.btnLoading = false
      })
    },
  },
}
</script>


<style lang="scss">
.users-view {
  padding-top: 20px;
  .el-table {
    margin-top: 60px;
  }
}
.el-popover {
  .el-button--success {
    color: #fff;
    background-color: #13ce66;
    border-color: #13ce66;
  }
  .el-button--text {
    margin-right: 10px;
    border: none;
    color: #20a0ff;
    background: 0 0;
    padding-left: 0;
    padding-right: 0;
  }
}
.users-view .el-dialog {
  .el-input__inner {
    border: 1px solid #bfcbd9;
    background-color: transparent;
    color: #1f2d3d;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #eef1f6;
    border-color: #d1dbe5;
    color: #bbb;
    cursor: not-allowed;
  }
  .el-button--success.is-plain:focus {
    border-color: #a7a7a7;
  }
  .el-dialog__header {
    border-bottom: 1px solid #EFF2F7;
    padding: 15px 20px;
  }
  .el-dialog__footer {
    border-top: 1px solid #EFF2F7;
    padding: 15px 20px;
  }
}

.users-view .el-input {
  margin: 5px 0 20px;
}
.users-view .el-input.error input {
  border: 2px solid #e0b4b4;
}
.users-view .toggle-btn {
  color: #13ce66;
  &:hover {
    color: #42d885;
   }
}
</style>
