<template>
  <div class="listeners-view">
    <div class="page-title">Listeners</div>


    <el-row type="flex" justify="end" align="center">
      <el-select v-model="nodeName" placeholder="Select Node" size="small" @change="loadListeners">
        <el-option
          v-for="item in nodes"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
    </el-row>

    <el-table :data="listeners" v-loading="loading" border>
      <el-table-column prop="protocol" width="240" label="Protocol"></el-table-column>
      <el-table-column prop="listen" min-width="240" label="Listen On"></el-table-column>
      <el-table-column prop="max_clients" min-width="180" label="Max Clients"></el-table-column>
      <el-table-column prop="current_clients" label="Current Clients" min-width="120"></el-table-column>
      <!--
      <el-table-column prop="description" label="Oper" min-width="340"></el-table-column>
      -->
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


<style>
  .listeners-view {
    padding-top: 20px;
  }
  .listeners-view .el-breadcrumb {
    margin-bottom: 20px;
  }
  .listeners-view .page-title {
    padding: 10px 0;
  }
  .listeners-view .el-row {
    margin-top: 20px;
  }
  .listeners-view .el-input {
    width: 240px;
  }
  .listeners-view .plugin-config .el-form-item__label {
    color: #ddd;
  }
  .listeners-view .el-input__inner, .el-textarea__inner, .el-button.el-button--text.el-button--samll {
    background-color: transparent;
    border-color: #5d5d60;
    color: #fff;
  }
  .listeners-view .plugin-config .el-select {
    width: 100%;
  }
  .listeners-view .plugin-config .el-input.el-input--small {
    width: 100%;
  }
  .listeners-view .el-input__inner:focus, .el-textarea__inner:focus {
    border-color: #a7a7a7;
  }
  .listeners-view .el-input__inner::-webkit-input-placeholder, .el-textarea__inner::-webkit-input-placeholder {
    color: #a7a7a7;
  }
  .listeners-view .el-input__inner::-moz-placeholder {
    color: #a7a7a7;
  }
  .listeners-view .el-input__inner:-ms-input-placeholder {
    color: #a7a7a7;
  }
  .listeners-view .status:before {
    content: "";
    display: inline-block;
    height: 8px;
    width: 8px;
    margin-right: 3px;
    border-radius: 4px;
  }
  .listeners-view .running:before {
    background-color: #227D51;
  }
  .listeners-view .el-breadcrumb {
    font-size: 24px !important;
  }
  .listeners-view .el-breadcrumb .el-breadcrumb__item__inner {
    color: #777777;
  }
  .listeners-view .plugin-name .el-breadcrumb__item__inner {
    color: #fff;
  }
  .listeners-view .el-breadcrumb .el-breadcrumb__item__inner:hover {
    color: #fff;
  }
  .listeners-view .cancel-btn.el-button--small {
    border: none;
    color: #ddd !important;
  }
  .listeners-view .cancel-btn.el-button--small:hover,
  .listeners-view .cancel-btn.el-button--small:focus {
    border: 1px solid #ddd;
    color: #fff !important;
  }
  .listeners-view .stopped:before {
    background-color: #777777;
  }
  .listeners-view .running {
    color: #227D51;
  }
  .listeners-view .plugin-config .oper-block .el-button {
    margin-right: 14px;
  }
  .oper-block .el-button--text:hover {
    text-decoration: underline;
  }
  .oper-block .el-button--small.is-plain.el-button--success {
    border-color: #227D51 !important;
    color: #227D51 !important;
  }
  .listeners-view .el-button--mini.el-button--success:focus,
  .el-button--mini.el-button--success:hover,
  .oper-block .el-button--success:hover,
  .oper-block .el-button--small.is-plain.el-button--success:hover
  {
    background: #42d885 !important;
    border-color: #42d885 !important;
    color: #fff !important;
  }
  .listeners-view .el-button--mini.el-button--warning:focus, .el-button--mini.el-button--warning:hover {
    background: #f9c855 !important;
    border-color: #f9c855 !important;
    color: #fff !important;
  }
</style>
