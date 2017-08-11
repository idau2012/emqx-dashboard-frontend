<template>
  <div class="alerts-view">
    <div class="page-title">{{ activeTab }}</div>

    <el-tabs @tab-click="handleClick" v-model="activeTab">
      <el-tab-pane label="History" name="history"></el-tab-pane>
      <el-tab-pane label="Triggers" name="triggers"></el-tab-pane>
      <el-tab-pane label="Actions" name="actions"></el-tab-pane>
    </el-tabs>

    <el-table :data="history" v-loading="loading" v-show="activeTab==='history'" border>
      <el-table-column prop="labels.severity" label="Severity">
        <template scope="scope">
          <el-tag type="danger" v-if="scope.row.labels.severity==='critical'">critical</el-tag>
          <el-tag type="major" v-if="scope.row.labels.severity==='major'">major</el-tag>
          <el-tag type="warning" v-if="scope.row.labels.severity==='minor'">minor</el-tag>
          <el-tag type="success" v-if="scope.row.labels.severity==='warning'">warning</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="labels.alertname" label="Event"></el-table-column>
      <el-table-column prop="annotations.value" label="Value"></el-table-column>
      <el-table-column prop="labels.instance" label="Instance"></el-table-column>
      <el-table-column prop="startsAt" label="Starts At">
        <template scope="scope">
          <span>{{ scope.row.startsAt | dateFormat }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-table :data="triggers" v-show="activeTab==='triggers'" border>
      <el-table-column prop="name" label="Trigger Name"></el-table-column>
      <el-table-column prop="metric" label="Metric"></el-table-column>
      <el-table-column prop="condition" label="Condition"></el-table-column>
      <el-table-column prop="severity" label="Severity">
        <template scope="scope">
          <el-tag type="danger" v-if="scope.row.severity==='critical'">critical</el-tag>
          <el-tag type="major" v-if="scope.row.severity==='major'">major</el-tag>
          <el-tag type="warning" v-if="scope.row.severity==='minor'">minor</el-tag>
          <el-tag type="success" v-if="scope.row.severity==='warning'">warning</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="oper" label="Oper">
        <template scope="props">
          <el-popover placement="right" :value="popoverVisible">
            <p>Confirm {{ props.row.active ? 'disable' : 'enable' }} this trigger？</p>
            <div style="text-align: right">
              <el-button size="mini" type="text" @click="hidePopover">Cancel</el-button>
              <el-button size="mini" type="success" @click="update(props.row)">Confirm</el-button>
            </div>
            <el-button slot="reference" :type="props.row.active ? 'warning' : 'success'" size="mini">
              {{ props.row.active ? 'Disable' : 'Enable' }}
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>


<script>
// import { httpGet } from '../store/api'
import {
  Tabs, TabPane,
  TableColumn, Table,
  Button, Tag, Popover,

} from 'element-ui'
import axios from 'axios'

export default {
  name: 'alerts-view',
  data() {
    return {
      loading: false,
      activeTab: 'history',
      popoverVisible: false,
      history: [],
      triggers: [
        {
          name: 'high_cpu_used',
          metric: 'host cpu',
          condition: '> 60%',
          severity: 'minor',
          active: true,
        }, {
          name: 'high_mem_used',
          metric: 'host memory',
          condition: '> 80%',
          severity: 'warning',
          active: true,
        }, {
          name: 'too_many_clients',
          metric: 'connected clients',
          condition: '> 100000',
          severity: 'major',
          active: true,
        },
      ],
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
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true
      // httpGet('/alerts').then((response) => {
      //   this[this.activeTab] = response.data.data
      //   this.loading = false
      // })
      axios.get('/alertmanager/alerts')
        .then((response) => {
          this[this.activeTab] = response.data.data
          this.loading = false
        }).catch(() => {
          this.$message.error('Loading failure!')
        })
    },
    handleClick(tab) {
      if (tab.name === 'history') {
        this.activeTab = tab.name
        this.loadData()
      }
    },
    hidePopover() {
      this.popoverVisible = true
      setTimeout(() => {
        this.popoverVisible = false
      }, 0)
    },
    update(row) {
      this.hidePopover()
      console.log(row)
    },
  },
}
</script>


<style>
.alerts-view .el-tag {
  background-color: transparent;
  width: 56px;
  text-align: center;
}
.alerts-view .el-tag--major {
  border-color: rgba(245, 124, 0, 0.2);
  color: #ef6c00;
}
</style>
