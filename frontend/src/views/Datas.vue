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
          v-if="activeTab !== 'topics'"
          class="select-radius"
          v-model="nodeName"
          :placeholder="$t('select.placeholder')"
          size="small"
          :disabled="loading"
          @change="loadChild(true)">
          <el-option value="cluster" :label="$t('select.cluster')">
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
        <template slot-scope="scope">
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
        <template slot-scope="props">
          {{ props.row.node || '0'}}
        </template>
      </el-table-column>
      <el-table-column prop="client_id" min-width="160" :label="$t('sessions.clientId')">
        <template slot-scope="props">
          {{ props.row.client_id || '0'}}
        </template>
      </el-table-column>
      <el-table-column prop="clean_sess" width="120" :label="$t('sessions.cleanSess')">
        <template slot-scope="scope">
          <span>{{ scope.row.clean_sess ? 'true' : 'false' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subscriptions" min-width="120" :label="$t('sessions.subscriptions')">
        <template slot-scope="props">
          {{ props.row.subscriptions || '0'}}
        </template>
      </el-table-column>
      <el-table-column prop="max_inflight" min-width="150" :label="$t('sessions.maxInflight')">
        <template slot-scope="props">
          {{ props.row.max_inflight || '0'}}
        </template>
      </el-table-column>
      <el-table-column prop="inflight_len" min-width="150" :label="$t('sessions.inflightLen')">
        <template slot-scope="props">
          {{ props.row.inflight_len || '0'}}
        </template>
      </el-table-column>
      <el-table-column prop="mqueue_len" min-width="150" :label="$t('sessions.mqueueLen')">
        <template slot-scope="props">
          {{ props.row.mqueue_len || '0'}}
        </template>
      </el-table-column>
      <el-table-column prop="mqueue_dropped" min-width="150" :label="$t('sessions.mqueueDropped')">
        <template slot-scope="props">
          {{ props.row.mqueue_dropped || '0'}}
        </template>
      </el-table-column>
      <el-table-column prop="awaiting_rel_len" min-width="150" :label="$t('sessions.awaitingRelLen')">
        <template slot-scope="props">
          {{ props.row.awaiting_rel_len || '0'}}
        </template>
      </el-table-column>
      <el-table-column prop="deliver_msg" min-width="150" :label="$t('sessions.deliverMsg')">
        <template slot-scope="props">
          {{ props.row.deliver_msg || '0'}}
        </template>
      </el-table-column>
      <el-table-column prop="enqueue_msg" min-width="180" :label="$t('sessions.enqueueMsg')">
        <template slot-scope="props">
          {{ props.row.enqueue_msg || '0'}}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" min-width="180" :label="$t('sessions.createdAt')">
        <template slot-scope="props">
          {{ props.row.created_at || '0'}}
        </template>
      </el-table-column>
    </el-table>

    <!-- topics -->
    <el-table :data="topics" v-show="activeTab==='topics'" v-loading="loading" border>
      <el-table-column prop="topic" :label="$t('topics.topic')"></el-table-column>
      <el-table-column prop="node" :label="$t('topics.node')"></el-table-column>
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
import { Pagination, Input, Select, Option, Table, TableColumn } from 'element-ui'

import { httpGet } from '../store/api'
import { CURRENT_NODE } from '../store/mutation-types'

export default {
  name: 'datas-view',
  components: {
    'el-pagination': Pagination,
    'el-input': Input,
    'el-select': Select,
    'el-option': Option,
    'el-table': Table,
    'el-table-column': TableColumn,
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
        case 'topics':
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
      if (!this.nodeName && this.activeTab !== 'topics') {
        return
      }
      // load child with the page asc
      if (reload) {
        this.page = 1
      }
      this.loading = true
      let requestURL = `/nodes/${this.nodeName}/${this.activeTab}?_page=${this.page}&_limit=${this.limit}`
      // cluster
      if (this.activeTab === 'topics' || this.cluster) {
        const url = this.activeTab === 'topics' ? 'routes' : this.activeTab
        requestURL = `/${url}?_page=${this.page}&_limit=${this.limit}`
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
        this.loadData()
        return
      }
      let requestURL = `/nodes/${this.nodeName}/${this.activeTab}/${encodeURIComponent(this.searchValue)}`
      if (this.activeTab === 'topics' || this.cluster) {
        const url = this.activeTab === 'topics' ? 'routes' : this.activeTab
        requestURL = `/${url}/${encodeURIComponent(this.searchValue)}`
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
