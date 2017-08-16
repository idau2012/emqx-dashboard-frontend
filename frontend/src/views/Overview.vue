<template>
  <div class="overview-view">
    <div class="page-title">Overview</div>
    <el-card class="box-card">
      <div slot="header">
        <span>Broker</span>
      </div>
      <el-table :data="brokers" border>
          <el-table-column label="System Name" prop="sysdescr" min-width="100"></el-table-column>
          <el-table-column label="Version" prop="version" min-width="100"></el-table-column>
          <el-table-column label="Uptime" prop="uptime" min-width="100"></el-table-column>
          <el-table-column label="System Time" prop="datetime" min-width="100"></el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <span>Nodes ({{ nodes.length }})</span>
      </div>
      <el-table :data="nodes" border>
        <el-table-column label="Name" prop="name" min-width="140"></el-table-column>
        <el-table-column label="Erlang/OTP Release" prop="otp_release" min-width="100"></el-table-column>
        <el-table-column label="Erlang Processes (used/avaliable)" min-width="250">
          <template scope="scope">
            {{ scope.row.process_used + ' / ' + scope.row.process_available }}
          </template>
        </el-table-column>
        <el-table-column label="CPU Info (1load/5load/15load)" min-width="240">
          <template scope="scope">
            {{ scope.row.load1 + ' / ' + scope.row.load5 + ' / ' + scope.row.load15 }}
          </template>
        </el-table-column>
        <el-table-column label="Memory" min-width="140">
          <template scope="scope">
            {{ scope.row.used_memory + ' / ' + scope.row.total_memory }}
          </template>
        </el-table-column>
        <el-table-column label="MaxFds" prop="max_fds" min-width="140"></el-table-column>
        <el-table-column label="ClusterStatus" min-width="140">
          <template scope="scope">
            <el-tag :type="scope.row.cluster_status === 'Running' ? 'success' : 'danger'">{{ scope.row.cluster_status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <span>Stats</span>
      </div>
      <el-table :data="stats" border>
        <el-table-column label="Clients/Count" prop="clients/count" min-width="70"></el-table-column>
        <el-table-column label="Clients/Max" prop="clients/max" min-width="70"></el-table-column>
        <el-table-column label="Retained/Count" prop="retained/count" min-width="70"></el-table-column>
        <el-table-column label="Retained/Max	" prop="retained/max" min-width="70"></el-table-column>
        <el-table-column label="Routes/Count" prop="routes/count" min-width="70"></el-table-column>
        <el-table-column label="Routes/Max" prop="routes/max" min-width="70"></el-table-column>
        <el-table-column label="Sessions/Count" prop="sessions/count" min-width="70"></el-table-column>
        <el-table-column label="Subscribers/Count" prop="subscriptions/count" min-width="70"></el-table-column>
        <el-table-column label="Topics/Count" prop="topics/count" min-width="70"></el-table-column>
        <el-table-column label="Topics/Max" prop="topics/max" min-width="70"></el-table-column>
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
      }
      httpGet('/nodes').then((response) => {
        console.log(response.data)
        this.nodes = response.data
      })
      httpGet('/stats').then((response) => {
        this.stats = response.data
      })
      httpGet('/brokers').then((response) => {
        this.brokers = response.data
      })
    },
  },
}
</script>


<style>
span {
  line-height: 10px;
  color: #161616;
}
.overview-view .box-card {
  margin-top: 30px;
}
.el-row {
  margin-bottom: 10px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
