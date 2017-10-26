<template>
  <div class="listeners-view">
    <div class="page-title">
      {{ $t('leftbar.listeners') }}
      <el-select
        class="select-radius"
        v-model="nodeName"
        placeholder="Select Node"
        size="small"
        style="float: right"
        :disabled="loading"
        @change="loadListeners">
        <el-option
          v-for="item in nodes"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
    </div>
    <el-table v-loading="loading" border :data="listeners">
      <el-table-column prop="protocol" width="240" :label="$t('listeners.protocol')">
      </el-table-column>
      <el-table-column prop="listen" min-width="240" :label="$t('listeners.listenOn')">
      </el-table-column>
      <el-table-column prop="max_clients" min-width="180" :label="$t('listeners.maxClients')">
      </el-table-column>
      <el-table-column prop="current_clients" min-width="120" :label="$t('listeners.currentClients')">
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
  import { mapActions } from 'vuex'
  import {
    Breadcrumb, BreadcrumbItem, Table, TableColumn, Select, Option, Row, Input,
    Button, Popover, Dialog, Col, Form, FormItem, Card,
  } from 'element-ui';

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
    methods: {
      ...mapActions([CURRENT_NODE]),
      // set global nodeName
      stashNode() {
        this.CURRENT_NODE({ nodeName: this.nodeName })
      },
      loadData() {
        httpGet('/nodes').then((response) => {
          this.nodeName = this.$store.state.node.nodeName || response.data[0].name
          this.nodes = response.data
        }).catch(() => {
          this.loading = false
          this.$message.error(this.$t('error.networkError'))
        })
      },
      loadListeners() {
        this.stashNode()
        this.loading = true
        httpGet(`/nodes/${this.nodeName}/listeners`).then((response) => {
          this.listeners = response.data
          this.loading = false
        }).catch(() => {
          this.loading = false
          this.$message.error(this.$t('error.networkError'))
        })
      },
    },
    created() {
      this.loadData()
    },
  }
</script>


<style lang="scss">
.listeners-view {
  .el-row {
    margin-top: 20px;
  }
  .el-table {
    margin-top: 24px;
  }
}
</style>
