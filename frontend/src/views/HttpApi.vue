<template>
<div class="http-api">
  <div class="page-title">{{ $t('leftbar.api') }}</div>
  <el-card class="box-card">
    <div slot="header">
      <span>{{ $t('httpApi.introduction') }}</span>
    </div>
    <div>
      <p>Apart from this help page, all URIs
        will serve only resources of type application/json, and will
        require HTTP basic authentication. The default user is admin/admin.</p>
      <p>The emq_dashboard plugin provides
          a web management console. The Dashboard helps monitor broker's running status,
          statistics and metrics of MQTT packets.</p>
    </div>
  </el-card>

  <el-card class="box-card" style="margin-top: 30px;">
    <div slot="header">
      <span>{{ $t('httpApi.reference') }}</span>
    </div>
    <el-table :data="tableData" border>
        <el-table-column :label="$t('httpApi.method')" prop="method" width="120"></el-table-column>
        <el-table-column :label="$t('httpApi.path')" min-width="160">
          <template scope="props">
            <a :href="isLink(props.row) ?  props.row.target : 'javascript:;'"
               :class="['link', isLink(props.row) ? '' : 'link-disabled']"
               target="_blank">{{ props.row.path }}</a>
          </template>
        </el-table-column>
        <el-table-column :label="$t('httpApi.description')" min-width="240">
          <template scope="props">
            <div v-html="props.row.description"></div>
          </template>
        </el-table-column>
    </el-table>
  </el-card>
</div>
</template>


<script>
import { mapActions } from 'vuex'
import {
  Tabs, TabPane,
  TableColumn, Table,
  Button, Tag, Popover, Card,
} from 'element-ui'

import { httpGet } from '../store/api'
import { CURRENT_NODE } from '../store/mutation-types'


