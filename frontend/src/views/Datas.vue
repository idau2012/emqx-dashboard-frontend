<template>
  <div class="datas-view">
    <div class="page-title">{{ activeTab }}</div>
    <el-row type="flex" justify="end" align="center">
      <el-select v-model="nodeName" v-show="activeTab !== 'routers'" :disabled="loading" placeholder="Select Node" size="small" @change="loadChild(true)">
        <el-option
          v-for="item in nodes"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <el-input :disabled="loading" v-model="searchValue" :placeholder="searchPlaceholder" size="small"></el-input>
      <el-button :plain="true" type="success" icon="search" size="small"
                     @click="searchChild">Search
      </el-button>
    </el-row>
    <el-table :data="clients" v-loading="loading" v-show="activeTab==='clients'" border>
      <el-table-column prop="client_id" label="ClientId" min-width="150"></el-table-column>
      <el-table-column prop="username" label="Username" width="130"></el-table-column>
      <el-table-column prop="ipaddress" label="IPAddr" width="150"></el-table-column>
      <el-table-column prop="port" label="Port" width="80"></el-table-column>
      <el-table-column prop="clean_sess" label="CleanSess" width="110">
        <template scope="scope">
          <span>{{ scope.row.clean_sess ? 'true' : 'false' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="proto_ver" label="ProtoVer" width="90"></el-table-column>
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
      v-if="total>0">
    </el-pagination>
  </div>
</template>


<script>
import {
  Tabs, TabPane,
  TableColumn, Table,
  Button, Tag, Popover,
  Breadcrumb, BreadcrumbItem, Row, Input,
  Select, Pagination, Option,
} from 'element-ui'
import { httpGet } from '../store/api'


export default {
  name: 'datas-view',
  components: {
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
      routers: [],
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
  },
  methods: {
    init() {
      // get path
      this.activeTab = this.$route.path.split('/')[1]
      switch (this.activeTab) {
        case 'clients':
        case 'sessions':
        case 'subscriptions':
          this.searchPlaceholder = 'ClientId'
          break
        case 'topics':
        case 'routers':
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
      // load routers needn't nodes
      if (this.activeTab === 'routers') {
        this.loadChild()
        return
      }
      // load nodes
      const requestNode = '/management/nodes'
      httpGet(requestNode).then((response) => {
        this.nodes = {}
        // set default of select
        this.nodeName = response.data.result[0].name || ''
        this.nodes = response.data.result
        // load child with sync
        this.loadChild()
      })
    },
    currentPageChanged(target) {
      this.currentPage = target
      // load child with pagination
      this.loadChild()
    },
    loadChild(reload = false) {
      if (!this.nodeName && this.activeTab !== 'routers') {
        return
      }
      // load child with the currentPage asc
      if (reload) {
        this.currentPage = 1
      }
      this.loading = true
      let requestURL = `/nodes/${this.nodeName}/${this.activeTab}?curr_page=${this.currentPage}&page_size=${this.pageSize}`
      if (this.activeTab === 'routers') {
        requestURL = `/routes?curr_page=${this.currentPage}&page_size=${this.pageSize}`
      }
      httpGet(requestURL).then((response) => {
        this[this.activeTab] = response.data.result.objects
        this.total = response.data.result.total_num || 0
        this.currentPage = response.data.result.current_page
        this.loading = false
      })
    },
    searchChild() {
      if (!this.searchValue) {
        this.$message.error(`${this.searchPlaceholder} required`)
        return
      }
      let requestURL = `/nodes/${this.nodeName}/${this.activeTab}/${this.searchValue}`
      if (this.activeTab === 'routers') {
        requestURL = `/routes/${this.searchValue}`
      }
      this.loading = true
      httpGet(requestURL).then((response) => {
        if (response.data.result.objects.length === 0) {
          this.$message.error('No Data')
        } else {
          this[this.activeTab] = response.data.result.objects
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
.datas-view .el-input.is-disabled .el-input__inner {
  background-color: #292929;
  border-color: #ababab;
}
.datas-view .el-button.is-disabled.is-plain,
.el-button.is-disabled.is-plain:focus,
.el-button.is-disabled.is-plain:hover,
.el-button.is-disabled {
  background-color: #292929;
  border-color: #ababab;
}
</style>
