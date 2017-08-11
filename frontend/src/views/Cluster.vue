<template>
  <div class="cluster-view">
    <div class="page-title">Cluster</div>

    <el-table :data="tableData" v-loading="loading" :default-sort="{prop: 'name'}" border>
      <el-table-column label="Node Name" prop="name" min-width="195">
        <template scope="scope">
          <span v-bind:class="[scope.row.node_status === 'Running' ? 'running' : 'stopped', 'status']"></span>
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Erlang Processes">
        <el-table-column label="used/avaliable" min-width="150" prop="process"></el-table-column>
      </el-table-column>
      <el-table-column label="CPU">
        <el-table-column label="1load/5load/15load" min-width="160" prop="cpu"></el-table-column>
      </el-table-column>
      <el-table-column label="Memory">
        <el-table-column label="used/total" min-width="150" prop="memory"></el-table-column>
      </el-table-column>
      <el-table-column prop="max_fds" label="MaxFds" min-width="90"></el-table-column>
      <el-table-column prop="clients" label="Clients"></el-table-column>
      <el-table-column label="Datas" width="80">
       <template scope="scope">
        <el-button type="text" @click="nodeDetail(scope.row.name)">
          <i class="fa fa-eye"></i>
        </el-button>
       </template>
      </el-table-column>
      <el-table-column prop="graph" width="180" label="Graph">
        <template scope="scope">
          <el-button type="success" size="mini"
            @click="graphDetail(scope.row.name, 'emq')">EMQ
          </el-button>
          <el-button type="success" size="mini"
            @click="graphDetail(scope.row.name, 'host')">Host
          </el-button>
          <el-button type="success" size="mini"
            @click="graphDetail(scope.row.name, 'erlang')">Erlang
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>


<script>
import {
  Tabs, TabPane,
  TableColumn, Table,
  Button, Tag, Popover,
} from 'element-ui'
import { httpGet } from '../store/api'

export default {
  name: 'cluster-view',
  data() {
    return {
      loading: false,
      popoverVisible: false,
      tableData: [],
    }
  },
  beforeMount() {
    this.loadData()
  },
  components: {
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-tag': Tag,
    'el-popover': Popover,
  },
  methods: {
    loadData() {
      this.loading = true
      httpGet('/monitoring/nodes').then((response) => {
        this.tableData = response.data.map((node) => {
          const cpu = `${node.load1}/${node.load5}/${node.load15}`
          const memory = `${node.memory_used}/${node.memory_total}`
          const process = `${node.process_used}/${node.process_available}`
          return { ...node, process, cpu, memory }
        })
        this.loading = false
      })
    },
    nodeDetail(nodeName) {
      const encodedName = btoa(nodeName)
      this.$router.push({ path: `/cluster/${encodedName}/emqdatas` })
    },
    graphDetail(nodeName, graphType) {
      const encodedName = btoa(nodeName)
      this.$router.push({ path: `/cluster/${encodedName}/graph/${graphType}` })
    },
  },
}
</script>


<style>
.cluster-view .el-table th {
  height: 30px;
}
.cluster-view .fa-eye {
  color: #fff;
  font-size: 20px;
}
.cluster-view .status:before {
  content: "";
  display: inline-block;
  height: 8px;
  width: 8px;
  margin-right: 3px;
  border-radius: 4px;
}
.cluster-view .running:before {
  background-color: #7cb342;
}
.cluster-view .stopped:before {
  background-color: #777777;
}
.cluster-view .running {
  color: #7cb342;
}
</style>
