<template>
  <div class="datas-view">

    <div class="page-title">
      {{ $t(`leftbar.${activeTab}`) }}
      <div style="float: right" @keyup.enter.native="searchChild">
        <el-input :disabled="loading" @keyup.enter.native="searchChild"
                  icon="search" :on-icon-click="searchChild" class="input-radius"
                  v-model="searchValue" :placeholder="searchPlaceholder" size="small"></el-input>
      </div>
    </div>

    <!-- clients -->
    <el-table :data="clients" v-loading="loading" v-show="activeTab==='clients'" border>
      <el-table-column prop="client_id" :label="$t('clients.clientId')" min-width="160"></el-table-column>
      <el-table-column prop="username" :label="$t('clients.username')" min-width="130"></el-table-column>
      <el-table-column prop="ipaddress" :label="$t('clients.ipAddr')" min-width="150"></el-table-column>
      <el-table-column prop="port" :label="$t('clients.port')" min-width="80"></el-table-column>
      <el-table-column prop="clean_sess" :label="$t('clients.cleanSess')" min-width="110">
        <template scope="scope">
          <span>{{ scope.row.clean_sess ? 'true' : 'false' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="proto_ver" :label="$t('clients.protoVer')" width="90"></el-table-column>
      <el-table-column prop="keepalive" :label="$t('clients.keepalive')" width="120"></el-table-column>
      <el-table-column prop="connected_at" :label="$t('clients.connectedAt')" width="180"></el-table-column>
    </el-table>

    <!-- sessions -->
    <el-table :data="sessions" v-loading="loading" v-show="activeTab==='sessions'" border>
      <el-table-column prop="client_id" :label="$t('sessions.clientId')" min-width="160"></el-table-column>
      <el-table-column prop="clean_sess" :label="$t('sessions.cleanSess')" min-width="150">
        <template scope="scope">
          <span>{{ scope.row.clean_sess ? 'true' : 'false' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="max_inflight" :label="$t('sessions.maxInflight')" min-width="120"></el-table-column>
      <el-table-column prop="inflight_queue" :label="$t('sessions.inflightQueue')" min-width="150"></el-table-column>
      <el-table-column prop="message_queue" :label="$t('sessions.messageQueue')" min-width="150"></el-table-column>
      <el-table-column prop="message_dropped" :label="$t('sessions.messageDropped')" min-width="150"></el-table-column>
      <el-table-column prop="awaiting_rel" :label="$t('sessions.awaitingRel')" min-width="120"></el-table-column>
      <el-table-column prop="awaiting_ack" :label="$t('sessions.awaitingAck')" min-width="120"></el-table-column>
      <el-table-column prop="awaiting_comp" :label="$t('sessions.awaitingComp')" min-width="150"></el-table-column>
      <el-table-column prop="created_at" :label="$t('sessions.createdAt')" min-width="180"></el-table-column>
    </el-table>

    <!-- topics -->
    <el-table :data="topics" v-loading="loading" v-show="activeTab==='topics'" border>
      <el-table-column prop="topic" label="Topic"></el-table-column>
      <el-table-column prop="subTopicCount" label="SubTopicCount"></el-table-column>
    </el-table>

     <!-- routes -->
    <el-table :data="routes" v-loading="loading" v-show="activeTab==='routes'" border>
      <el-table-column prop="topic" label="Topic"></el-table-column>
      <el-table-column prop="node" label="Node"></el-table-column>
    </el-table>

    <!-- subscriptions -->
    <el-table :data="subscriptions" v-loading="loading" v-show="activeTab==='subscriptions'" border>
      <el-table-column prop="client_id" label="ClientId"></el-table-column>
      <el-table-column prop="topic" label="Topic"></el-table-column>
      <el-table-column prop="qos" label="QoS"></el-table-column>
    </el-table>

    <!-- refresh button -->
    <el-row type="flex" justify="end" v-show="searchView">
      <el-col :span="24">
        <el-button size="small" type="text" icon="arrow-left" class="back-btn" style="float: right;" @click="loadChild">Back</el-button>
      </el-col>
    </el-row>

    <!-- pagination -->
    <el-pagination
      @current-change="currentPageChanged"
      layout="prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      v-if="total>0">
    </el-pagination>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import {
  Tabs, TabPane,
  TableColumn, Table,
  Button, Tag, Popover,
  Breadcrumb, BreadcrumbItem, Row, Input,
  Select, Pagination, Option, Col,
} from 'element-ui'

import { httpGet } from '../store/api'
import { CURRENT_NODE } from '../store/mutation-types'

export default {
  name: 'datas-view',
  components: {
    'el-col': Col,
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
      searchView: false,
      loading: false,
      nodeName: '',
      nodes: {},
      activeTab: 'clients',
      popoverVisible: false,
      searchKey: '',
      searchValue: '',
      searchPlaceholder: 'ClientId',
      clients: [],
      sessions: [],
      topics: [],
      routes: [],
      subscriptions: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
    }
  },
  created() {
    this.init()
  },
  watch: {
    $route: 'init',
    $store: 'loadData',
  },
  methods: {
    ...mapActions([CURRENT_NODE]),
    // set global nodeName
    setStore() {
      this.CURRENT_NODE({ nodeName: { current: this.nodeName } })
    },
    // get path
    init() {
      this.activeTab = this.$route.path.split('/')[1]
      switch (this.activeTab) {
        case 'clients':
        case 'sessions':
        case 'subscriptions':
          this.searchPlaceholder = 'ClientId'
          break
        case 'topics':
        case 'routes':
          this.searchPlaceholder = 'Topic'
          break
        default:
          this.searchPlaceholder = 'ClientId'
          break
      }
      this.loadData()
    },
    loadData() {
      this.loading = true
      this.currentPage = 1
      this.searchValue = ''
      // load routes needn't nodes
      if (this.activeTab === 'routes') {
        this.loadChild()
        return
      }
      // set default of select
      const currentNode = this.$store.state.nodeName.current
      if (!currentNode) {
        httpGet('/management/nodes').then((response) => {
          this.nodeName = response.data.result[0].name || ''
          this.nodes = response.data.result
          console.log('load node from api', 'datas')
          this.setStore()
          // load child with sync
          this.loadChild()
        })
      } else {
        this.nodeName = currentNode
        this.setStore()
        this.loadChild()
      }
    },
    // load child with pagination
    currentPageChanged(target) {
      this.currentPage = target
      this.loadChild()
    },
    loadChild(reload = false) {
      this.nodeName = this.$store.state.nodeName.current
      console.log('nodeName ok ', 'datas')
      this.searchView = false
      this.searchValue = ''
      if (!this.nodeName && this.activeTab !== 'routes') {
        return
      }
      // load child with the currentPage asc
      if (reload) {
        this.currentPage = 1
      }
      this.loading = true
      this.setStore()
      let requestURL = `/nodes/${this.nodeName}/${this.activeTab}?curr_page=${this.currentPage}&page_size=${this.pageSize}`
      if (this.activeTab === 'routes') {
        requestURL = `/routes?curr_page=${this.currentPage}&page_size=${this.pageSize}`
      }
      httpGet(requestURL).then((response) => {
        this[this.activeTab] = response.data.result.objects
        this.total = response.data.result.total_num || 0
        this.loading = false
      })
    },
    searchChild() {
      if (!this.searchValue) {
        this.$message.error(`${this.searchPlaceholder} required!`)
        return
      }
      let requestURL = `/nodes/${this.nodeName}/${this.activeTab}/${this.searchValue}`
      if (this.activeTab === 'routes') {
        requestURL = `/routes/${this.searchValue}`
      }
      this.loading = true
      httpGet(requestURL).then((response) => {
        if (response.data.result.objects.length === 0) {
          this.searchView = false
          this[this.activeTab] = []
          // this.$message.error('No Data!')
          this.searchView = true
          // reset page
          this.total = 0
          this.currentPage = 0
        } else {
          this[this.activeTab] = response.data.result.objects
          this.searchView = true
          // reset page
          this.total = 0
          this.currentPage = 0
        }
        this.loading = false
      })
    },
  },
}
</script>


<style lang="scss">
.datas-view {
  padding-top: 20px;
  .page-title {
    padding: 10px 0;
  }
  .el-table {
    margin-top: 60px;
  }
  .el-row {
    margin-top: 20px;
  }
  .el-input {
    width: 240px;
  }
  .search-btn {
    margin-left: 8px
  }
  .el-breadcrumb {
    margin-top: 10px;
    margin-bottom: 20px;
  }
}
</style>
