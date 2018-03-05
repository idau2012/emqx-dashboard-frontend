<template>
  <div class="http-api">
    <div class="page-title">{{ $t('leftbar.api') }}</div>
    <el-card>
      <div slot="header">
        <span>{{ $t('httpApi.introduction') }}</span>
      </div>
      <div v-html="$t('httpApi.desc')"></div>
    </el-card>
    <el-card>
      <div slot="header">
        <span v-if="!responseDate">{{ $t('httpApi.reference') }}</span>
        <el-button
          v-if="responseDate"
          type="text"
          size="small"
          class="refresh-btn"
          @click="loadResponse(null, false)">
          <i class="fa fa-reply" aria-hidden="true"></i>
          {{ $t('httpApi.back') }}
        </el-button>
      </div>
      <el-table border v-if="!responseDate" v-loading="loading" :data="tableData">
        <el-table-column prop="method" width="120" :label="$t('httpApi.method')"></el-table-column>
        <el-table-column min-width="160" :label="$t('httpApi.path')">
          <template slot-scope="props">
            <a
              href="javascript:;"
              :class="['link', isLink(props.row) ? '' : 'link-disabled']"
              @click="loadResponse(props.row)">{{ props.row.path }}
            </a>
          </template>
        </el-table-column>
        <el-table-column min-width="240" :label="$t('httpApi.description')">
          <template slot-scope="props">
            <div v-html="props.row.description"></div>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="responseDate"
        class="response-container">
        <div class="response-header">
          <h3>{{ $t('httpApi.linkAddress') }} :
            <a href="javascript:;">{{ uri }}</a>
          </h3>
          <h3>{{ $t('httpApi.data') }} :</h3>
        </div>
        <div v-html="jsonFormatter" class="response.body"></div>
      </div>
    </el-card>
  </div>
</template>


<script>
import { Button, Table, TableColumn, Card } from 'element-ui'

import { httpGet, httpPut, httpPost } from '../store/api'

