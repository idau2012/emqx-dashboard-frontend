<template>
  <div class="overview-view">
    <div class="page-title">
      Overview
    </div>

    <!-- Broker -->
     <div class="card-box">
       <div class="card-title">
         Broker
       </div>
       <el-row :gutter="10" class="broker-card">
         <el-col :span="6">
           <div class="card-item">
             <div class="icon">
               <i class="iconfont icon-wendang"></i>
             </div>
             <div class="desc">
               <h3>System Name</h3>
               <p>{{ brokers.sysdescr }}</p>
             </div>
           </div>
         </el-col>

         <el-col :span="6">
           <div class="card-item">
             <div class="icon">
               <i class="iconfont icon-banben" style="font-weight: 600"></i>
             </div>
             <div class="desc">
               <h3>Version</h3>
               <p>{{ brokers.version }}</p>
             </div>
           </div>
         </el-col>

         <el-col :span="6">
           <div class="card-item">
             <div class="icon">
               <i class="iconfont icon-shalou"></i>
             </div>
             <div class="desc">
               <h3>Uptime</h3>
               <p>{{ brokers.uptime }}</p>
             </div>
           </div>
         </el-col>

         <el-col :span="6">
           <div class="card-item">
             <div class="icon" style="line-height: 46px">
               <i class="iconfont icon-zhongbiao" style="font-size: 36px;margin-left: 2px"></i>
             </div>
             <div class="desc">
               <h3>System Time</h3>
               <p>{{ brokers.datetime }}</p>
             </div>
           </div>
         </el-col>
       </el-row>
     </div>

    <!-- Nodes -->
    <div class="card-box">
      <div class="card-title">Nodes({{ nodes.length }})</div>
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
    </div>

    <!-- Stats -->
    <div class="card-box">
      <div class="card-title">Stats</div>
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
    </div>

    <!-- metrics -->
    <div class="card-box">
      <div class="card-title">Metrics</div>
      <el-row :gutter="20">
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
    </div>
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
      brokers: {},
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
  watch: {
    $store: 'init',
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions([CURRENT_NODE]),
    // set global nodeName
    setStore() {
      this.CURRENT_NODE({ nodeName: { current: this.nodeName } })
    },
    init() {
      const currentNode = this.$store.state.nodeName.current
      if (!currentNode) {
        httpGet('/management/nodes').then((response) => {
          console.log('load node from api', 'overview')
          // set default of select
          this.nodeName = response.data.result[0].name || ''
          this.setStore()
          this.loadData()
        })
      } else {
        this.nodeName = currentNode
        this.setStore()
        this.loadData()
      }
    },
    // Object2Array, to adaptation the backend
    parseToArray(obj) {
      return new Array(obj)
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
      this.nodeName = this.$store.state.nodeName.current
      if (!this.nodeName) {
        // no nodeName, can not load data
        console.log('overview no nodeName')
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
        this.brokers = response.data.result
      })
      // metrics[{}, {}, {}]
      httpGet(`/monitoring/metrics/${this.nodeName}`).then((response) => {
        if (response.data.code !== 0) {
          return
        }
        this.metrics = {
          packets: [],
          messages: [],
          bytes: [],
        }
        const indexTable = {
          packets: ['received', 'sent', 'connect', 'connack', 'disconnect', 'pingreq', 'pingresp', 'publish/received', 'publish/sent', 'puback/received', 'puback/sent', 'puback/missed', 'pubcomp/received', 'pubcomp/sent', 'pubcomp/missed', 'pubrec/received', 'pubrec/sent', 'pubrec/missed', 'pubrel/received', 'pubrel/sent', 'pubrel/missed', 'subscribe', 'suback', 'unsubscribe', 'unsuback'],
          messages: ['received', 'sent', 'dropped', 'retained', 'qos0/received', 'qos0/sent', 'qos1/received', 'qos1/sent', 'qos2/received', 'qos2/sent', 'qos2/dropped'],
          bytes: ['received', 'sent'],
        }
        Object.keys(indexTable).forEach((item) => {
          indexTable[item].forEach((item2) => {
            const indexKey = `${item}/${item2}`
            this.metrics[item].push({ key: item2, value: response.data.result[indexKey] })
          })
        })
      })
    },
  },
}
</script>


<style lang="scss">
.overview-view {
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .el-select .el-input__inner {
    padding-left: 10px;
  }
  .card-box {
    position: relative;
    margin-top: 74px;
    .card-title {
      position: absolute;
      height: 24px;
      line-height: 24px;
      width: 100%;
      top: -34px;
      left: 0;
      font-size: 18px;
    }
    .el-table {
      margin-top: 0;
    }
    .broker-card {
      &.el-row {
        overflow-x: auto;
      }
      .el-col {
        .card-item {
          height: 90px;
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          align-items: center;
          background-color: #5d5d60;
          .icon {
            width: 54px;
            height: 54px;
            line-height: 50px;
            text-align: center;
            border: 2px solid;
            border-radius: 50%;
            i {
              font-size: 26px;
            }
          }
          .desc {
            text-align: right;
            flex: 1;
            h3 {
              font-size: 14px;
              font-weight: bold;
            }
            p {
              margin-top: 12px;
            }
          }
        }
      }
    }
  }
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
