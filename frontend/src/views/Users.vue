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
      <el-table-column prop="email" label="Email"></el-table-column>
      <el-table-column prop="role" label="Role"></el-table-column>
      <el-table-column prop="remark" label="Remark"></el-table-column>
      <el-table-column prop="created_at" label="Created Time"></el-table-column>
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
      <label>Email:</label>
      <el-input v-model="user.email"
        :disabled="oper==='edit'"
        :class="{ error: formError.email }"
        :placeholder="formError.email"
        @focus="formError.email=''"
      ></el-input>
      <label>Password:</label>
      <el-input v-model="user.password" v-if="oper==='new'" type="password"
        :class="{ error: formError.password }"
        :placeholder="formError.password"
        @focus="formError.password=''"
      ></el-input>
      <label>Remark:</label>
      <el-input v-model="user.remark"></el-input>
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
import dateformat from 'dateformat'
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
      users: [],
      user: {
        username: '',
        password: '',
        email: '',
        remark: '',
      },
      formError: {
        username: '',
        password: '',
        email: '',
      },
      search_username: '',
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
      this.oper = oper
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
      // Needen't password with edit
      if (!this.user.username) {
        this.formError.username = 'Username required'
        return false
      } else if (!this.user.email) {
        this.formError.email = 'Email required'
        return false
      }
      if (this.oper === 'new') {
        if (!this.user.password) {
          this.formError.password = 'Password required'
          return false
        }
        this.btnLoading = true
        this.user.created_at = dateformat(new Date(), 'yyyy-mm-dd hh:MM:ss')
        this.user.role = 'viewer'
        httpPost('/users', this.user).then((response) => {
          if (response.data.result.status === 'success') {
            this.$message.success('Create user success!')
            this.dialogVisible = false
            this.loadData()
          } else if (response.data.result.status === 'failure') {
            this.$message.error(response.data.result.reason)
          } else {
            this.$message.error(response.data.result.reason)
            this.dialogVisible = false
          }
          this.btnLoading = false
        })
      } else {
        this.btnLoading = true
        httpPut(`/users/${this.user.username}`, this.user).then((response) => {
          if (response.data.result.status === 'success') {
            this.$message.success('Edit success!')
            this.loadData()
          } else {
            this.$message.error('Edit failure!')
          }
          this.dialogVisible = false
          this.btnLoading = false
        })
      }
    },
    deleteUser(username) {
      this.btnLoading = true
      httpDelete(`/users/${username}`).then((response) => {
        if (response.data.result.status === 'success') {
          this.$message.success('Delete success!')
          this.loadData()
        } else {
          this.$message.error('Delete failure!')
        }
        this.btnLoading = false
        this.hidePopover()
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
