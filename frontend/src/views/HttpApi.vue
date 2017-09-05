<template>
<div class="http_api">
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
        <el-table-column label="GET" prop="get" min-width="20"></el-table-column>
        <el-table-column label="POST" prop="post" min-width="34"></el-table-column>
        <el-table-column label="Path" min-width="50">
          <template scope="props">
            <a v-bind:href="''+props.row.path+''" style="color: #227D51" target="_blank">{{ props.row.path }}</a>
          </template>
        </el-table-column>
        <el-table-column label="Description" min-width="200">
          <template scope="props">
            <div v-html="props.row.description"></div>
          </template>
        </el-table-column>
    </el-table>
  </el-card>
</div>
</template>


<script>
import {
  Tabs, TabPane,
  TableColumn, Table,
  Button, Tag, Popover, Card,
} from 'element-ui'


export default {
  name: 'http_api',
  data() {
    return {
      popoverVisible: false,
      tableData: [{
        get: 'Y',
        post: 'Y',
        path: '/api/v2/monitoring/stats',
        description: 'The Statistics of Clients,Sessions, Topics and Subscriptions',
      }, {
        get: 'Y',
        post: 'Y',
        path: '/api/v2/monitoring/nodes',
        description: 'List of clustered nodes',
      }, {
        get: 'Y',
        post: 'Y',
        path: '/api/v2/monitoring/metrics/',
        description: 'The broker metrics',
      }, {
        get: 'Y',
        post: 'Y',
        path: '/api/v2/monitoring/listeners',
        description: 'List of all TCP listeners',
      }, {
        get: 'Y',
        post: 'Y',
        path: '/api/v2/nodes/emq@127.0.0.1/clients',
        description: `List of all connected clients. support GET request like this:<br/>
                      http://localhost:18083/api/v2/nodes/emq@127.0.0.1/clients?curr_page=1&page_size=100&client_key=Key`,
      }, {
        get: 'Y',
        post: 'Y',
        path: '/api/v2/nodes/emq@127.0.0.1/sessions',
        description: `List of all sessions. support GET request like this:<br/>
                      http://localhost:18083/api/v2/sessions?curr_page=1&page_size=100&client_key=Key`,
      }, {
        get: 'Y',
        post: 'Y',
        path: '/api/v2/routes',
        description: `List of all routes. support GET request like this:<br/>
                      http://localhost:18083/api/v2/routes?curr_page=1&page_size=100&topic=Topic`,
      }, {
        get: 'Y',
        post: 'Y',
        path: '/api/v2/nodes/emq@127.0.0.1/subscriptions',
        description: `List of all Subscriptions. support GET request like this:<br/>
                      http://localhost:18083/api/v2/nodes/emq@127.0.0.1/subscriptions?curr_page=1&page_size=100&client_key=Key`,
      }, {
        get: 'Y',
        post: 'Y',
        path: '/api/v2/nodes/emq@127.0.0.1/plugins',
        description: 'Show loaded plugins',
      }, {
        get: 'Y',
        post: 'Y',
        path: '/api/v2/nodes/emq@127.0.0.1/plugins',
        description: 'List of all admins',
      }],
    }
  },
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
}
</script>


<style>
.http_api .el-table th {
  height: 30px;
}
.http_api .el-table {
  border-color: #1f1d1d;
}
.http_api .box-card {
  margin-top: 30px;
}
</style>