export default {
  name: 'http-api',
  components: {
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-tag': Tag,
    'el-popover': Popover,
    'el-card': Card,
  },
  data() {
    return {
      popoverVisible: false,
      nodeName: 'emq@127.0.0.1',
      tableData: [],
      nodes: [],
    }
  },
  computed: {
    nodeInfo() {
      return this.$store.state.node.nodeName
    },
  },
  watch: {
    nodeInfo: 'setApiData',
  },
  methods: {
    ...mapActions([CURRENT_NODE]),
    // set global nodeName
    setNode() {
      this.CURRENT_NODE({ nodeName: this.nodeName, nodes: this.nodes })
    },
    isLink(row = {}) {
      // could click
      return row.target && row.target.indexOf('{') === -1 && row.method === 'GET'
    },
    init() {
      const currentNodeName = this.$store.state.node.nodeName
      httpGet('/management/nodes').then((response) => {
        this.nodeName = currentNodeName || response.data.result[0].name || ''
        this.nodes = response.data.result
        this.setNode()
        this.setApiData()
      })
    },
    setApiData() {
      this.nodeName = this.$store.state.node.nodeName
      // set api data
      this.tableData = [{
        method: 'GET',
        path: '/api/v2/management/nodes',
        target: '/api/v2/management/nodes',
        description: 'List all Nodes in the Cluster',
      }, {
        method: 'GET',
        path: '/api/v2/management/nodes/emq@127.0.0.1',
        target: `/api/v2/management/nodes/${this.nodeName}`,
        description: 'Retrieve a Node’s Info',
      }, {
        method: 'GET',
        path: '/api/v2/monitoring/nodes',
        target: '/api/v2/monitoring/nodes',
        description: 'List all Nodes’statistics in the Cluster',
      }, {
        method: 'GET',
        path: '/api/v2/monitoring/nodes/emq@127.0.0.1',
        target: `api/v2/monitoring/nodes/${this.nodeName}`,
        description: 'Retrieve a node’s statistics',
      }, {
        method: 'GET',
        path: '/api/v2/nodes/emq@127.0.0.1/clients',
        target: `/api/v2/nodes/${this.nodeName}/clients`,
        description: `List all Clients on a Node. Example Request:<br/>
                      https://host:8080/api/v2/nodes/emq@127.0.0.1/clients?curr_page=1&page_size=20`,
      }, {
        method: 'GET',
        path: '/api/v2/nodes/emq@127.0.0.1/clients/{clientid}',
        target: `/api/v2/nodes/${this.nodeName}/clients/{clientid}`,
        description: 'Retrieve a Client on a Node',
      }, {
        method: 'GET',
        path: '/api/v2/clients/{clientid}',
        target: '/api/v2/clients/{clientid}',
        description: 'Retrieve a Client in the Cluster',
      }, {
        method: 'DELETE',
        path: '/api/v2/clients/{clientid}',
        target: '/api/v2/clients/{clientid}',
        description: '断开集群内指定客户端连接',
      }, {
        method: 'DELETE',
        path: '/api/v2/clients/{clientid}/clean_acl_cache',
        target: '/api/v2/clients/{clientid}/clean_acl_cache',
        description: '清除集群内指定客户端的ACL缓存',
      }, {
        method: 'GET',
        path: '/api/v2/nodes/emq@127.0.0.1/sessions',
        target: `/api/v2/nodes/${this.nodeName}/sessions`,
        description: `List all Sessions on a Node. support GET request like this:<br/>
                      https://host:8080/api/v2/nodes/emq@127.0.0.1/sessions?curr_page=1&page_size=20`,
      }, {
        method: 'GET',
        path: '/api/v2/nodes/emq@127.0.0.1/sessions/{clientid}',
        target: `/api/v2/nodes/${this.nodeName}/sessions/{clientid}`,
        description: 'Retrieve a Session on a Node',
      }, {
        method: 'GET',
        path: '/api/v2/sessions/{clientid}',
        target: '/api/v2/sessions/{clientid}',
        description: 'Retrieve a Session in the Cluster',
      }, {
        method: 'GET',
        path: '/api/v2/nodes/emq@127.0.0.1/subscriptions',
        target: `api/v2/nodes/${this.nodeName}/subscriptions`,
        description: `List all Subscriptions of a Node. support GET request like this:<br/>
                      https://host:8080/api/v2/nodes/emq@127.0.0.1/subscriptions?curr_page=1&page_size=20`,
      }, {
        method: 'GET',
        path: '/api/v2/nodes/emq@127.0.0.1/subscriptions/{clientid}',
        target: `/api/v2/nodes/${this.nodeName}/subscriptions/{clientid}`,
        description: 'List Subscriptions of a Client',
      }, {
        method: 'GET',
        path: '/api/v2/subscriptions/{clientid}',
        target: '/api/v2/subscriptions/{clientid}',
        description: '获取集群内指定客户端的订阅信息',
      }, {
        method: 'GET',
        path: '/api/v2/routes',
        target: '/api/v2/routes',
        description: `List all Routes in the Cluster. support GET request like this:<br/>
                      https://host:8080/api/v2/routes?curr_page=1&page_size=2`,
      }, {
        method: 'GET',
        path: '/api/v2/routes/{topic}',
        target: '/api/v2/routes/{topic}',
        description: 'Retrieve a Route in the Cluster',
      }, {
        method: 'GET',
        path: '/api/v2/mqtt/publish',
        target: '/api/v2/mqtt/publish',
        description: 'Publish MQTT Message',
      }, {
        method: 'GET',
        path: '/api/v2/mqtt/subscribe',
        target: '/api/v2/mqtt/subscribe',
        description: 'Create a Subscription',
      }, {
        method: 'GET',
        path: '/api/v2/mqtt/unsubscribe',
        target: '/api/v2/mqtt/unsubscribe',
        description: '取消订阅',
      }, {
        method: 'GET',
        path: '/api/v2/nodes/emq@127.0.0.1/plugins/',
        target: `/api/v2/nodes/${this.nodeName}/plugins/`,
        description: 'List all Plugins of a Node',
      }, {
        method: 'PUT',
        path: '/api/v2/nodes/emq@127.0.0.1/plugins/{name}',
        target: `/api/v2/nodes/${this.nodeName}/plugins/{name}`,
        description: 'Start/Stop a Plugin',
      }, {
        method: 'GET',
        path: '/api/v2/monitoring/listeners',
        target: '/api/v2/monitoring/listeners',
        description: 'List all Listeners',
      }, {
        method: 'GET',
        path: '/api/v2/monitoring/listeners/emq@127.0.0.1',
        target: `/api/v2/monitoring/listeners/${this.nodeName}`,
        description: 'List listeners of a Node',
      }, {
        method: 'GET',
        path: '/api/v2/monitoring/metrics/',
        target: '/api/v2/monitoring/metrics/',
        description: 'Get Metrics of all Nodes',
      }, {
        method: 'GET',
        path: '/api/v2/monitoring/metrics/emq@127.0.0.1',
        target: `/api/v2/monitoring/metrics/${this.nodeName}`,
        description: 'Get Metrics of a Node',
      }, {
        method: 'GET',
        path: '/api/v2/monitoring/stats',
        target: '/api/v2/monitoring/stats',
        description: 'Get Statistics of all Nodes',
      }, {
        method: 'GET',
        path: '/api/v2/monitoring/stats/emq@127.0.0.1',
        target: `/api/v2/monitoring/stats/${this.nodeName}`,
        description: 'Get Statistics of a Node',
      }, {
        method: 'GET',
        path: '/api/v2/nodes/emq@127.0.0.1/configs',
        target: `/api/v2/nodes/${this.nodeName}/configs`,
        description: '获取全部节点的可修改配置项',
      }, {
        method: 'GET',
        path: '/api/v2/nodes/emq@127.0.0.1/configs',
        target: `/api/v2/nodes/${this.nodeName}/configs`,
        description: '获取指定节点的可修改配置项',
      }, {
        method: 'GET',
        path: '/api/v2/configs/{app_name}',
        target: '/api/v2/configs/{app_name}',
        description: '修改全部节点的配置项',
      }, {
        method: 'GET',
        path: '/api/v2/nodes/emq@127.0.0.1/configs/{app_name}',
        target: `/api/v2/nodes/${this.nodeName}/configs/{app_name}`,
        description: '修改指定节点的配置项',
      }, {
        method: 'GET',
        path: '/api/v2/nodes/emq@127.0.0.1/plugin_configs/{plugin_name}',
        target: `/api/v2/nodes/${this.nodeName}/plugin_configs/{plugin_name}`,
        description: '获取指定节点的制定插件的配置项',
      }, {
        method: 'GET',
        path: '/api/v2/nodes/emq@127.0.0.1/plugin_configs/{plugin_name}',
        target: `/api/v2/nodes/${this.nodeName}/plugin_configs/{plugin_name}`,
        description: '修改指定节点的制定插件的配置项',
      }, {
        method: 'GET',
        path: '/api/v2/users',
        target: '/api/v2/users',
        description: '获取管理用户列表',
      }, {
        method: 'POST',
        path: '/api/v2/users',
        target: '/api/v2/users',
        description: '添加管理用户',
      }, {
        method: 'PUT',
        path: '/api/v2/users/{username}',
        target: '/api/v2/users/{username}',
        description: '修改管理用户信息',
      }, {
        method: 'DELETE',
        path: '/api/v2/users/{username}',
        target: '/api/v2/users/{username}',
        description: '删除管理用户',
      }, {
        method: 'POST',
        path: '/api/v2/auth',
        target: '/api/v2/auth',
        description: '认证管理用户',
      }, {
        method: 'PUT',
        path: '/api/v2/change_pwd/{username}',
        target: '/api/v2/change_pwd/{username}',
        description: '修改管理用户密码',
      }]
    },
  },
  created() {
    this.init()
  },
}
</script>


<style lang="scss">
.http-api {
  padding-top: 20px;
  .link-disabled {
    cursor: not-allowed;
  }
  .box-card {
    margin-top: 60px;
  }
}
</style>
