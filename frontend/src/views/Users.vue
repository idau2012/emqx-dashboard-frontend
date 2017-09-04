<template>
  <div class="users-view">
    <div class="page-title">Users</div>
    <el-row type="flex" justify="end" align="middle">
      <el-button :plain="true" type="success" icon="plus" size="small"
        @click="showDialog('new', {})">New user
      </el-button>
    </el-row>

    <el-table :data="users" v-loading="loading" border>
      <el-table-column prop="username" label="Username"></el-table-column>
      <el-table-column prop="tags" label="Remark"></el-table-column>
      <el-table-column width="140" label="Oper">
        <template scope="props">
          <el-button size="mini" type="warning"
            @click="showDialog('edit', props.row)">Edit
          </el-button>
          <el-popover placement="right" :value="popoverVisible">
            <p>Confirm delete？</p>
            <div style="text-align: right">
              <el-button size="mini" type="text" @click="hidePopover">Cancel</el-button>
              <el-button size="mini" type="success"
                :loading="btnLoading"
                v-on:click="deleteUser(props.row.username)"
              >Confirm</el-button>
            </div>
            <el-button slot="reference" size="mini" type="danger"
              v-if="props.row.username!=='admin'">Delete
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="oper === 'new' ? 'New user' : 'Edit user'" v-model="dialogVisible">
      <label>Username:</label>
      <el-input v-model="user.username"
        :disabled="oper==='edit'"
        :class="{ error: formError.username }"
        :placeholder="formError.username"
        @focus="formError.username=''"
      ></el-input>

      <label>Remark:</label>
      <el-input v-model="user.tag"
                :class="{ error: formError.tag }"
                :placeholder="formError.tag"
                @focus="formError.tag=''"
      ></el-input>

      <div v-show="oper === 'new' || changePassword">
        <!--add password & edit.Oldpassword-->
        <label>{{ changePassword && oper === 'edit' ? 'Old Password:' : 'Password:' }}</label>
        <el-input v-model="user.password" type="password"
                  :class="{ error: formError.password }"
                  :placeholder="formError.password"
                  @focus="formError.password=''"
        ></el-input>
        <!--edit new password-->
        <label v-show="oper === 'edit'">New Password:</label>
        <el-input v-show="oper === 'edit'" v-model="user.newPassword" type="password"
                  :class="{ error: formError.newPassword }"
                  :placeholder="formError.newPassword"
                  @focus="formError.newPassword=''"
        ></el-input>

        <!--add confirm password & edit.OldPassword-->
        <label>{{ oper === 'edit' && changePassword ? 'Confirm New Password:' : 'Confirm Password:' }}</label>
        <el-input v-model="user.repeatPassword" type="password"
                  :class="{ error: formError.repeatPassword }"
                  :placeholder="formError.repeatPassword"
                  @focus="formError.repeatPassword=''"
        ></el-input>
      </div>

      <el-button v-if="oper === 'edit'" type="text" @click="changePassword = !changePassword">{{ changePassword ? 'Don\'t Change Password' : 'Change Password ?'}}</el-button>

      <span slot="footer" class="dialog-footer">
        <el-button icon="close" size="small" @click="dialogVisible=false">Cancel</el-button>
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
        tag: '',
      },
      formError: {
        username: '',
        password: '',
        repeatPassword: '',
        newPassword: '',
        tag: '',
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
        tag: '',
      }
      this.user = {
        username: '',
        password: '',
        repeatPassword: '',
        newPassword: '',
        tag: 'viewer',
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
      if (!this.user.tag) {
        this.formError.tag = 'Remark required'
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
        this.user.tags = 'viewer'
        httpPost('/users', this.user).then((response) => {
          if (response.data.code === 0) {
            this.$message.success('Create user success!')
            this.dialogVisible = false
            this.loadData()
          } else {
            this.$message.error(response.data.message)
          }
          this.btnLoading = false
        })
      } else {
        // edit
        // edit pwd
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
          // change password
          const chageUser = {
            old_pwd: this.user.password,
            new_pwd: this.user.newPassword,
          }
          this.btnLoading = true
          httpPut(`/change_pwd/${this.user.username}/`, chageUser).then((response) => {
            if (response.data.code === 0) {
              this.updateUser()
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
    updateUser() {
      this.btnLoading = true
      httpPut(`/users/${this.user.username}`, this.user).then((response) => {
        if (response.data.code === 0) {
          this.$message.success('Edit success!')
          this.dialogVisible = false
          this.loadData()
        } else {
          this.$message.error('Edit failure!')
        }
        this.btnLoading = false
      })
    },
  },
}
</script>


<style>
.users-view .el-dialog__header {
  border-bottom: 1px solid #EFF2F7;
  padding: 15px 20px;
}
.users-view .el-dialog__footer {
  border-top: 1px solid #EFF2F7;
  padding: 15px 20px;
}
.users-view .el-input {
  margin: 5px 0 20px;
}
.users-view .el-input.error input {
  border-color: #E0B4B4;
  border-width: 2px;
}
.users-view .el-button--danger.el-button--mini:hover {
  background-color: #ff6d6d;
  border-color: #ff6d6d;
  color: #ffffff;
}
.users-view .el-button--warning.el-button--mini:hover {
  background-color: #f9c855;
  border-color: #f9c855;
  color: #fff;
}
</style>
