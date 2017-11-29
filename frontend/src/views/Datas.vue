<template>
  <div class="datas-view">
    <div class="page-title">
      {{ $t(`leftbar.${activeTab}`) }}
      <div style="float: right" @keyup.enter.native="searchChild">
        <el-input
          v-model="searchValue"
          class="input-radius"
          size="small"
          style="float: right;padding-left: 20px"
          :icon="iconStatus"
          :disabled="loading"
          :on-icon-click="searchChild"
          :placeholder="searchPlaceholder"
          @change="searchView = false"
          @keyup.enter.native="searchChild">
        </el-input>

        <el-select
          v-if="activeTab !== 'routes'"
          class="select-radius"
          v-model="nodeName"
          :placeholder="$t('select.placeholder')"
          size="small"
          :disabled="loading"
          @change="loadChild(true)">
          <el-option
            :label="$t('select.cluster')"
            value="cluster">
          </el-option>
          <el-option
            v-for="item in nodes"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- clients -->
    <el-table v-show="activeTab==='clients'" v-loading="loading" border :data="clients">
      <el-table-column v-if="cluster" prop="node" min-width="160" :label="$t('clients.node')">
      </el-table-column>
      <el-table-column prop="client_id" min-width="160" :label="$t('clients.clientId')">
      </el-table-column>
      <el-table-column prop="username" min-width="130" :label="$t('clients.username')">
      </el-table-column>
      <el-table-column prop="ipaddress" min-width="150" :label="$t('clients.ipAddr')">
      </el-table-column>
      <el-table-column prop="port" min-width="80" :label="$t('clients.port')">
      </el-table-column>
      <el-table-column prop="clean_sess" min-width="110" :label="$t('clients.cleanSess')">
        <template scope="scope">
          <span>{{ scope.row.clean_sess ? 'true' : 'false' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="proto_ver" width="120" :label="$t('clients.protoVer')">
      </el-table-column>
      <el-table-column prop="keepalive" width="120" :label="$t('clients.keepalive')">
      </el-table-column>
      <el-table-column prop="connected_at" width="180" :label="$t('clients.connectedAt')">
      </el-table-column>
    </el-table>

    <!-- sessions -->
    <el-table v-show="activeTab==='sessions'" v-loading="loading" border :data="sessions">
      <el-table-column v-if="cluster" prop="node" min-width="160" :label="$t('clients.node')">
      </el-table-column>
      <el-table-column prop="client_id" min-width="160" :label="$t('sessions.clientId')">
      </el-table-column>
      <el-table-column prop="clean_sess" width="120" :label="$t('sessions.cleanSess')">
        <template scope="scope">
          <span>{{ scope.row.clean_sess ? 'true' : 'false' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subscriptions" min-width="120" :label="$t('sessions.subscriptions')"></el-table-column>
      <el-table-column prop="max_inflight" min-width="150" :label="$t('sessions.maxInflight')"></el-table-column>
      <el-table-column prop="inflight_len" min-width="150" :label="$t('sessions.inflightLen')"></el-table-column>
      <el-table-column prop="mqueue_len" min-width="150" :label="$t('sessions.mqueueLen')"></el-table-column>
      <el-table-column prop="mqueue_dropped" min-width="150" :label="$t('sessions.mqueueDropped')"></el-table-column>
      <el-table-column prop="awaiting_rel_len" min-width="150" :label="$t('sessions.awaitingRelLen')"></el-table-column>
      <el-table-column prop="deliver_msg" min-width="150" :label="$t('sessions.deliverMsg')"></el-table-column>
      <el-table-column prop="enqueue_msg" min-width="180" :label="$t('sessions.enqueueMsg')"></el-table-column>
      <el-table-column prop="created_at" min-width="180" :label="$t('sessions.createdAt')"></el-table-column>
    </el-table>

    <!-- topics -->
    <el-table v-show="activeTab==='topics'" v-loading="loading" border :data="topics">
      <el-table-column prop="topic" label="Topic"></el-table-column>
      <el-table-column prop="subTopicCount" label="SubTopicCount"></el-table-column>
    </el-table>

     <!-- routes -->
    <el-table :data="routes" v-show="activeTab==='routes'" v-loading="loading" border>
      <el-table-column prop="topic" :label="$t('routes.topic')"></el-table-column>
      <el-table-column prop="node" :label="$t('routes.node')"></el-table-column>
    </el-table>

    <!-- subscriptions -->
    <el-table v-loading="loading" v-show="activeTab==='subscriptions'" border :data="subscriptions">
      <el-table-column v-if="cluster" prop="node" min-width="160" :label="$t('clients.node')">
      </el-table-column>
      <el-table-column prop="client_id" :label="$t('subscriptions.clientId')"></el-table-column>
      <el-table-column prop="topic" :label="$t('subscriptions.topic')"></el-table-column>
      <el-table-column prop="qos" :label="$t('subscriptions.qoS')"></el-table-column>
    </el-table>

    <!-- pagination -->
    <el-pagination
      small
      v-if="count > limit"
      layout="prev, pager, next"
      :current-page.sync="page"
      :page-size="limit"
      @current-change="turnPage"
      :total="count">
    </el-pagination>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import {
  Tabs, TabPane, TableColumn, Table, Button, Tag, Popover, Breadcrumb, BreadcrumbItem,
  Row, Input, Select, Pagination, Option, Col,
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
      cluster: true,
      popoverVisible: false,
      limit: 10,
      page: 1,
      count: 0,
      nodeName: '',
      nodes: [],
      activeTab: 'clients',
      searchKey: '',
      searchValue: '',
      searchPlaceholder: 'ClientId',
      clients: [],
      sessions: [],
      topics: [],
      routes: [],
      subscriptions: [],
    }
  },
  watch: {
    $route: 'init',
  },
  computed: {
    iconStatus() {
      return this.searchView ? 'close' : 'search'
    },
    searchValueEncode() {
      return this.searchValue.replace(/\//g, '%2f')
    },
  },
  methods: {
    ...mapActions([CURRENT_NODE]),
    // set global nodeName without
    stashNode() {
      this.cluster = this.nodeName === 'cluster'
      if (this.cluster) {
        return
      }
      this.CURRENT_NODE({ nodeName: this.nodeName })
    },
    // get path
    init() {
      this.activeTab = this.$route.path.split('/')[1]
      switch (this.activeTab) {
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
      this.page = 1
      this.searchValue = ''
      // set default of select
      httpGet('/nodes').then((response) => {
        const currentNode = this.$store.state.node.nodeName || response.data[0].name
        this.nodeName = this.cluster ? 'cluster' : currentNode
        this.nodes = response.data
        this.loading = false
        this.loadChild()
      }).catch((error) => {
        this.loading = false
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    loadChild(reload = false) {
      this.stashNode()
      this.searchView = false
      this.searchValue = ''
      if (!this.nodeName && this.activeTab !== 'routes') {
        return
      }
      // load child with the page asc
      if (reload) {
        this.page = 1
      }
      this.loading = true
      let requestURL = `/nodes/${this.nodeName}/${this.activeTab}?_page=${this.page}&_limit=${this.limit}`
      // cluster
      if (this.activeTab === 'routes' || this.cluster) {
        requestURL = `/${this.activeTab}?_page=${this.page}&_limit=${this.limit}`
      }
      httpGet(requestURL).then((response) => {
        this[this.activeTab] = response.data.items
        this.count = response.data.meta.count || 0
        this.page = response.data.meta.page || 1
        this.loading = false
      }).catch((error) => {
        this.loading = false
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    searchChild() {
      // click x button
      if (this.searchView) {
        this.loadChild()
        return
      }
      if (!this.searchValue) {
        this.$message.error(`${this.searchPlaceholder} ${this.$t('alert.required')}`)
        return
      }
      let requestURL = `/nodes/${this.nodeName}/${this.activeTab}/${this.searchValueEncode}`
      if (this.activeTab === 'routes' || this.cluster) {
        requestURL = `/${this.activeTab}/${this.searchValueEncode}`
      }
      this.loading = true
      httpGet(requestURL).then((response) => {
        // reset page
        this.count = 0
        this.page = 1
        this.searchView = true
        this[this.activeTab] = response.data
        this.loading = false
      }).catch((error) => {
        this.loading = false
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    // load child with pagination
    turnPage() {
      this.loadChild()
    },
  },
  created() {
    this.init()
  },
}
</script>


<style lang="scss">
.datas-view {
  .el-table {
    margin-top: 24px;
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
