<template>
<div class="http-api">
  <div class="page-title">HTTP API</div>
  <el-card class="box-card">
    <div slot="header">
      <span>Introduction</span>
    </div>
    <div>
      <p>Apart from this help page, all URIs
        will serve only resources of type application/json, and will
        require HTTP basic authentication. The default user is admin/admin.</p>
      <p>The emqx_dashboard plugin provides
          a web management console. The Dashboard helps monitor broker's running status,
          statistics and metrics of MQTT packets.</p>
    </div>
  </el-card>

  <el-card class="box-card" style="margin-top: 30px;">
    <div slot="header">
      <span>Reference</span>
    </div>
    <el-table :data="tableData" border>
        <el-table-column label="GET" prop="get" width="80"></el-table-column>
        <el-table-column label="POST" prop="post" width="80"></el-table-column>
        <el-table-column label="Path" min-width="160">
          <template scope="props">
            <a v-bind:href="''+props.row.target+''" style="color: #227D51" target="_blank">{{ props.row.path }}</a>
          </template>
        </el-table-column>
        <el-table-column label="Description" min-width="240">
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
    }
  },
  methods: {
    ...mapActions([CURRENT_NODE]),
    init() {
      const currentNodeName = this.$store.state.nodeName.current
      httpGet('/management/nodes').then((response) => {
        this.nodeName = currentNodeName || response.data.result[0].name || ''
        // set api data
        this.tableData = [{
          get: 'Y',
          post: 'Y',
          path: '/api/v2/monitoring/stats',
          target: '/api/v2/monitoring/stats',
          description: 'The Statistics of Clients,Sessions, Topics and Subscriptions',
        }, {
          get: 'Y',
          post: 'Y',
          path: '/api/v2/monitoring/nodes',
          target: '/api/v2/monitoring/nodes',
          description: 'List of clustered nodes',
        }, {
          get: 'Y',
          post: 'Y',
          path: '/api/v2/monitoring/metrics/',
          target: '/api/v2/monitoring/metrics/',
          description: 'The broker metrics',
        }, {
          get: 'Y',
          post: 'Y',
          path: '/api/v2/monitoring/listeners',
          target: '/api/v2/monitoring/listeners',
          description: 'List of all TCP listeners',
        }, {
          get: 'Y',
          post: 'Y',
          path: '/api/v2/nodes/emq@127.0.0.1/clients',
          target: `/api/v2/nodes/${this.nodeName}/clients`,
          description: `List of all connected clients. support GET request like this:<br/>
                      http://localhost:18083/api/v2/nodes/emq@127.0.0.1/clients?curr_page=1&page_size=100&client_key=Key`,
        }, {
          get: 'Y',
          post: 'Y',
          path: '/api/v2/nodes/emq@127.0.0.1/sessions',
          target: `/api/v2/nodes/${this.nodeName}/sessions`,
          description: `List of all sessions. support GET request like this:<br/>
                      http://localhost:18083/api/v2/sessions?curr_page=1&page_size=100&client_key=Key`,
        }, {
          get: 'Y',
          post: 'Y',
          path: '/api/v2/routes',
          target: '/api/v2/routes',
          description: `List of all routes. support GET request like this:<br/>
                      http://localhost:18083/api/v2/routes?curr_page=1&page_size=100&topic=Topic`,
        }, {
          get: 'Y',
          post: 'Y',
          path: '/api/v2/nodes/emq@127.0.0.1/subscriptions',
          target: `/api/v2/nodes/${this.nodeName}/subscriptions`,
          description: `List of all Subscriptions. support GET request like this:<br/>
                      http://localhost:18083/api/v2/nodes/emq@127.0.0.1/subscriptions?curr_page=1&page_size=100&client_key=Key`,
        }, {
          get: 'Y',
          post: 'Y',
          path: '/api/v2/nodes/emq@127.0.0.1/plugins',
          target: `/api/v2/nodes/${this.nodeName}/plugins`,
          description: 'Show loaded plugins',
        }, {
          get: 'Y',
          post: 'Y',
          path: '/api/v2/users',
          target: '/api/v2/users',
          description: 'List of all admins',
        }]
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
  padding-top: 20px;
}
.http-api .box-card {
  margin-top: 60px;
}
</style>
