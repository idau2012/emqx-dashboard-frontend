<template>
  <div class="plugins-view">
    <!-- plugin list -->
    <div class="page-title" v-show="!plugin.nodeName">
      Plugins
      <div style="float: right">
        <el-select v-model="nodeName" placeholder="Select Node" size="small" @change="loadPlugins">
          <el-option
            v-for="item in nodes"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </div>
    </div>
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

    <!-- plugin config-->
    <div class="page-title" v-show="plugin.nodeName">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/plugins' }">{{ plugin.nodeName }}</el-breadcrumb-item>
        <el-breadcrumb-item class="plugin-name">{{ plugin.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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
            <el-form-item :label="item.key" v-if="record.hasOwnProperty(item.key)">
              <!--icon="plus" @click="setAdvancedOption(item)"-->
              <el-input
                        size="small" v-model="record[item.key]" style="width: 100%" :placeholder="item.desc"
                        v-if="item.value.length < 36 && record.hasOwnProperty(item.key) && isAutoIncrement(item.key)[0]">
              </el-input>

              <el-input size="small" v-model="record[item.key]" style="width: 100%" :placeholder="item.desc"
                        v-if="item.value.length < 36 && record.hasOwnProperty(item.key) && !isAutoIncrement(item.key)[0]">
              </el-input>

              <el-input size="small" type="textarea"
                :rows="2" :placeholder="item.desc" v-model="record[item.key]"
                v-if="item.value.length > 35 && record.hasOwnProperty(item.key)">
              </el-input>
            </el-form-item>
          </el-col>

          <!-- Advanced Keys-->
          <el-col :span="24" class="oper-block" style="margin-top: 20px">
            <el-button :plain="true" type="success" @click="putConfig(false)"
                       v-show="displayConfig !== ''"
                       @keyup.enter.native="putConfig(false)"
                       size="small" :disabled="!changeListener"
            >Confirm</el-button>
            <el-button :plain="true" @click="abortOperation(false)" class="cancel-btn"
                       @keyup.enter.native="abortOperation(false)"
                       size="small">
              <i class="el-icon-arrow-left" v-if="displayConfig === ''"></i>
              {{ displayConfig === '' ? 'Back' : 'Cancel' }}</el-button>
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
        <el-button type="success" @click="handleOperation(true, false)"
                   @keyup.enter.native="handleOperation(true, false)"
                   size="small">Confirm</el-button>
        <el-button @click="handleOperation(false, false)"
                   @keyup.enter.native="handleOperation(false, false)"
                   size="small">Cancel</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Advanced Config"
      :visible.sync="isAdvancedConfig"
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
    changeListener() {
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
    isAutoIncrement(item = '') {
      const key = item.split('$')
      if (key.length === 1) {
        return [false, null]
      }
      return [true]
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
          this.$message.success(`${row.active ? 'Stop' : 'Start'} success.`)
          this.loadPlugins()
        } else {
          this.$message.error(`${row.active ? 'Stop' : 'Start'} failure!`)
        }
      })
    },
    sortObject() {
      return (objFirst, objSecond) => {
        if (objFirst.value.length > objSecond.value.length) {
          return objFirst.value.length - objSecond.value.length
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
        // load & render pluginOption
        httpGet(`nodes/${this.plugin.nodeName}/plugin_configs/${this.plugin.name}`).then((response) => {
          this.plugin.option = response.data.result
          // sort & define
          this.plugin.option.sort(this.sortObject())
          this.plugin.option.forEach((item) => {
            if (item.key.indexOf('$') !== -1) {
              return
            }
            if (item.required) {
              /*
              if (item.value.length < 35) {
                recordList.unshift(item)
              } else {
                recordList.push(item)
              }
              */
              this.$set(this.record, item.key, item.value)
            } else {
              this.advancedConfig.push(item)
            }
          })
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
    // to config view
    config(row) {
      this.plugin.name = row.name
      this.plugin.desc = row.description
      this.$router.push({ path: `/plugins/${btoa(this.nodeName)}/${row.name}` })
    },
    putConfig(confirm = false) {
      if (confirm) {
        // check $
        /*
         如果是 value = " config1!#!config2!#!config3!#!config4!#!config5 "这种配置：
           ===> 使用正则匹配 $ <---> .  用于匹配 web.hook.$id.rule [占位符在中间]
                使用正则匹配 $ <---> \n 用于匹配 web.hook.rule.$id [占位符在后面]
          将其替换为 length = value.split('!#!').length 的自增序列 ;
         如： web.hook.rule.client.unsubscribe.$name 在发送之前将会被分解为
           web.hook.rule.client.unsubscribe.0 : config[0]
           web.hook.rule.client.unsubscribe.1 : config[1]
           web.hook.rule.client.unsubscribe.2 : config[2]
         但是下一次我查看返回的配置的时候，配置的key已经变成了 web.hook.rule.client.unsubscribe.[index]
         有好的显示方案？让用户知道这个index占领的占位符是 name 还是 password 或者其他？
        */
        // update the config
        // load pluginOption
        httpPut(`nodes/${this.plugin.nodeName}/plugin_configs/${this.plugin.name}`, this.record).then((response) => {
          if (response.data.code === 0) {
            this.$message.success('Config Success.')
            this.hashCode = JSON.stringify(this.record)
            this.$router.push({ path: '/plugins' })
          } else {
            this.$message.error('Config failure!')
          }
        })
      } else {
        // waiting the confirm
        this.notic = 'Are you sure you want to submit changes and apply them ?'
        this.oper = 'update'
        this.handleOperation(true)
      }
    },
    handleOperation(confirm = false, alert = true) {
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
          case 'cancel': this.abortOperation(true)
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
        this.handleOperation(true)
      }
    },
    abortOperation(confirm = false) {
      if (confirm) {
        this.$message({
          message: 'You have given up this change',
          type: 'warning',
        })
        this.hashCode = JSON.stringify(this.record)
        this.$router.push({ path: this.nextPath })
      } else if (this.hashCode !== JSON.stringify(this.record)) {
        this.notic = 'Are you sure you want to give up the change and exit?'
        this.oper = 'cancel'
        this.handleOperation(true)
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
      this.abortOperation()
    } else {
      next()
    }
  },
}
</script>


<style lang="scss">
.plugins-view {
  padding-top: 20px;
  .page-title {
    padding: 10px 0;
  }
  .el-row {
    margin-top: 20px;
  }
  .plugin-config {
    .el-form-item__label {
      color: #ddd;
    }
    .el-input.el-input--small {
      width: 100%;
    }
  }
  .el-table {
    margin-top: 60px;
  }
  .el-textarea__inner {
    background-color: transparent;
    border-color: #5d5d60;
    color: #ddd;
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
.plugins-view .el-input__inner,
.el-textarea__inner,
.el-button.el-button--text.el-button--samll {
  background-color: transparent;
  border-color: #5d5d60;
  color: #fff;
}
.plugins-view .el-button--success {
  &:hover, &:focus {
    background: #42d885;
    border-color: #42d885;
    color: #fff;
  }
}
.plugins-view .status:before {
  content: "";
  display: inline-block;
  height: 8px;
  width: 8px;
  margin-right: 3px;
  border-radius: 4px;
}
.plugins-view .stopped:before {
  background-color: #777777;
}
.plugins-view .running {
  color: #227D51;
}
.plugins-view .running:before {
  background-color: #227D51;
}
/* el-breadcrumb */
.plugins-view .el-breadcrumb {
  margin-bottom: 20px;
  .plugin-name {
    .el-breadcrumb__item__inner {
      color: #fff;
    }
  }
  font-size: 24px !important;
  .el-breadcrumb__item__inner {
    text-transform: none;
    color: #777777;
    &:hover {
      color: #fff;
    }
  }
}

/*.cancel-btn*/
.plugins-view .cancel-btn {
  &.el-button--small {
    border: none;
    color: #ddd !important;
    &:hover, &:focus {
      color: #ff6d6d !important;
    }
  }
}
/* oper-block */
.plugins-view .plugin-config .oper-block {
  .el-button--text {
    color: #ddd;
    &:hover {
      text-decoration: underline;
      color: #fff;
    }
  }
  .el-button {
    margin-right: 14px;
  }
  .el-button--small.is-plain.el-button--success {
    border-color: #227D51 !important;
    color: #227D51 !important;
    background-color: transparent;
    &:hover, &:focus {
      background: #42d885 !important;
      border-color: #42d885 !important;
      color: #fff !important;
    }
  }
}
/* Advanced Config DiaLog */
.plugins-view .advanced-key {
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
</style>
