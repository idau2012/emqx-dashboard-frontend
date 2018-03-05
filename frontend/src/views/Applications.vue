<template>
  <div class="applications-view">
    <div class="page-title">
      {{ $t('leftbar.applications') }}
      <div style="float: right">
        <el-button
          class="add-btn"
          icon="plus"
          size="small"
          :disable="loading"
          @click="createApp(true)">
          {{ $t('app.newApp') }}
        </el-button>
      </div>
    </div>

    <!-- applications list -->
    <el-table v-loading="loading" border :data="tableData">
      <el-table-column prop="app_id" min-width="90px" :label="$t('app.appId')"></el-table-column>
      <el-table-column prop="name" min-width="100px" :label="$t('app.name')"></el-table-column>
      <el-table-column prop="expired" min-width="120px" :label="$t('app.expired')">
        <template scope="props">
          {{ dateFormat(props.row.expired) }}
        </template>
      </el-table-column>
      <el-table-column prop="desc" min-width="90px" :label="$t('app.desc')"></el-table-column>
      <el-table-column :label="$t('app.status')">
        <template scope="props">
          <el-tooltip
            :content="props.row.status ? $t('app.enableText') : $t('app.disableText')"
            placement="left">
            <el-switch
              v-model="props.row.status"
              on-text=""
              off-text=""
              on-color="#13ce66"
              off-color="#ff4949"
              @change="updateApp(props.row, true, true)">
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="180px" :label="$t('oper.oper')">
        <template scope="props">
          <!-- view -->
          <el-button type="success" size="mini" :plain="true" @click="showApp(props.row)">
            {{ $t('oper.view') }}
          </el-button>

          <!-- edit -->
          <el-button type="success" size="mini" :plain="true" @click="updateApp(props.row, false)">
            {{ $t('oper.edit') }}
          </el-button>

          <!-- delete -->
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
                  :loading="btnLoading"
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
      :title="$t(`app.${oper}App`)">
      <!-- appId -->
      <label>{{ $t('app.appId') }}</label>
      <el-input
        v-model="app.app_id"
        :class="{ error: app.appIdErrors }"
        :disabled="['view', 'edit'].includes(oper)"
        :placeholder="app.appIdErrors"
        @focus="app.appIdErrors = ''">
      </el-input>

      <!-- secret -->
      <div v-if="oper === 'view'">
        <label>{{ $t('app.secret') }}</label>
        <el-input v-model="app.secret" :disabled="['view', 'edit'].includes(oper)">
        </el-input>
      </div>

      <!-- name -->
      <label>{{ $t('app.name') }}</label>
      <el-input
        v-model="app.name"
        :disabled="oper === 'view'"
        :class="{ error: app.appNameErrors }"
        :placeholder="app.appNameErrors"
        @focus="app.appNameErrors = ''"></el-input>

      <!-- desc -->
      <label>{{ $t('app.desc') }}</label>
      <el-input v-model="app.desc" :disabled="oper === 'view'"></el-input>

      <!-- status -->
      <label>{{ $t('app.status') }}</label>
      <el-select v-model="app.status" :disabled="oper === 'view'">
        <el-option :label="$t('app.enable')" :value="true"></el-option>
        <el-option :label="$t('app.disable')" :value="false"></el-option>
      </el-select>

      <!-- expired -->
      <label>{{ $t('app.expired') }}</label>
      <el-date-picker
        v-model="app.expired"
        :picker-options="pickerDisable"
        :placeholder="$t('app.expiredText')"
        :disabled="oper === 'view'">
      </el-date-picker>

      <span v-if="oper !== 'view'" slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="text"
          @click="displayDialog = false">
          {{ $t('oper.cancel') }}
        </el-button>
        <el-button
          type="success"
          size="small"
          :loading="btnLoading"
          :disabled="btnLoading"
          @click="createApp(false)">
          {{ $t('oper.save') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import {
  Dialog, Input, Switch, Select, Option, Button,
  Table, TableColumn, DatePicker, Popover, Tooltip,
} from 'element-ui'
import dateformat from 'dateformat'

import { httpGet, httpPost, httpPut, httpDelete } from '@/store/api'

export default {
  name: 'applications-view',
  components: {
    'el-dialog': Dialog,
    'el-input': Input,
    'el-switch': Switch,
    'el-select': Select,
    'el-option': Option,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-date-picker': DatePicker,
    'el-popover': Popover,
    'el-tooltip': Tooltip,
  },
  data() {
    return {
      tableData: [],
      displayDialog: false,
      oper: 'new',
      loading: false,
      btnLoading: false,
      app: {
        app_id: '',
        name: '',
        desc: '',
        secret: '',
        expired: '',
        status: true,
        appIdErrors: '',
        appNameErrors: '',
      },
      popoverVisible: false,
      pickerDisable: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
      },
    }
  },
  computed: {
    dateAdept() {
      const data = { ...this.app }
      try {
        if (!data.expired) {
          data.expired = 'undefined'
        } else if (data.expired.toString().length === 13) {
          // ms
          data.expired = Math.floor(data.expired / 1000)
        } else if (data.expired.toString().length !== 10) {
          // date
          data.expired = Date.parse(new Date(data.expired))
          data.expired = Math.floor(data.expired / 1000)
        }
      } catch (e) {
        data.expired = 'undefined'
      }
      return data
    },
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
        this.oper = 'new'
        this.displayDialog = true
        this.app = {
          app_id: Math.random().toString(36).substr(2),
          name: '',
          desc: '',
          secret: '',
          expired: '',
          status: true,
          appIdErrors: '',
          appNameErrors: '',
        }
        return
      }
      if (this.oper === 'edit') {
        this.updateApp(this.app)
        return
      }
      if (!this.app.app_id || !this.app.name) {
        this.app.appIdErrors = this.app.app_id ? '' : this.$t('app.errors')
        this.app.appNameErrors = this.app.name ? '' : this.$t('app.errors')
        return
      }
      this.btnLoading = true
      httpPost('/apps', this.dateAdept).then(() => {
        this.$message.success(this.$t('success.createSuccess'))
        this.displayDialog = false
        this.btnLoading = false
        this.loadApp()
      }).catch((error) => {
        this.app.appId = ''
        this.app.appIdErrors = error || this.$t('error.networkError')
        this.$message.error(error || this.$t('error.networkError'))
        this.btnLoading = false
      })
    },
    deleteApp(row) {
      this.btnLoading = true
      httpDelete(`/apps/${row.app_id}`).then(() => {
        this.btnLoading = false
        this.hidePopover()
        this.loadApp()
      }).catch((error) => {
        this.btnLoading = false
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    showApp(row) {
      httpGet(`/apps/${row.app_id}`).then((response) => {
        this.displayDialog = true
        this.oper = 'view'
        this.app = response.data
        this.app.expired = this.app.expired * 1000 || ''
      }).catch((error) => {
        this.displayDialog = false
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    updateApp(row, submit = true, toggle = false) {
      this.app = { ...row }
      this.btnLoading = false
      if (!submit) {
        this.oper = 'edit'
        this.app.expired = this.app.expired * 1000 || ''
        this.displayDialog = true
        return
      }
      if (!this.app.name) {
        this.app.appNameErrors = this.$t('app.errors')
        return
      }
      this.btnLoading = true
      httpPut(`/apps/${row.app_id}`, this.dateAdept).then(() => {
        this.btnLoading = false
        this.$message.success(this.$t('oper.editSuccess'))
        this.displayDialog = false
        if (!toggle) {
          this.loadApp()
        }
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
        this.displayDialog = false
        this.btnLoading = false
        this.loadApp()
      })
    },
    hidePopover() {
      this.popoverVisible = true
      setTimeout(() => {
        this.popoverVisible = false
      }, 0)
    },
    dateFormat(date) {
      try {
        return date.toString().length === 10
          ? dateformat(date * 1000, 'yyyy-mm-dd')
          : this.$t('app.expiredText')
      } catch (e) {
        return this.$t('app.expiredText')
      }
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
  .el-date-picker {
    max-width: 600px !important;
  }
}
</style>
