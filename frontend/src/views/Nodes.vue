<template>
  <div class="nodes-view">
    <div class="page-title">Nodes</div>

    <el-table :data="nodes" v-loading="loading" :default-sort="{prop: 'name'}" border>
      <el-table-column prop="name" label="Node Name" min-width="160"></el-table-column>
      <el-table-column prop="version" label="Version"></el-table-column>
      <el-table-column prop="otp_release" label="OTP Release" min-width="90"></el-table-column>
      <el-table-column prop="uptime" label="Uptime" min-width="210"></el-table-column>
      <el-table-column prop="status" label="Status">
        <template scope="props">
          <span v-bind:class="[props.row.node_status === 'Running' ? 'running' : 'stopped', 'status']">
            {{ props.row.node_status === 'Running' ? 'Running': 'Stopped'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="oper" width="160" label="Oper">
        <template scope="scope">
          <el-button type="success" size="mini"
            @click="nodeDetail(scope.row.name)">Plugins
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>


<script>
import { Table, TableColumn, Button } from 'element-ui'
import { httpGet } from '../store/api'

export default {
  name: 'nodes-view',
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
  },
  data() {
    return {
      loading: false,
      popoverVisible: false,
      nodes: [],
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    hidePopover() {
      this.popoverVisible = true
      setTimeout(() => {
        this.popoverVisible = false
      }, 0)
    },
    loadData() {
      this.loading = true
      httpGet('/management/nodes').then((response) => {
        this.nodes = response.data
        this.loading = false
      })
    },
    nodeDetail(nodeName) {
      const encodedName = btoa(nodeName)
      this.$router.push({ path: `/nodes/${encodedName}/plugins` })
    },
  },
}
</script>


<style>
.nodes-view .status:before {
  content: "";
  display: inline-block;
  height: 8px;
  width: 8px;
  margin-right: 3px;
  border-radius: 4px;
}
.nodes-view .running:before {
  background-color: #7cb342;
}
.nodes-view .stopped:before {
  background-color: #777777;
}
.nodes-view .running {
  color: #7cb342;
}
</style>
