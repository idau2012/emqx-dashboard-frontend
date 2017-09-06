<template>
  <div class="metrics-view datas-view">
    <div class="page-title">Metrics</div>
    <el-row type="flex" justify="end" align="center">
      <el-select v-model="nodeName" :disabled="loading" placeholder="Select Node" size="small">
        <el-option
          v-for="item in nodes"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
    </el-row>


  </div>
</template>


<script>
import {
  Tabs, TabPane, Card, Col,
  TableColumn, Table,
  Button, Tag, Popover,
  Breadcrumb, BreadcrumbItem, Row, Input,
  Select, Pagination, Option,
} from 'element-ui'
import { httpGet } from '../store/api'


export default {
  name: 'metrics-view',
  components: {
    'el-col': Col,
    'el-card': Card,
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
  },
  data() {
    return {
      loading: false,
      nodeName: '',
      nodes: {},
      metrics: {
        packaets: [],
        messages: [],
        bytes: [],
      },
    }
  },
  created() {
    this.loadData()
  },
  watch: {
    $route: 'loadData',
  },
  methods: {
    loadData() {
      this.loading = true
      // load nodes
      httpGet('/management/nodes').then((response) => {
        this.nodes = {}
        // set default of select
        this.nodeName = response.data.result[0].name || ''
        this.nodes = response.data.result
        // load child with sync
        this.loading = false
        this.loadMetrics()
      })
    },
    loadMetrics() {
      if (!this.nodeName) {
        return
      }
      this.loading = true
      httpGet(`monitoring/metrics/${this.nodeName}`).then((response) => {
        console.log(response.data)
        this.loading = false
      })
    },
  },
}
</script>


<style>
.datas-view {
  padding-top: 20px;
}
.datas-view .box-card {
  margin-top: 20px;
}
.datas-view .el-breadcrumb {
  margin-top: 10px;
  margin-bottom: 20px;
}
.datas-view .page-title {
  padding: 10px 0;
}
.datas-view .el-row {
  margin-top: 20px;
}
.datas-view .el-input {
  width: 240px;
  margin-right: 8px;
}
.datas-view .el-input__inner {
  background-color: transparent;
  border-color: #5d5d60;
  color: #fff;
}
.datas-view .el-input__inner:focus {
  border-color: #a7a7a7;
}
.datas-view .el-input__inner::-webkit-input-placeholder {
  color: #a7a7a7;
}
.datas-view .el-input__inner::-moz-placeholder {
  color: #a7a7a7;
}
.datas-view .el-input__inner:-ms-input-placeholder {
  color: #a7a7a7;
}
.datas-view .el-input.is-disabled .el-input__inner {
  background-color: #292929;
  border-color: #ababab;
}
.datas-view .el-button.is-disabled.is-plain,
.el-button.is-disabled.is-plain:focus,
.el-button.is-disabled.is-plain:hover,
.el-button.is-disabled {
  background-color: #292929;
  border-color: #ababab;
}
</style>
