<template>
  <div class="datas-view">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/cluster' }">Cluster</el-breadcrumb-item>
      <el-breadcrumb-item>{{ nodeName }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page-title">{{ activeTab }}</div>

    <el-tabs @tab-click="handleTabClick" v-model="activeTab">
      <el-tab-pane label="Clients" name="clients"></el-tab-pane>
      <el-tab-pane label="Sessions" name="sessions"></el-tab-pane>
      <!--<el-tab-pane label="Topics" name="topics"></el-tab-pane>-->
      <el-tab-pane label="Routers" name="routers"></el-tab-pane>
      <el-tab-pane label="Subscriptions" name="subscriptions"></el-tab-pane>
    </el-tabs>

    <el-row type="flex" justify="end" align="middle">
      <el-input v-model="searchValue" :placeholder="searchPlaceholder" size="small"></el-input>
      <el-button :plain="true" type="success" icon="search" size="small"
        @click="search">Search
      </el-button>
    </el-row>

    <el-table :data="clients" v-loading="loading" v-show="activeTab==='clients'" border>
      <el-table-column prop="client_id" label="ClientId" min-width="100"></el-table-column>
      <el-table-column prop="username" label="Username"></el-table-column>
      <el-table-column prop="ipaddress" label="IPAddr" width="150"></el-table-column>
      <el-table-column prop="port" label="Port" width="80"></el-table-column>
      <el-table-column prop="clean_sess" label="CleanSess" width="110">
        <template scope="scope">
          <span>{{ scope.row.clean_sess ? 'true' : 'false' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="proto_ver" label="ProtoVer" width="100"></el-table-column>
      <el-table-column prop="keepalive" label="Keepalive(s)" width="120"></el-table-column>
      <el-table-column prop="connected_at" label="ConnectedAt" width="180"></el-table-column>
    </el-table>

    <el-table :data="sessions" v-loading="loading" v-show="activeTab==='sessions'" border>
      <el-table-column prop="client_id" label="ClientId" min-width="150"></el-table-column>
      <el-table-column prop="clean_sess" label="CleanSess" min-width="150">
        <template scope="scope">
          <span>{{ scope.row.clean_sess ? 'true' : 'false' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="max_inflight" label="MaxInflight" min-width="120"></el-table-column>
      <el-table-column prop="inflight_queue" label="InflightQueue" min-width="150"></el-table-column>
      <el-table-column prop="message_queue" label="MessageQueue" min-width="150"></el-table-column>
      <el-table-column prop="message_dropped" label="MessageDropped" min-width="150"></el-table-column>
      <el-table-column prop="awaiting_rel" label="AwaitingRel" min-width="120"></el-table-column>
      <el-table-column prop="awaiting_ack" label="AwaitingAck" min-width="120"></el-table-column>
      <el-table-column prop="awaiting_comp" label="AwaitingComp" min-width="150"></el-table-column>
      <el-table-column prop="created_at" label="CreatedAt" min-width="180"></el-table-column>
    </el-table>

    <el-table :data="topics" v-loading="loading" v-show="activeTab==='topics'" border>
      <el-table-column prop="topic" label="Topic"></el-table-column>
      <el-table-column prop="subTopicCount" label="SubTopicCount"></el-table-column>
    </el-table>

    <el-table :data="routers" v-loading="loading" v-show="activeTab==='routers'" border>
      <el-table-column prop="topic" label="Topic"></el-table-column>
      <el-table-column prop="node" label="Node"></el-table-column>
    </el-table>

    <el-table :data="subscriptions" v-loading="loading" v-show="activeTab==='subscriptions'" border>
      <el-table-column prop="client_id" label="ClientId"></el-table-column>
      <el-table-column prop="topic" label="Topic"></el-table-column>
      <el-table-column prop="qos" label="QoS"></el-table-column>
    </el-table>

    <el-pagination
      @current-change="currentPageChanged"
      layout="prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      v-if="total>1">
    </el-pagination>

  </div>
</template>


<script>
import { httpGet } from '../store/api'

export default {
  name: 'datas-view',
  data() {
    return {
      loading: false,
      nodeName: '',
      activeTab: 'clients',
      popoverVisible: false,
      searchKey: 'clientId_like',
      searchValue: '',
      searchPlaceholder: 'ClientId',
      clients: [],
      sessions: [],
      topics: [],
      routers: [],
      subscriptions: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData(searchValue = '') {
      this.loading = true
      this.nodeName = atob(this.$route.params.node)
      let requestURL = `/nodes/${this.nodeName}/${this.activeTab}?curr_page=${this.currentPage}&page_size=${this.pageSize}`
      if (searchValue !== '') {
        requestURL = `/nodes/${this.nodeName}/${this.activeTab}/${searchValue}`
      }
      httpGet(requestURL).then((response) => {
        this[this.activeTab] = response.data.objects
        this.total = response.data.total_num || 0
        // this.total = parseInt(response.headers['x-total-count'], 10) || 0
        this.loading = false
      })
    },
    handleTabClick(tab) {
      this.activeTab = tab.name
      this.currentPage = 1
      this.searchValue = ''
      switch (tab.name) {
        case 'clients':
        case 'sessions':
        case 'subscriptions':
          this.searchPlaceholder = 'ClientId'
          this.searchKey = 'clientId_like'
          break
        case 'topics':
        case 'routers':
          this.searchPlaceholder = 'Topic'
          this.searchKey = 'topic_like'
          break
        default:
          this.searchPlaceholder = 'ClientId'
          this.searchKey = 'clientId_like'
          break
      }
      this.loadData()
    },
    currentPageChanged(val) {
      this.currentPage = val
      this.loadData(this.searchValue)
    },
    search() {
      this.loadData(this.searchValue)
    },
  },
}
</script>


<style>
.datas-view {
  padding-top: 20px;
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
</style>
