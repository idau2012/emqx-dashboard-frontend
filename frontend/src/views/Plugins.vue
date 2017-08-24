<template>
  <div class="plugins-view">
    <div class="page-title">Plugins</div>

    <el-row type="flex" justify="end" align="center">
      <el-select v-model="nodeName" placeholder="Select Node" size="small" @change="loadPlugins">
        <el-option
          v-for="item in nodes"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <el-input v-model="searchValue" placeholder="Plugin" size="small"></el-input>
      <el-button :plain="true" type="success" icon="search" size="small"
                 @click="searchPlugins">Search
      </el-button>
    </el-row>
    <el-table :data="tableData" v-loading="loading" border>
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
      <el-table-column width="100" label="Oper">
        <template scope="props">
          <el-popover placement="right" :value="popoverVisible">
            <p>Confirm {{ props.row.active ? 'stop' : 'start' }} this plugin？</p>
            <div style="text-align: right">
              <el-button size="mini" type="text" @click="hidePopover">Cancel</el-button>
              <el-button size="mini" type="success" @click="update(props.row)">Confirm</el-button>
            </div>
            <el-button slot="reference" :type="props.row.active ? 'warning' : 'success'" size="mini">
              {{ props.row.active ? 'Stop' : 'Start' }}
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>


<script>
import { Breadcrumb, BreadcrumbItem, Table,
  TableColumn, Select, Option, Row, Input,
  Button, Popover } from 'element-ui'
import { httpGet, httpPut } from '../store/api'

export default{
  name: 'plugins-view',
  components: {
    'el-select': Select,
    'el-row': Row,
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
      loading: false,
      nodeName: 'no data',
      popoverVisible: false,
      tableData: [],
      nodes: [],
      searchValue: '',
    }
  },
  created() {
    this.loadData()
  },
  methods: {
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
    loadData() {
      this.loading = true
      httpGet('/management/nodes').then((response) => {
        this.nodes = {}
        // set default of select
        this.nodeName = response.data.result[0].name || ''
        this.nodes = response.data.result
        this.loading = false
        this.loadPlugins()
      })
    },
    loadPlugins() {
      if (!this.nodeName) {
        return
      }
      this.loading = true
      this.searchValue = ''
      httpGet(`/nodes/${this.nodeName}/plugins`).then((response) => {
        this.tableData = response.data.result
        this.loading = false
      })
    },
    searchPlugins() {
      if (!this.nodeName) {
        this.$message.error('Node requires')
        return
      }
      if (!this.searchValue) {
        this.$message.error('Plugin required')
        return
      }
      httpGet(`/nodes/${this.nodeName}/plugins/${this.searchValue}`).then((response) => {
        if (!response.data.result) {
          this.$message.error('This plugin is not exist')
        } else {
          this.tableData = response.data.result
        }
        this.loading = false
      })
    },
  },
}
</script>


<style>
.plugins-view {
  padding-top: 20px;
}
.plugins-view .el-breadcrumb {
  margin-top: 10px;
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
  margin-right: 8px;
}
.plugins-view .el-input__inner {
  background-color: transparent;
  border-color: #5d5d60;
  color: #fff;
}
.plugins-view .el-input__inner:focus {
  border-color: #a7a7a7;
}
.plugins-view .el-input__inner::-webkit-input-placeholder {
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
.plugins-view .stopped:before {
  background-color: #777777;
}
.plugins-view .running {
  color: #227D51;
}
.plugins-view .el-button--mini.el-button--success:focus, .el-button--mini.el-button--success:hover {
  background: #42d885 !important;
  border-color: #42d885 !important;
  color: #fff !important;
}
.plugins-view .el-button--mini.el-button--warning:focus, .el-button--mini.el-button--warning:hover {
  background: #f9c855 !important;
  border-color: #f9c855 !important;
  color: #fff !important;
}
</style>
