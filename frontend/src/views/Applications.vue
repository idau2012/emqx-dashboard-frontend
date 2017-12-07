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
      <el-table-column prop="secret" :label="$t('app.secret')"></el-table-column>
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
        v-model="app.appId"
        :class="{ error: app.errors }"
        :placeholder="app.errors"
        @focus="app.errors=''">
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
        appId: '',
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
          appId: '',
          errors: '',
        }
        return
      }
      if (!this.app.appId) {
        this.app.errors = this.$t('app.errors')
        return
      }
      this.loading = true
      httpPost('/apps', { app_id: this.app.appId }).then(() => {
        this.$message.success(this.$t('success.createSuccess'))
        this.loading = false
        this.displayDialog = false
        this.loadApp()
      }).catch((error) => {
        this.loading = false
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
