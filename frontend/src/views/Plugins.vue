<template>
  <div class="plugins-view">
    <div class="page-title" v-show="!plugin.nodeName">Plugins</div>

    <div class="page-title" v-show="plugin.nodeName">
      <el-breadcrumb separator="/" style="text-transform: none">
        <el-breadcrumb-item :to="{ path: '/plugins' }">{{ plugin.nodeName }}</el-breadcrumb-item>
        <el-breadcrumb-item class="plugin-name">{{ plugin.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-row type="flex" justify="end" align="center" v-if="!plugin.nodeName">
      <el-select v-model="nodeName" placeholder="Select Node" size="small" @change="loadPlugins">
        <el-option
          v-for="item in nodes"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
    </el-row>
    <el-table :data="tableData" v-loading="loading" border v-show="!plugin.nodeName">
      <el-table-column prop="name" width="240" label="Name"></el-table-column>
      <el-table-column prop="version" width="100" label="Version"></el-table-column>
      <el-table-column prop="description" label="Description" min-width="340"></el-table-column>
      <el-table-column
        prop="active"
        label="Status"
        width="120"
        :filters="[{ text: 'Stopped', value: false }, { text: 'Running', value: true }]"
        :filter-method="filterStatus">
        <template scope="props">
          <span v-bind:class="[props.row.active ? 'running' : 'stopped', 'status']">
            {{ props.row.active ? 'Running': 'Stopped'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="180" label="Oper">
        <template scope="props">
          <el-popover placement="right" :value="popoverVisible">
            <p>Confirm {{ props.row.active ? 'stop' : 'start' }} this plugin？</p>
            <div style="text-align: right">
              <el-button size="mini" type="text" @click="hidePopover">Cancel</el-button>
              <el-button size="mini" type="success" @click="update(props.row)">Confirm</el-button>
            </div>
            <el-button slot="reference" :type="props.row.active ? 'warning' : 'success'"
                       size="mini" :disabled="props.row.name === 'emq_dashboard'">
              {{ props.row.active ? 'Stop' : 'Start' }}
            </el-button>
          </el-popover>
          <el-button type="success" size="mini" @click="config(props.row)"
                     :disabled="props.row.name === 'emq_dashboard'">
            Config
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-card v-show="plugin.nodeName" style="margin-top: 32px" class="plugin-config" v-loading="loading">
      <div slot="header" class="config-dialog">
        <span>{{ plugin.name }}</span>
      </div>
      <el-row type="flex" justify="center">
        <el-col :span="24" v-if="displayConfig === ''" style="text-align: center; font-size: 16px">No Default Configuration</el-col>
      </el-row>
      <!--  Plugin Config -->
      <el-form label-position="top" v-loading="loading" @keyup.enter.native="putConfig(false)" :model="record" ref="record">
        <el-row :gutter="20">
          <el-col :lg="8" :md="12" :sm="12" v-for="item in plugin.option" :key="item.key">
            <el-form-item :label="item.key" v-if="record.hasOwnProperty(item.key)" :title="item.desc">

              <el-input size="small" v-model="record[item.key]" style="width: 100%" :placeholder="item.desc"
                        v-if="item.value.length < 36 && record.hasOwnProperty(item.key)">
              </el-input>

              <el-input
                size="small"
                type="textarea"
                :rows="2"
                :placeholder="item.desc"
                v-model="record[item.key]"
                v-if="item.value.length > 35 && record.hasOwnProperty(item.key)">
              </el-input>
            </el-form-item>
          </el-col>

          <!-- Advanced Keys-->
          <el-col :span="24" class="oper-block" style="margin-top: 20px">
            <el-button :plain="true" type="success" @click="putConfig(false)"
                       @keyup.enter.native="putConfig(false)"
                       size="small" :disabled="!needPutConfig"
            >Confirm</el-button>
            <el-button :plain="true" @click="cencelOper(false)" class="cancel-btn"
                       @keyup.enter.native="cencelOper(false)"
                       size="small">Cancel</el-button>
            <el-button :plain="true" title="More configuration" class="oper-btn" type="text"
                       v-if="advancedConfig.length !== 0"
                       @click="setAdvancedConfig(false)" size="small">Advanced Config</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- Advanced Config -->
    </el-card>

    <el-dialog
      title="Notice"
      :visible.sync="dialogVisible"
      size="tiny">
      <span>{{ notic }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleOper(true, false)"
                   @keyup.enter.native="handleOper(true, false)"
                   size="small">Confirm</el-button>
        <el-button @click="handleOper(false, false)"
                   @keyup.enter.native="handleOper(false, false)"
                   size="small">Cancel</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Advanced Config"
      @keyup.enter.native="setAdvancedConfig(true)"
      size="tiny">
     <el-row :gutter="20" type="flex" justify="left" class="advanced-key">
       <el-col :span="24">
         <label v-if="advancedConfig.length === 0">No Advanced Config</label>
         <el-checkbox-group v-model="selectedAdvancedConfig">
           <el-checkbox v-for="item in advancedConfig" :label="item"  :key="item.key">{{ item.key }}</el-checkbox>
         </el-checkbox-group>
       </el-col>
     </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="setAdvancedConfig(true)"
                   @keyup.enter.native="setAdvancedConfig(true)"
                   size="small">Add</el-button>
        <el-button @click="isAdvancedConfig = false"
                   @keyup.enter.native="isAdvancedConfig = false"
                   size="small">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import { Breadcrumb, BreadcrumbItem, Table,
  TableColumn, Select, Option, Row, Input, Checkbox, CheckboxGroup,
  Button, Popover, Dialog, Col, Form, FormItem, Card } from 'element-ui'

import { httpGet, httpPut } from '../store/api'
import { CURRENT_NODE } from '../store/mutation-types'

export default{
  name: 'plugins-view',
  components: {
    'el-checkbox': Checkbox,
    'el-checkbox-group': CheckboxGroup,
    'el-form-item': FormItem,
    'el-form': Form,
    'el-col': Col,
    'el-select': Select,
    'el-dialog': Dialog,
    'el-row': Row,
    'el-card': Card,
    'el-option': Option,
    'el-input': Input,
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-popover': Popover,
  },
  data() {
    return {
      notic: '',
      oper: '',
      nextPath: '/plugins',
      dialogVisible: false,
      loading: false,
      nodeName: '',
      popoverVisible: false,
      tableData: [],
      nodes: [],
      searchValue: '',
      record: {},
      hashCode: '',
      advancedConfig: [],
      isAdvancedConfig: false,
      selectedAdvancedConfig: [],
      plugin: {
        nodeName: '',
        name: '',
        desc: '',
        option: [],
      },
    }
  },
  created() {
    this.loadData()
  },
  computed: {
    displayConfig() {
      if (Object.keys(this.record).length !== 0) {
        return 'default'
      }
      return ''
    },
    needPutConfig() {
      return this.hashCode !== JSON.stringify(this.record)
    },
  },
  watch: {
    $route: 'loadData',
  },
  methods: {
    ...mapActions([CURRENT_NODE]),
    // set global nodeName
    setStore() {
      this.CURRENT_NODE({ nodeName: { current: this.nodeName } })
    },
    filterStatus(value, row) {
      return row.active === value
    },
    hidePopover() {
      this.popoverVisible = true
      setTimeout(() => {
        this.popoverVisible = false
      }, 0)
    },
    update(row) {
      this.hidePopover()
      this.loading = true
      const data = { active: !row.active }
      httpPut(`/nodes/${this.nodeName}/plugins/${row.name}`, data).then((response) => {
        this.loading = false
        if (response.data.code === 0) {
          this.$message.success(`${row.active ? 'Stop' : 'Start'} success`)
          this.loadPlugins()
        } else {
          this.$message.error(`${row.active ? 'Stop' : 'Start'} failure`)
        }
      })
    },
    sortObject() {
      return (objFir, objSec) => {
        if (objFir.value.length > objSec.value.length) {
          return 1
        }
        return 0
      }
    },
    loadData() {
      // To config plugins
      const nodeName = this.$route.params.nodeName
      this.selectedAdvancedConfig = []
      this.advancedConfig = []
      this.record = {}
      // nodeName in url
      if (nodeName) {
        // set nodeName to store
        this.setStore()
        this.plugin.nodeName = atob(nodeName)
        this.plugin.name = this.$route.params.pluginName
        this.clockStatus = true
        this.loading = true
        // load pluginOption
        httpGet(`nodes/${this.plugin.nodeName}/plugin_configs/${this.plugin.name}`).then((response) => {
          this.plugin.option = response.data.result
          // sort & define
          // this.plugin.option.sort(this.sortObject())
          const recordList = []
          this.plugin.option.forEach((item) => {
            if (item.key.indexOf('$') !== -1) {
              return
            }
            if (item.required) {
              if (item.value.length < 35) {
                recordList.unshift(item)
              } else {
                recordList.push(item)
              }
              console.log(item.value.length)
            } else {
              this.advancedConfig.push(item)
            }
          })
          recordList.forEach((item) => {
            this.$set(this.record, item.key, item.value)
          })
          console.log('advanced:', this.advancedConfig)
          // hashCode
          this.hashCode = JSON.stringify(this.record)
          this.loading = false
        })
      } else {
        // load with plugin page
        const currentNode = this.$store.state.nodeName.current
        this.loading = true
        httpGet('/management/nodes').then((response) => {
          this.nodes = []
          // set default of select
          this.nodeName = currentNode || response.data.result[0].name || ''
          this.nodes = response.data.result
          this.loading = false
          this.loadPlugins()
        })
        this.nodeName = this.plugin.nodeName
        this.plugin.nodeName = ''
      }
    },
    loadPlugins() {
      if (!this.nodeName) {
        return
      }
      this.loading = true
      this.searchValue = ''
      // set nodeName to store
      this.setStore()
      httpGet(`/nodes/${this.nodeName}/plugins`).then((response) => {
        this.tableData = response.data.result
        this.loading = false
      })
    },
    config(row) {
      this.plugin.name = row.name
      this.plugin.desc = row.description
      this.$router.push({ path: `/plugins/${btoa(this.nodeName)}/${row.name}` })
    },
    putConfig(confirm = false) {
      if (confirm) {
        // update the config
        // load pluginOption
        httpPut(`nodes/${this.plugin.nodeName}/plugin_configs/${this.plugin.name}`, this.record).then((response) => {
          if (response.data.code === 0) {
            this.$message.success('Config Success !')
            this.hashCode = JSON.stringify(this.record)
            this.$router.push({ path: '/plugins' })
          } else {
            this.$message.error('Config failure')
          }
        })
      } else {
        // waiting the confirm
        this.notic = 'Are you sure you want to submit changes and apply them ?'
        this.oper = 'update'
        this.handleOper(true)
      }
    },
    handleOper(confirm = false, alert = true) {
      // not ok
      if (!confirm) {
        this.dialogVisible = false
      } else if (alert) {
        this.dialogVisible = true
      } else {
        this.dialogVisible = false
        switch (this.oper) {
          case 'update': this.putConfig(true)
            break
          case 'default': this.resetDefault(true)
            break
          case 'cancel': this.cencelOper(true)
            break
          default: this.dialogVisible = false
        }
      }
    },
    resetDefault(confirm = false) {
      if (confirm) {
        this.plugin.option.forEach((item) => {
          this.$set(this.record, item.key, item.default[0])
        })
      } else {
        this.notic = 'Are you sure the reset configuration is the default?'
        this.oper = 'default'
        this.handleOper(true)
      }
    },
    cencelOper(confirm = false) {
      if (confirm) {
        this.$message({
          message: 'Your configure is not update',
          type: 'warning',
        })
        this.hashCode = JSON.stringify(this.record)
        this.$router.push({ path: this.nextPath })
      } else if (this.hashCode !== JSON.stringify(this.record)) {
        this.notic = 'Are you sure you want to give up the change and exit?'
        this.oper = 'cancel'
        this.handleOper(true)
      } else {
        this.$router.push({ path: '/plugins' })
      }
    },
    setAdvancedConfig(set = true) {
      if (set) {
        // remove
        this.plugin.option.forEach((item) => {
          if (!item.required) {
            this.$delete(this.record, item.key)
          }
        })
        // set
        this.selectedAdvancedConfig.forEach((item) => {
          console.log(item.key)
          this.$set(this.record, item.key, item.value)
        })
        this.isAdvancedConfig = false
      } else {
        this.isAdvancedConfig = true
      }
    },
  },
  // to modify protection
  beforeRouteLeave(to, from, next) {
    const isChange = this.hashCode !== JSON.stringify(this.record)
    if (this.plugin.nodeName && isChange) {
      this.nextPath = to.path
      this.cencelOper()
    } else {
      next()
    }
  },
}
</script>


<style lang="scss">
.plugins-view {
  padding-top: 20px;
}
.plugins-view .el-breadcrumb {
  margin-bottom: 20px;
}
.plugins-view .page-title {
  padding: 10px 0;
}
.plugins-view .el-row {
  margin-top: 20px;
}
.plugins-view .el-input {
  width: 240px;
}
.plugins-view .plugin-config .el-form-item__label {
  color: #ddd;
}
.plugins-view .el-input__inner, .el-textarea__inner, .el-button.el-button--text.el-button--samll {
  background-color: transparent;
  border-color: #5d5d60;
  color: #fff;
}
.plugins-view .plugin-config .el-select {
  width: 100%;
}
.plugins-view .plugin-config .el-input.el-input--small {
  width: 100%;
}
.plugins-view .el-input__inner:focus, .el-textarea__inner:focus {
  border-color: #a7a7a7;
}
.plugins-view .el-input__inner::-webkit-input-placeholder, .el-textarea__inner::-webkit-input-placeholder {
  color: #a7a7a7;
}
.plugins-view .el-input__inner::-moz-placeholder {
  color: #a7a7a7;
}
.plugins-view .el-input__inner:-ms-input-placeholder {
  color: #a7a7a7;
}
.plugins-view .status:before {
  content: "";
  display: inline-block;
  height: 8px;
  width: 8px;
  margin-right: 3px;
  border-radius: 4px;
}
.plugins-view .running:before {
  background-color: #227D51;
}
.plugins-view .el-breadcrumb {
  font-size: 24px !important;
}
.plugins-view .el-breadcrumb .el-breadcrumb__item__inner {
  color: #777777;
}
.plugins-view .plugin-name .el-breadcrumb__item__inner {
  color: #fff;
}
.plugins-view .el-breadcrumb .el-breadcrumb__item__inner:hover {
  color: #fff;
}
.plugins-view .cancel-btn.el-button--small {
  border: none;
  color: #ddd !important;
}
.plugins-view .cancel-btn.el-button--small:hover,
.plugins-view .cancel-btn.el-button--small:focus {
  color: #ff6d6d !important;
}
.plugins-view .stopped:before {
  background-color: #777777;
}
.plugins-view .running {
  color: #227D51;
}
.plugins-view .plugin-config .oper-block .el-button {
  margin-right: 14px;
}
.oper-block .el-button--text:hover {
  text-decoration: underline;
}
.oper-block .el-button--small.is-plain.el-button--success {
  /*margin-right: 60px !important;*/
  border-color: #227D51 !important;
  color: #227D51 !important;
}
.plugins-view .el-button--mini .is-disabled {
  background-color: red;
}
.plugins-view .el-button--mini.el-button--success:focus,
.el-button--mini.el-button--success:hover,
.oper-block .el-button--success:hover,
.oper-block .el-button--small.is-plain.el-button--success:hover
{
  background: #42d885 !important;
  border-color: #42d885 !important;
  color: #fff !important;
}
.plugins-view .el-checkbox {
  .el-checkbox__inner:hover {
    border-color: #42d885;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #42d885 !important;
    border-color: #42d885 !important;
  }
}
.plugins-view .advanced-key {
  .oper-btn:hover {
    text-decoration: underline;
  }
  .el-checkbox-group {
    .el-checkbox {
      &:first-child {
        margin-left: 15px;
      }
      margin-bottom: 10px;
      margin-top: 10px;
    }
  }
}
.plugins-view .el-button--mini.el-button--warning:focus, .el-button--mini.el-button--warning:hover {
  background: #f9c855 !important;
  border-color: #f9c855 !important;
  color: #fff !important;
}
</style>
