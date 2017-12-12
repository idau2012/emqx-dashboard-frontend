<template>
  <div class="applications-view">
    <div class="page-title">
      {{ $t('leftbar.applications') }}
      <div style="float: right">
        <el-button class="add-btn" icon="plus" size="small" @click="createApp(true)">
          {{ $t('app.newApp') }}
        </el-button>
      </div>
    </div>

    <!-- applications list -->
    <el-table v-loading="loading" border :data="tableData">
      <el-table-column prop="app_id" :label="$t('app.appId')"></el-table-column>
      <el-table-column prop="name" :label="$t('app.name')"></el-table-column>
      <el-table-column prop="desc" :label="$t('app.desc')"></el-table-column>
      <el-table-column :label="$t('app.secret')">
        <template scope="props">
          {{ props.row.secret }}
          <el-button
            v-if="!props.row.secret"
            type="success"
            size="mini"
            :plain="true"
            @click="viewSecret(props.row)">{{ $t('oper.view') }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column width="120px" :label="$t('oper.oper')">
        <template scope="props">
          <el-button
            size="mini"
            type="danger"
            v-popover:popoverDeleted
            :plain="true">
            <el-popover ref="popoverDeleted" placement="right" trigger="click" :value="popoverVisible">
              <p>{{ $t('oper.confirmDelete') }}</p>
              <div style="text-align: right">
                <el-button
                  size="mini"
                  type="text"
                  @click="hidePopover">
                  {{ $t('oper.cancel') }}
                </el-button>
                <el-button
                  size="mini"
                  type="success"
                  :loading="loading"
                  @click="deleteApp(props.row)">
                  {{ $t('oper.confirm') }}
                </el-button>
              </div>
            </el-popover>
            {{ $t('oper.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog
      class="oper-panel"
      v-model="displayDialog"
      :title="$t('app.newApp')">
      <label>{{ $t('app.appId') }}</label>
      <el-input
        v-model="app.app_id"
        :class="{ error: app.errors }"
        :placeholder="app.errors">
      </el-input>

      <label>{{ $t('app.name') }}</label>
      <el-input
        v-model="app.name">
      </el-input>

      <label>{{ $t('app.desc') }}</label>
      <el-input v-model="app.desc">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="text"
          @click="displayDialog = false">
          {{ $t('oper.cancel') }}
        </el-button>
        <el-button
          type="success"
          size="small"
          :loading="loading"
          @click="createApp(false)">
          {{ $t('oper.create') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import {
  Tabs, TabPane, TableColumn, Table, Button, Tag, Popover, Breadcrumb, BreadcrumbItem,
  Row, Input, Select, Pagination, Option, Col, Dialog, Form, FormItem,
} from 'element-ui'

import { httpGet, httpPost, httpDelete } from '@/store/api'

export default {
  name: 'applications-view',
  components: {
    'el-col': Col,
    'el-select': Select,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-tag': Tag,
    'el-popover': Popover,
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
    'el-row': Row,
    'el-input': Input,
    'el-pagination': Pagination,
    'el-option': Option,
    'el-dialog': Dialog,
    'el-form': Form,
    'el-form-item': FormItem,
  },
  data() {
    return {
      tableData: [],
      displayDialog: false,
      loading: false,
      app: {
        app_id: '',
        name: '',
        desc: '',
        errors: '',
      },
      popoverVisible: false,
    }
  },
  methods: {
    loadApp() {
      this.loading = true
      httpGet('/apps').then((response) => {
        this.loading = false
        this.tableData = response.data
      }).catch((error) => {
        this.loading = false
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    createApp(startCreate = false) {
      if (startCreate) {
        this.displayDialog = true
        this.app = {
          app_id: '',
          name: '',
          desc: '',
          errors: '',
        }
        return
      }
      if (!this.app.app_id) {
        this.app.errors = this.$t('app.errors')
        return
      }
      httpPost('/apps', this.app).then(() => {
        this.$message.success(this.$t('success.createSuccess'))
        this.displayDialog = false
        this.loadApp()
      }).catch((error) => {
        this.app.appId = ''
        this.app.errors = error || this.$t('error.networkError')
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    deleteApp(row) {
      this.loading = false
      httpDelete(`/apps/${row.app_id}`).then(() => {
        this.loading = false
        this.loadApp()
      }).catch((error) => {
        this.loading = false
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    hidePopover() {
      this.popoverVisible = true
      setTimeout(() => {
        this.popoverVisible = false
      }, 0)
    },
    viewSecret(row) {
      httpGet(`/apps/${row.app_id}`).then((response) => {
        this.$set(row, 'secret', response.data.secret)
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
  },
  created() {
    this.loadApp()
  },
}
</script>


<style lang="scss">
.applications-view {
  .el-table {
    margin-top: 24px;
  }
  .el-row {
    margin-top: 20px;
  }
  .search-btn {
    margin-left: 8px
  }
  .el-breadcrumb {
    margin-top: 10px;
    margin-bottom: 20px;
  }
}
</style>
