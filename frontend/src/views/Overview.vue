<template>
  <div class="overview-view">
    <div class="page-title">Overview</div>
    <el-card class="box-card">
      <div slot="header">
        <span>Broker</span>
      </div>
      <el-table :data="brokers" border>
          <el-table-column label="System Name" prop="sysdescr" min-width="160"></el-table-column>
          <el-table-column label="Version" prop="version" min-width="160"></el-table-column>
          <el-table-column label="Uptime" prop="uptime" min-width="300"></el-table-column>
          <el-table-column label="System Time" prop="datetime" min-width="200"></el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <span>Nodes ({{ nodes.length }})</span>
      </div>
      <el-table :data="nodes" border>
        <el-table-column label="Name" prop="name" min-width="140"></el-table-column>
        <el-table-column label="Erlang Processes">
          <el-table-column label="used/avaliable" min-width="150" prop="process">
            <template scope="scope">
              {{ scope.row.process_used + ' / ' + scope.row.process_available }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="CPU Info">
          <el-table-column label=" 1load/5load/15load" min-width="180">
            <template scope="scope">
              {{ scope.row.load1 + ' / ' + scope.row.load5 + ' / ' + scope.row.load15 }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Memory" min-width="200">
          <template scope="scope">
            {{ scope.row.memory_used + ' / ' + scope.row.memory_total }}
          </template>
        </el-table-column>
        <el-table-column label="MaxFds" prop="max_fds" min-width="120"></el-table-column>
        <el-table-column label="Status" min-width="120">
          <template scope="props">
            <span v-bind:class="[props.row.node_status === 'Running' ? 'running' : 'stopped', 'status']">
              {{ props.row.node_status }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <span>Stats</span>
      </div>
      <el-table :data="stats" border>
        <el-table-column label="Name" prop="name" min-width="150"></el-table-column>
        <el-table-column label="Clients/Count" prop="clients/count" min-width="150"></el-table-column>
        <el-table-column label="Clients/Max" prop="clients/max" min-width="150"></el-table-column>
        <el-table-column label="Retained/Count" prop="retained/count" min-width="150"></el-table-column>
        <el-table-column label="Retained/Max	" prop="retained/max" min-width="150"></el-table-column>
        <el-table-column label="Routes/Count" prop="routes/count" min-width="150"></el-table-column>
        <el-table-column label="Routes/Max" prop="routes/max" min-width="150"></el-table-column>
        <el-table-column label="Sessions/Count" prop="sessions/count" min-width="150"></el-table-column>
        <el-table-column label="Subscribers/Count" prop="subscriptions/count" min-width="160"></el-table-column>
        <el-table-column label="Topics/Count" prop="topics/count" min-width="150"></el-table-column>
        <el-table-column label="Topics/Max" prop="topics/max" min-width="150"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>


<script>
import {
  Tabs, TabPane, Row, Col,
  TableColumn, Table,
  Button, Popover, Card, Tag,
} from 'element-ui'

import { httpGet } from '../store/api'


export default {
  name: 'overview-view',
  data() {
    return {
      loading: false,
      nodes: [],
      stats: [],
      brokers: [],
      flag: 0,
    }
  },
  components: {
    'el-tag': Tag,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-popover': Popover,
    'el-card': Card,
    'el-row': Row,
    'el-col': Col,
  },
  mounted() {
    this.getDatas()
  },
  created() {
    this.refDatas()
  },
  methods: {
    refDatas() {
      window.clearInterval(this.flag)
      this.flag = window.setInterval(this.getDatas, 1000 * 10)
    },
    getDatas() {
      if (this.$route.path !== '/') {
        window.clearInterval(this.flag)
        return
      }
      httpGet('/monitoring/nodes').then((response) => {
        this.nodes = response.data.result
      })
      httpGet('/monitoring/stats').then((response) => {
        // the backend is so bad
        const data = response.data.result
        const stats = []
        let datas = {}
        data.forEach((item) => {
          Object.keys(item).forEach((x) => {
            datas = item[x]
            datas.name = x
            stats.push(datas)
          })
        })
        this.stats = stats
      })
      httpGet('/management/nodes').then((response) => {
        this.brokers = response.data.result
      })
    },
  },
}
</script>


<style>
span {
  line-height: 10px;
}
.overview-view .box-card {
  margin-top: 30px;
}
.el-table--enable-row-hover tr:hover>td {
  background-color: #37363b;
}
.overview-view .el-row {
  margin-bottom: 10px;
}
.overview-view .el-row:last-child {
  margin-bottom: 0;
}
.overview-view .el-col {
  border-radius: 4px;
}
.overview-view .row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.overview-view .el-table {
  border-color: #1f1d1d;
}
.overview-view .el-table__row:hover {
  background-color: #37363b;
}
.overview-view .status:before {
  content: "";
  display: inline-block;
  height: 8px;
  width: 8px;
  margin-right: 3px;
  border-radius: 4px;
}
.overview-view .running:before {
  background-color: #227D51;
}
.overview-view .stopped:before {
  background-color: #777777;
}
.overview-view .running {
  color: #227D51;
}
</style>
