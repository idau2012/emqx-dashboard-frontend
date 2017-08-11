<template>
  <div class="plugins-view">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/nodes' }">Nodes</el-breadcrumb-item>
      <el-breadcrumb-item>{{ nodeName }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page-title">Plugins</div>

    <el-table :data="tableData" v-loading="loading" border>
      <el-table-column prop="name" width="240" label="Name"></el-table-column>
      <el-table-column prop="version" width="100" label="Version"></el-table-column>
      <el-table-column prop="description" label="Description"></el-table-column>
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
import { Breadcrumb, BreadcrumbItem, Table, TableColumn, Button, Popover } from 'element-ui'
import { httpGet, httpPut } from '../store/api'

export default{
  name: 'plugins-view',
  components: {
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
      nodeName: '',
      popoverVisible: false,
      tableData: [],
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
        if (response.data.status === 'success') {
          this.$message.success(`${row.active ? 'Stop' : 'Start'} success`)
          this.loadData()
        } else {
          this.$message.success(`${row.active ? 'Stop' : 'Start'} failure`)
        }
      })
    },
    loadData() {
      this.loading = true
      this.nodeName = atob(this.$route.params.node)
      httpGet(`/nodes/${this.nodeName}/plugins`).then((response) => {
        this.tableData = response.data
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
.plugins-view .status:before {
  content: "";
  display: inline-block;
  height: 8px;
  width: 8px;
  margin-right: 3px;
  border-radius: 4px;
}
.plugins-view .running:before {
  background-color: #7cb342;
}
.plugins-view .stopped:before {
  background-color: #777777;
}
.plugins-view .running {
  color: #7cb342;
}
</style>
