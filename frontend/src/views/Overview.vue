<template>
  <div class="overview-view">
    <div class="page-title">
      Overview
      <el-select style="float: right" v-model="nodeName" :disabled="loading" placeholder="Select Node" size="small" @change="changeSelect">
        <el-option
          v-for="item in select.nodes"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
    </div>

    <!-- Broker -->
    <el-card class="box-card" style="margin-top: 60px">
      <div slot="header">
        <span>Broker</span>
      </div>
      <el-table :data="brokers" border>
          <el-table-column label="System Name" prop="sysdescr" min-width="160"></el-table-column>
          <el-table-column label="Version" prop="version" min-width="160"></el-table-column>
          <el-table-column label="Uptime" prop="uptime" min-width="300"></el-table-column>
          <el-table-column label="System Time" prop="datetime" min-width="200"></el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <span>Nodes ({{ nodes.length }})</span>
      </div>
      <el-table :data="nodes" border>
        <el-table-column label="Name" prop="name" min-width="200"></el-table-column>
        <el-table-column label="Erlang Processes">
          <el-table-column label="(used/avaliable)" min-width="150" prop="process">
            <template scope="scope">
              {{ scope.row.process_used + ' / ' + scope.row.process_available }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="CPU Info">
          <el-table-column label=" (1load/5load/15load)" min-width="180">
            <template scope="scope">
              {{ scope.row.load1 + ' / ' + scope.row.load5 + ' / ' + scope.row.load15 }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Memory Info" min-width="200">
          <el-table-column label=" (used/total)" min-width="180">
            <template scope="scope">
              {{ scope.row.memory_used + ' / ' + scope.row.memory_total }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="MaxFds" prop="max_fds" min-width="120"></el-table-column>
        <el-table-column label="Status" min-width="120">
          <template scope="props">
            <span v-bind:class="[props.row.node_status === 'Running' ? 'running' : 'stopped', 'status']">
              {{ props.row.node_status }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Stats -->
    <el-card class="box-card">
      <div slot="header">
        <span>Stats</span>
      </div>
      <el-table :data="stats" border>
        <el-table-column label="Name" prop="name" min-width="150"></el-table-column>
        <el-table-column label="Clients/Count" prop="clients/count" min-width="150"></el-table-column>
        <el-table-column label="Clients/Max" prop="clients/max" min-width="150"></el-table-column>
        <el-table-column label="Retained/Count" prop="retained/count" min-width="150"></el-table-column>
        <el-table-column label="Retained/Max	" prop="retained/max" min-width="150"></el-table-column>
        <el-table-column label="Routes/Count" prop="routes/count" min-width="150"></el-table-column>
        <el-table-column label="Routes/Max" prop="routes/max" min-width="150"></el-table-column>
        <el-table-column label="Sessions/Count" prop="sessions/count" min-width="150"></el-table-column>
        <el-table-column label="Subscribers/Count" prop="subscriptions/count" min-width="160"></el-table-column>
        <el-table-column label="Topics/Count" prop="topics/count" min-width="150"></el-table-column>
        <el-table-column label="Topics/Max" prop="topics/max" min-width="150"></el-table-column>
      </el-table>
    </el-card>

    <!-- metrics -->
    <el-card class="box-card">
      <div slot="header">
        <span>Metrics</span>
      </div>
      <el-row :gutter="20"  style="margin-top: -2px">
        <el-col :span="8">
          <el-table :data="metrics.packets">
            <el-table-column
              min-width="200"
              prop="key"
              label="The packets data">
            </el-table-column>
            <el-table-column
              prop="value"
              label="">
            </el-table-column>
          </el-table>
        </el-col>

        <el-col :span="8">
          <el-table :data="metrics.messages">
            <el-table-column
              min-width="200"
              prop="key"
              label="The messages data">
            </el-table-column>
            <el-table-column
              prop="value"
              label="">
            </el-table-column>
          </el-table>
        </el-col>

        <el-col :span="8">
          <el-table :data="metrics.bytes">
            <el-table-column
              min-width="160"
              prop="key"
              label="The bytes data">
            </el-table-column>
            <el-table-column
              prop="value"
              label="">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import {
  Tabs, TabPane, Row, Col, Option,
  TableColumn, Table, Select,
  Button, Popover, Card, Tag,
} from 'element-ui'

import { httpGet } from '../store/api'
import { CURRENT_NODE } from '../store/mutation-types'

export default {
  name: 'overview-view',
  data() {
    return {
      loading: false,
      select: {
        nodeName: '',
        nodes: {},
      },
      nodeName: '',
      brokers: [],
      nodes: [],
      stats: [],
      flag: 0,
      metrics: {
        packets: [],
        messages: [],
        bytes: [],
      },
    }
  },
  components: {
    'el-option': Option,
    'el-select': Select,
    'el-tag': Tag,
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
  mounted() {
    this.refreshInterval()
  },
  created() {
    this.loadNode()
  },
  methods: {
    ...mapActions([CURRENT_NODE]),
    // set global nodeName
    setStore() {
      this.CURRENT_NODE({ nodeName: { current: this.nodeName } })
    },
    // Object2Array, to adaptation the backend
    parseToArray(obj) {
      return new Array(obj)
    },
    // load nodes form store or server then load data
    loadNode() {
      const currentNode = this.$store.state.nodeName.current
      httpGet('/management/nodes').then((response) => {
        // set default of select
        this.nodeName = currentNode || response.data.result[0].name || ''
        this.setStore()
        // could select
        this.select.nodes = response.data.result
        this.loadData()
      })
    },
    // sort
    sortByNodeName(data) {
      let tem = []
      let tempIndex = 0
      data.forEach((item, index) => {
        if (item.name === this.nodeName) {
          tem = item
          tempIndex = index
        }
      })
      data.splice(tempIndex, 1)
      data.unshift(tem)
      return data
    },
    // setInterval to refresh the data
    refreshInterval() {
      window.clearInterval(this.flag)
      this.flag = window.setInterval(this.loadData, 1000 * 10)
    },
    // load data index by nodeName
    loadData() {
      if (this.$route.path !== '/') {
        window.clearInterval(this.flag)
        return
      }
      if (!this.nodeName) {
        // no nodeName, can not load data
        return
      }
      // nodes[]
      httpGet('monitoring/nodes').then((response) => {
        this.nodes = this.sortByNodeName(response.data.result)
      })
      // stats[]
      httpGet(`/monitoring/stats/${this.nodeName}`).then((response) => {
        // the backend is so bad
        response.data.result.name = this.nodeName
        this.stats = this.parseToArray(response.data.result)
      })
      // brokers[]
      httpGet(`/management/nodes/${this.nodeName}`).then((response) => {
        this.brokers = this.parseToArray(response.data.result)
      })
      // metrics[{}, {}, {}]
      httpGet(`/monitoring/metrics/${this.nodeName}`).then((response) => {
        if (response.data.code !== 0) {
          return
        }
        // result is an Object
        const data = response.data.result
        const excludeKeys = ['packets/received', 'packets/sent', 'messages/received', 'messages/sent']
        this.metrics = {
          packets: [{
            key: 'received',
            value: data['packets/received'],
          },
          {
            key: 'sent',
            value: data['packets/sent'],
          }],
          messages: [{
            key: 'received',
            value: data['messages/received'],
          },
          {
            key: 'sent',
            value: data['messages/sent'],
          }],
          bytes: [{
            key: 'received',
            value: data['bytes/received'],
          },
          {
            key: 'sent',
            value: data['bytes/sent'],
          }],
        }
        // received & sent --> a-z ASC
        Object.keys(data).forEach((item) => {
          if (excludeKeys.includes(item)) {
            return
          }
          switch (item.split('/')[0]) {
            case 'packets': this.metrics.packets.push({ key: item.replace('packets/', ''), value: data[item] })
              break
            case 'messages': this.metrics.messages.push({ key: item.replace('messages/', ''), value: data[item] })
              break
            default: break
          }
        })
      })
    },
    // select change
    changeSelect() {
      this.setStore()
      this.loadData()
    },
  },
}
</script>


<style lang="scss">
.overview-view {
  span {
  line-height: 10px;
  }
  padding-top: 20px;
  .box-card {
    margin-top: 20px;
  }
  .el-row {
   margin-top: 20px;
  }
}
.overview-view .status:before {
  content: "";
  display: inline-block;
  height: 8px;
  width: 8px;
  margin-right: 3px;
  border-radius: 4px;
}
</style>