export default {
  name: 'http-api',
  components: {
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-card': Card,
  },
  data() {
    return {
      loading: false,
      popoverVisible: false,
      nodeName: 'emq@127.0.0.1',
      tableData: [],
      nodes: [],
      responseDate: null,
      scrollTop: 0,
      uri: '',
    }
  },
  computed: {
    /* nodeInfo() {
      return this.$store.state.node.nodeName
    }, */
    jsonFormatter() {
      let json = JSON.stringify(this.responseDate, null, '\t')
      json = json.replace(/\n/g, '<br />')
      json = json.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
      return json
    },
  },
  watch: {
    nodeInfo: 'setApiData',
  },
  methods: {
    isLink(row = {}) {
      // could click
      return row.target && row.target.indexOf(':') === -1
    },
    init() {
      this.loading = true
      const currentNodeName = this.$store.state.node.nodeName
      httpGet('/nodes').then((response) => {
        this.nodeName = currentNodeName || response.data[0].name
        this.nodes = response.data
        this.setApiData()
        this.loading = false
      }).catch((error) => {
        this.loading = false
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    loadResponse(props, isLoad = true) {
      if (!isLoad) {
        this.responseDate = null
        document.documentElement.scrollTop = this.scrollTop
        return
      }
      if (!this.isLink(props)) {
        return
      }
      this.uri = `/api/v2${props.target}`
      this.scrollTop = document.documentElement.scrollTop
      document.documentElement.scrollTop = 0
      switch (props.method) {
        case 'GET': httpGet(props.target).then((response) => {
          this.responseDate = response.data
        }).catch((error) => {
          this.loading = false
          this.$message.error(error || this.$t('error.networkError'))
        })
          break
        case 'POST': httpPost(props.target).then((response) => {
          this.responseDate = response.data
        }).catch((error) => {
          this.loading = false
          this.$message.error(error || this.$t('error.networkError'))
        })
          break
        case 'PUT': httpPut(props.target).then((response) => {
          this.responseDate = response.data
        }).catch((error) => {
          this.loading = false
          this.$message.error(error || this.$t('error.networkError'))
        })
          break
        default: this.responseDate = null
          break
      }
    },
    setApiData() {
      /*
      this.nodeName = this.$store.state.node.nodeName
      const language = getLocalStorage('language') || 'en'
      if (language === 'zh') {
        this.tableData = [
          {
            method: 'GET',
            path: '/api/v2/management/nodes',
            target: '/nodes',
            description: '获取全部节点的基本信息',
          },
          {
            method: 'GET',
            path: '/api/v2/management/nodes/emq@127.0.0.1',
            target: `/management/nodes/${this.nodeName}`,
            description: '获取指定节点的基本信息',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/nodes',
            target: '/monitoring/nodes',
            description: '获取全部节点的监控数据',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/nodes/emq@127.0.0.1',
            target: `/monitoring/nodes/${this.nodeName}`,
            description: '获取指定节点的监控数据',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/clients',
            target: `/nodes/${this.nodeName}/clients`,
            description: '获取指定节点的客户端连接列表',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/clients/{clientid}',
            target: `/nodes/${this.nodeName}/clients/{clientid}`,
            description: '获取节点指定客户端连接的信息',
          },
          {
            method: 'GET',
            path: '/api/v2/clients/{clientid}',
            target: '/clients/{clientid}',
            description: '获取集群内指定客户端的信息',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/sessions',
            target: `/nodes/${this.nodeName}/sessions`,
            description: '获取指定节点的会话列表',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/sessions/{clientid}',
            target: `/nodes/${this.nodeName}/sessions/{clientid}`,
            description: '获取节点上指定客户端的会话信息',
          },
          {
            method: 'GET',
            path: '/api/v2/sessions/{clientid}',
            target: '/sessions/{clientid}',
            description: '获取集群内指定客户端的会话信息',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/subscriptions',
            target: `/nodes/${this.nodeName}/subscriptions`,
            description: '获取某个节点上的订阅列表',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/subscriptions/{clientid}',
            target: `/nodes/${this.nodeName}/subscriptions/{clientid}`,
            description: '获取节点上指定客户端的订阅信息',
          },
          {
            method: 'GET',
            path: '/api/v2/subscriptions/{clientid}',
            target: '/subscriptions/{clientid}',
            description: '获取集群内指定客户端的订阅信息',
          },
          {
            method: 'GET',
            path: '/api/v2/routes',
            target: '/routes',
            description: '获取集群路由表',
          },
          {
            method: 'GET',
            path: '/api/v2/routes/{topic}',
            target: '/routes/{topic}',
            description: '获取集群内指定主题的路由信息',
          },
          {
            method: 'POST',
            path: '/api/v2/mqtt/publish',
            target: '/mqtt/publish',
            description: '发布消息',
          },
          {
            method: 'POST',
            path: '/api/v2/mqtt/subscribe',
            target: '/mqtt/subscribe',
            description: '创建订阅',
          },
          {
            method: 'POST',
            path: '/api/v2/mqtt/unsubscribe',
            target: '/mqtt/unsubscribe',
            description: '取消订阅',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/plugins',
            target: `/nodes/${this.nodeName}/plugins`,
            description: '获取节点的插件列表',
          },
          {
            method: 'PUT',
            path: '/api/v2/nodes/emq@127.0.0.1/plugins/{name}',
            target: `/nodes/${this.nodeName}/plugins/{name}`,
            description: '开启/关闭节点的指定插件',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/listeners',
            target: '/monitoring/listeners',
            description: '获取集群的监听器列表',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/listeners/emq@127.0.0.1',
            target: `/monitoring/listeners/${this.nodeName}`,
            description: '获取指定节点的监听器列表',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/metrics/',
            target: '/monitoring/metrics/',
            description: '获取全部节点的度量指标',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/metrics/emq@127.0.0.1',
            target: `/monitoring/metrics/${this.nodeName}`,
            description: '获取指定节点的度量指标',
          },
          {
            method: 'GET',
            path: 'api/v2/monitoring/stats',
            target: 'api/v2/monitoring/stats',
            description: '获取全部节点的运行统计',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/stats/emq@127.0.0.1',
            target: `/monitoring/stats/${this.nodeName}`,
            description: '获取指定节点的运行统计',
          },
        ]
      } else {
        this.tableData = [
          {
            method: 'GET',
            path: '/api/v2/management/nodes',
            target: '/nodes',
            description: 'List all Nodes in the Cluster',
          },
          {
            method: 'GET',
            path: '/api/v2/management/nodes/emq@127.0.0.1',
            target: `/management/nodes/${this.nodeName}`,
            description: 'Retrieve a Node’s Info',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/nodes',
            target: '/monitoring/nodes',
            description: 'List all Nodes’statistics in the Cluster',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/nodes/emq@127.0.0.1',
            target: `/monitoring/nodes/${this.nodeName}`,
            description: 'Retrieve a node’s statistics',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/clients',
            target: `/nodes/${this.nodeName}/clients`,
            description: 'List all Clients on a Node',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/clients/{client_id}',
            target: `/nodes/${this.nodeName}/clients/{client_id}`,
            description: 'Retrieve a Client on a Node',
          },
          {
            method: 'GET',
            path: '/api/v2/clients/{client_id}',
            target: '/clients/{client_id}',
            description: 'Retrieve a Client in the Cluster',
          },
          {
            method: 'GET',
            path: '/api/v2/node/emq@127.0.0.1/sessions?curr_page=1&page_size=20',
            target: `/node/${this.nodeName}/sessions?curr_page=1&page_size=20`,
            description: 'List all Sessions on a Node',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/sessions/{client_id}',
            target: `/nodes/${this.nodeName}/sessions/{client_id}`,
            description: 'Retrieve a Session on a Node',
          },
          {
            method: 'GET',
            path: '/api/v2/sessions/{client_id}',
            target: '/sessions/{client_id}',
            description: 'Retrieve a Session in the Cluster',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/subscriptions',
            target: `/nodes/${this.nodeName}/subscriptions`,
            description: 'List all Subscriptions of a Node',
          },
          {
            method: 'GET',
            path: '/api/v2/subscriptions/{cliet_id}',
            target: '/subscriptions/{cliet_id}',
            description: 'List Subscriptions of a Client',
          },
          {
            method: 'POST',
            path: '/api/v2/mqtt/subscribe',
            target: '/mqtt/subscribe',
            description: 'Create a Subscription',
          },
          {
            method: 'GET',
            path: '/api/v2/routes',
            target: '/routes',
            description: 'List all Routes in the Cluster',
          },
          {
            method: 'GET',
            path: '/api/v2/routes/{topic}',
            target: '/routes/{topic}',
            description: 'Retrieve a Route in the Cluster',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/plugins/',
            target: `/nodes/${this.nodeName}/plugins/`,
            description: 'List all Plugins of a Node',
          },
          {
            method: 'PUT',
            path: '/api/v2/nodes/plugins/{name}',
            target: '/nodes/plugins/{name}',
            description: 'Start/Stop a Plugin',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/listeners',
            target: '/monitoring/listeners',
            description: 'List all Listeners',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/listeners/emq@127.0.0.1',
            target: `/monitoring/listeners/${this.nodeName}`,
            description: 'List listeners of a Node',
          },
          {
            method: 'POST',
            path: '/api/v2/mqtt/publish',
            target: '/mqtt/publish',
            description: 'Publish MQTT Message',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/metrics/',
            target: '/monitoring/metrics/',
            description: 'Get Metrics of all Nodes',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/metrics/emq@127.0.0.1',
            target: `/monitoring/metrics/${this.nodeName}`,
            description: 'Get Metrics of a Node',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/stats',
            target: '/monitoring/stats',
            description: 'Get Statistics of all Nodes',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/stats/emq@127.0.0.1',
            target: `/monitoring/stats/${this.nodeName}`,
            description: 'Get Statistics of a Node',
          },
        ]
      } */
      // {"name":"list_clients","method":"GET","path":"/clients/",
      // "descr":"A list of all clients in the cluster"}
      httpGet('/').then((response) => {
        this.tableData = []
        let data = JSON.stringify(response.data)
        data = data.replace(/:node/g, this.nodeName)
        data = JSON.parse(data)
        Object.keys(data).forEach((item) => {
          this.tableData.push({
            method: data[item].method,
            path: `/api/v2${data[item].path}`,
            target: data[item].path,
            description: data[item].descr,
          })
        })
      })
    },
  },
  created() {
    this.init()
  },
}
</script>


<style lang="scss">
.http-api {
  margin-top: 0 !important;
  .link-disabled {
    cursor: not-allowed;
  }
  .el-card {
    margin-top: 24px;
  }
  .el-table {
    border-width: 0 !important;
  }
  .refresh-btn {
    cursor: pointer;
    font-size: 16px;
    padding: 0 !important;
  }
  .response-container {
    line-height: 1.5;
    h3 {
      font-size: 14px !important;
    }
    a {
      margin-left: 12px;
    }
  }
}
</style>
