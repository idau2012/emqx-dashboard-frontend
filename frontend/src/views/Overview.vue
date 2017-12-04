<template>
  <div class="overview-view">
    <div class="page-title">{{ $t('leftbar.overview') }}
      <el-select
        class="select-radius"
        v-model="nodeName"
        :placeholder="$t('select.placeholder')"
        size="small"
        :disabled="loading"
        @change="loadData">
        <el-option
          v-for="item in nodes"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
    </div>

    <!-- Broker -->
     <div class="card-box" style="margin-top: 54px">
       <div class="card-title">{{ $t('overview.broker') }}</div>
       <el-row class="broker-card" :gutter="10">
         <el-col :span="6">
           <div class="card-item">
             <div class="icon">
               <i class="iconfont icon-wendang"></i>
             </div>
             <div class="desc">
               <h3>{{ $t('overview.systemName') }}</h3>
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
               <h3>{{ $t('overview.version') }}</h3>
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
               <h3>{{ $t('overview.uptime') }}</h3>
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
               <h3>{{ $t('overview.systemTime') }}</h3>
               <p>{{ brokers.datetime }}</p>
             </div>
           </div>
         </el-col>
       </el-row>
     </div>

    <!-- Nodes -->
    <div class="card-box">
      <div class="card-title">{{ $t('overview.nodes') }}({{ nodes.length }})</div>
      <el-table :data="nodes" border>
        <el-table-column prop="name" min-width="200" :label="$t('overview.name')">
        </el-table-column>
        <el-table-column :label="$t('overview.erlangProcesses')">
          <el-table-column min-width="150" prop="process" label="(used/avaliable)">
            <template scope="scope">
              {{ scope.row.process_used + ' / ' + scope.row.process_available }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="$t('overview.cpuInfo')">
          <el-table-column min-width="180" label=" (1load/5load/15load)">
            <template scope="scope">
              {{ scope.row.load1 + ' / ' + scope.row.load5 + ' / ' + scope.row.load15 }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column min-width="200" :label="$t('overview.memoryInfo')">
          <el-table-column min-width="180" label=" (used/total)">
            <template scope="scope">
              {{ scope.row.memory_used + ' / ' + scope.row.memory_total }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="max_fds" min-width="120" :label="$t('overview.maxFds')">
        </el-table-column>
        <el-table-column min-width="120" :label="$t('overview.status')">
          <template scope="props">
            <span :class="[props.row.node_status === 'Running' ? 'running' : 'stopped', 'status']">
              {{ props.row.node_status }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Stats -->
    <div class="card-box">
      <div class="card-title">{{ $t('overview.stats') }}</div>
      <el-table :data="stats" border>
        <el-table-column prop="name" min-width="150" :label="$t('overview.name')">
        </el-table-column>
        <el-table-column prop="topics/count" min-width="150" :label="$t('overview.topicsCount')">
        </el-table-column>
        <el-table-column prop="topics/max" min-width="150" :label="$t('overview.topicsMax')">
        </el-table-column>
        <el-table-column prop="clients/count" min-width="150" :label="$t('overview.clientsCount')">
        </el-table-column>
        <el-table-column prop="clients/max" min-width="150" :label="$t('overview.clientsMax')">
        </el-table-column>
        <el-table-column prop="retained/count" min-width="150" :label="$t('overview.retainedCount')">
        </el-table-column>
        <el-table-column prop="retained/max" min-width="150" :label="$t('overview.retainedMax')">
        </el-table-column>
        <el-table-column prop="sessions/count" min-width="150" :label="$t('overview.sessionsCount')">
        </el-table-column>
        <el-table-column prop="sessions/max" min-width="150" :label="$t('overview.sessionsMax')">
        </el-table-column>
        <el-table-column prop="subscriptions/count" min-width="160" :label="$t('overview.subscribersCount')">
        </el-table-column>
        <el-table-column prop="subscriptions/max" min-width="160" :label="$t('overview.subscribersMax')">
        </el-table-column>
      </el-table>
    </div>

    <!-- metrics -->
    <div class="card-box">
      <div class="card-title">{{ $t('overview.metrics') }}</div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-table :data="metrics.packets">
            <el-table-column
              min-width="200"
              prop="key"
              :label="$t('overview.packetsData')">
            </el-table-column>
            <el-table-column prop="value" label=""></el-table-column>
          </el-table>
        </el-col>

        <el-col :span="8">
          <el-table :data="metrics.messages">
            <el-table-column
              min-width="200"
              prop="key"
              :label="$t('overview.messagesData')">
            </el-table-column>
            <el-table-column prop="value" label=""></el-table-column>
          </el-table>
        </el-col>

        <el-col :span="8">
          <el-table :data="metrics.bytes">
            <el-table-column
              min-width="160"
              prop="key"
              :label="$t('overview.bytesData')">
            </el-table-column>
            <el-table-column prop="value" label=""></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>


<script>
import { mapActions } from 'vuex'

import {
  Tabs, TabPane, Row, Col, Option, TableColumn, Table, Select,
  Button, Popover, Card, Tag,
} from 'element-ui'

import { httpGet } from '../store/api'
import { CURRENT_NODE } from '../store/mutation-types'

export default {
  name: 'overview-view',
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
      timer: 0,
      metrics: {
        packets: [],
        messages: [],
        bytes: [],
      },
    }
  },
  methods: {
    ...mapActions([CURRENT_NODE]),
    // set global nodeName
    stashNode() {
      this.CURRENT_NODE({ nodeName: this.nodeName })
    },
    init() {
      // load nodes every page
      httpGet('/nodes').then((response) => {
        // set default of select not clan
        this.nodeName = this.$store.state.node.nodeName || response.data[0].name
        this.nodes = response.data
        this.refreshInterval()
      }).catch((error) => {
        this.loading = false
        this.$message.error(error || this.$t('error.networkError'))
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
    refreshInterval() {
      clearInterval(this.timer)
      this.timer = setInterval(this.loadData, 1000 * 10)
    },
    loadData() {
      if (this.$route.path !== '/') {
        return
      }
      if (!this.nodeName) {
        return
      }
      this.stashNode()
      // nodes[]
      httpGet('/nodes').then((response) => {
        this.nodes = this.sortByNodeName(response.data)
      }).catch((error) => {
        this.loading = false
        this.$message.error(error || this.$t('error.networkError'))
      })
      // stats[]
      httpGet(`/nodes/${this.nodeName}/stats`).then((response) => {
        response.data.name = this.nodeName
        this.stats = [response.data]
      })
      // brokers[]
      httpGet(`/brokers/${this.nodeName}`).then((response) => {
        this.brokers = response.data
      })
      // metrics[{}, {}, {}]
      httpGet(`/nodes/${this.nodeName}/metrics`).then((response) => {
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
            this.metrics[item].push({ key: item2, value: response.data[indexKey] })
          })
        })
      })
    },
  },
  created() {
    this.init()
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer)
    next()
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
      font-size: 16px;
    }
    .el-table {
      margin-top: 0;
    }
    @media screen and (max-width: 1280px) {
      .el-col-6 {
        width: 50% !important;
        margin-top: 10px !important;
      }
    }
    .broker-card {
      &.el-row {
        overflow-x: auto;
      }
      .el-col {
        .card-item {
          height: 90px;
          line-height: 90px;
          padding: 18px 20px 0 20px;
          background-color: #5d5d60;
          /*border: 1px solid red;*/
          .icon {
            float: left;
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
            line-height: normal;
            float: right;
            text-align: right;
            height: 70px;
            h3 {
              font-size: 14px;
              font-weight: bold;
            }
            p {
              margin-top: 12px;
              max-width: 150px;
            }
          }
        }
      }
    }
  }
  span {
    line-height: 10px;
  }
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
