<template>
  <div class="listeners-view">
    <div class="page-title">
      Listeners
      <div style="float: right">
        <el-select v-model="nodeName" placeholder="Select Node" size="small" @change="loadListeners">
          <el-option
            v-for="item in nodes"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </div>
    </div>

    <el-table :data="listeners" v-loading="loading" border>
      <el-table-column prop="protocol" width="240" label="Protocol"></el-table-column>
      <el-table-column prop="listen" min-width="240" label="Listen On"></el-table-column>
      <el-table-column prop="max_clients" min-width="180" label="Max Clients"></el-table-column>
      <el-table-column prop="current_clients" label="Current Clients" min-width="120"></el-table-column>
    </el-table>

  </div>
</template>


<script>
  import { mapActions } from 'vuex'
  import { Breadcrumb, BreadcrumbItem, Table,
    TableColumn, Select, Option, Row, Input,
    Button, Popover, Dialog, Col, Form, FormItem, Card } from 'element-ui'

  import { httpGet } from '../store/api'
  import { CURRENT_NODE } from '../store/mutation-types'

  export default{
    name: 'listeners-view',
    components: {
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
        loading: false,
        nodeName: '',
        nodes: [],
        listeners: [],
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      ...mapActions([CURRENT_NODE]),
      // set global nodeName
      setStore() {
        this.CURRENT_NODE({ nodeName: { current: this.nodeName } })
      },
      loadData() {
        const currentNode = this.$store.state.nodeName.current
        httpGet('/management/nodes').then((response) => {
          // set default of select
          this.nodeName = currentNode || response.data.result[0].name || ''
          this.setStore()
          // could select
          this.nodes = response.data.result
          this.loadListeners()
        })
      },
      // load listener
      loadListeners() {
        this.setStore()
        this.loading = true
        httpGet(`/monitoring/listeners/${this.nodeName}`).then((response) => {
          this.listeners = response.data.result
          this.loading = false
        })
      },
    },
  }
</script>


<style lang="scss">
  .listeners-view {
    padding-top: 20px;
    .page-title {
      padding: 10px 0;
    }
    .el-row {
      margin-top: 20px;
    }
    .el-table {
      margin-top: 60px;
    }
  }
</style>
