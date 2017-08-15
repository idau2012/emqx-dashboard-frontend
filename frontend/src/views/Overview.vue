<template>
  <div class="overview-view">
    <div class="page-title">Overview</div>
    <el-card class="box-card">
      <div slot="header">
        <span>Broker</span>
      </div>
      <el-table :data="tableData" border>
          <el-table-column label="System Name" prop="system_name" min-width="100"></el-table-column>
          <el-table-column label="Version" prop="version" min-width="100"></el-table-column>
          <el-table-column label="Uptime" prop="uptime" min-width="100"></el-table-column>
          <el-table-column label="System Time" prop="system_time" min-width="100"></el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <span>Nodes ()</span>
      </div>
      <el-table :data="tableData" border>
        <el-table-column label="Name" prop="name" min-width="200"></el-table-column>
        <el-table-column label="Erlang/OTP Release" prop="otp_release" min-width="200"></el-table-column>
        <el-table-column label="Erlang Processes(used/avaliable)" prop="process_used" min-width="200"></el-table-column>
        <el-table-column label="CPU Info(1load/5load/15load)" prop="load1" min-width="200"></el-table-column>
        <el-table-column label="Memory" prop="used_memory" min-width="200"></el-table-column>
        <el-table-column label="MaxFds" prop="max_fds" min-width="200"></el-table-column>
        <el-table-column label="ClusterStatus" prop="cluster_status" min-width="200"></el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <span>Stats</span>
      </div>
      <el-table :data="tableData" border>
        <el-table-column label="Clients/Count" prop="name" min-width="150"></el-table-column>
        <el-table-column label="Clients/Max" prop="otp_release" min-width="150"></el-table-column>
        <el-table-column label="Retained/Count" prop="process_used" min-width="150"></el-table-column>
        <el-table-column label="Retained/Max	" prop="load1" min-width="150"></el-table-column>
        <el-table-column label="Routes/Count" prop="used_memory" min-width="150"></el-table-column>
        <el-table-column label="Routes/Max" prop="max_fds" min-width="150"></el-table-column>
        <el-table-column label="Sessions/Count" prop="cluster_status" min-width="150"></el-table-column>
        <el-table-column label="Subscribers/Count" prop="cluster_status" min-width="150"></el-table-column>
        <el-table-column label="Topics/Count" prop="process_used" min-width="150"></el-table-column>
        <el-table-column label="Topics/Max" prop="load1" min-width="150"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>


<script>
import {
  Tabs, TabPane, Row, Col,
  TableColumn, Table,
  Button, Popover, Card,
} from 'element-ui'


export default {
  name: 'overview-view',
  data() {
    return {
      loading: false,
    }
  },
  components: {
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
  beforeCreate() {
  },
  created() {
  },
  mounted() {
  },
  methods: {
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
    &:last-child {
      margin-bottom: 0;
    }
  }
.el-col {
  border-radius: 4px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
