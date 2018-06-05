<template>
  <div class="instances-view">
    <div class="page-title">
      {{ $t('instances.instances') }}
      <el-button
        class="confirm-btn"
        round
        plain
        type="success"
        icon="el-icon-plus"
        size="medium"
        style="float: right"
        :disable="$store.state.loading"
        @click="handleService">
        {{ $t('instances.createInstance') }}
      </el-button>
    </div>
    <tabs-head></tabs-head>

    <el-row class="instances-list" :gutter="20">
      <el-col
        v-if="displayList.length > 0"
        v-for="(instance, index) in displayList"
        :class="['instance-card', instance.status === 1 ? 'running' : 'stopped']"
        :xs="24"
        :sm="12"
        :lg="8"
        :xl="4"
        :key="index">
        <el-card class="el-card--self" @click.native="$router.push(`/instances/${instance.id}`)">
          <i class="el-icon-close delete-btn" @click.stop="deleteInstance(instance)"></i>
          <!-- card body -->
          <div class="instance-card-top">
            <!-- card icon -->
            <div class="instance-card-icon">
              <i v-if="instance.type === 'auth'" class="fa fa-lock" aria-hidden="true"></i>
              <i v-else-if="instance.type === 'backend'" class="fa fa-floppy-o" aria-hidden="true"></i>
              <i v-else-if="instance.type === 'bridge'" class="fa fa-expand" aria-hidden="true"></i>
              <i v-else-if="instance.type === 'hook'" class="fa fa-toggle-off" aria-hidden="true"></i>
              <i v-else class="fa fa-plug" aria-hidden="true"></i>
            </div>
            <!-- card description -->
            <div class="handleImportCloud">
              <h3>{{ instance.name }}</h3>
            </div>
          </div>
          <!-- card body -->
          <div class="instance-card-details">
            <p>{{ instance.descr }}</p>
            <!-- service details -->
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              :title="instance.service"
              :open-delay="100"
              @show="loadService(instance.service)">
              <div class="instances-service-details" style="min-height: 50px">
                <div v-if="currentService.name">
                  <p class="desc--text">{{ currentService.descr }}</p>
                  <el-tag type="success" size="mini">
                    {{ currentService.instances.running }} {{ $t('instances.running') }}
                  </el-tag>
                  <el-tag type="danger" size="mini">
                    {{ currentService.instances.stopped }} {{ $t('instances.stopped') }}
                  </el-tag>
                  <el-tag type="info" size="mini">
                    {{ currentService.type }}
                  </el-tag>
                </div>
              </div>
              <el-tag slot="reference" type="info" size="mini">
                {{ instance.service }}
              </el-tag>
            </el-popover>
          </div>
          <!-- card footer -->
          <div class="instance-card-footer clear-fix">
            <div v-if="instance.status === 1" class="instance-instance-status">
              <el-tag type="success" size="mini">
                {{ instance.uptime | howLong }}
              </el-tag>
            </div>
            <div v-else class="instance-instance-status">
              <el-tag type="info" size="mini">
                {{ $t('instances.stopped') }}
              </el-tag>
            </div>
            <div class="instance-active-btn">
              <div v-if="instance.status === 1" class="stop-area">
                <el-popover placement="left" :value="popoverVisible">
                  <p>{{ $t('oper.confirmStop') }}</p>
                  <div style="text-align: right; margin: 0">
                    <el-button type="text" class="cache-btn" size="mini" @click="hidePopover">
                      {{ $t('oper.cancel') }}
                    </el-button>
                    <el-button type="success" size="mini" @click.native="handleInstance(false, instance.id)">
                      {{ $t('oper.confirm') }}
                    </el-button>
                  </div>
                  <el-button slot="reference" type="danger" size="mini" @click.stop="">
                    {{ $t('oper.stop') }}
                  </el-button>
                </el-popover>
              </div>
              <el-button v-else type="success" size="mini" @click.stop="handleInstance(true, instance.id)">
                {{ $t('oper.start') }}
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- no list -->
      <el-col v-if="displayList.length === 0" class="blank-block" :span="24">
        <p>{{ $t('error.blank') }}</p>
      </el-col>
    </el-row>

    <el-dialog
      width="600px"
      :title="$t('instances.selectServiceType')"
      :visible.sync="dialogVisible">
      <el-tabs v-model="serviceType" @tab-click="handlerServiceListFilter">
        <el-tab-pane name="auth" :label="`${$t('instances.auth')} ${count.auth ? '(' + count.auth + ')' : ''}`">
          {{ description.auth }}
        </el-tab-pane>
        <el-tab-pane name="backend" :label="`${$t('instances.backend')} ${count.backend ? '(' + count.backend + ')' : ''}`">
          {{ description.backend }}
        </el-tab-pane>
        <el-tab-pane name="bridge" :label="`${$t('instances.bridge')} ${count.bridge ? '(' + count.bridge + ')' : ''}`">
          {{ description.bridge }}
        </el-tab-pane>
        <el-tab-pane name="hook" :label="`${$t('instances.hook')} ${count.hook ? '(' + count.hook + ')' : ''}`">
          {{ description.hook }}
        </el-tab-pane>
        <el-tab-pane name="other" :label="`${$t('instances.other')} ${count.other ? '(' + count.other + ')' : ''}`">
          {{ description.other }}
        </el-tab-pane>
      </el-tabs>

      <div class="service-card">
        <el-table
          class="el-table--public"
          ref="serviceTable"
          :empty-text="$t('instances.emptyText')"
          :data="displayServiceList">
          <el-table-column prop="name" min-width="200px"></el-table-column>
          <el-table-column prop="descr" min-width="160px"></el-table-column>
          <el-table-column>
            <template slot-scope="props">
              <!-- v-if="props.row.instances.running === 0 && props.row.instances.stopped === 0" -->
              <el-radio v-model="serviceName" :disabled="props.row.instances.running > 0 || props.row.instances.stopped > 0" :label="props.row.name" @change="handleCurrentChange(props.row)"></el-radio>
              <!--<el-tag size="mini" type="primary"></el-tag>-->
              <!--<div v-else style="cursor: not-allowed">-->
                <!--{{ $t('instances.exists') }}-->
              <!--</div>-->
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div slot="footer">
        <el-button type="success" class="confirm-btn" size="small" :disabled="!serviceName" @click="$router.push(`/instances/${serviceName}/create`)">
          {{ $t('instances.nextStep') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import TabsHead from './TabsHead'

export default {
  name: 'instances-view',
  components: {
    TabsHead,
  },
  computed: {
    handleDescription() {
      const type = this.filterType.includes(this.$route.query.type) ? this.$route.query.type : 'all'
      return this.description[type]
    },
    state() {
      return Object.keys(this.filterState).includes(this.$route.query.state) ? this.$route.query.state : 'All'
    },
  },
  watch: {
    $route: 'handlerFilter',
  },
  data() {
    return {
      displayStyle: 'card',
      popoverVisible: false,
      stopPopover: false,
      dialogVisible: false,
      filterType: ['auth', 'backend', 'bridge', 'hook'],
      filterState: {
        stopped: 0,
        running: 1,
      },
      serviceType: 'auth',
      serviceName: '',
      currentService: {},
      services: {},
      instanceList: [],
      displayList: [],
      serviceList: [],
      displayServiceList: [],
      description: {
        auth: this.$t('instances.authDesc'),
        backend: this.$t('instances.backendDesc'),
        bridge: this.$t('instances.bridgeDesc'),
        hook: this.$t('instances.hookDesc'),
        other: this.$t('instances.otherDesc'),
      },
      count: {
        auth: 0,
        backend: 0,
        bridge: 0,
        hook: 0,
        other: 0,
      },
    }
  },
  methods: {
    loadData() {
      this.$httpGet('/instances').then((response) => {
        this.instanceList = response.data.items
        this.handlerFilter()
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    hidePopover() {
      this.popoverVisible = true
      setTimeout(() => {
        this.popoverVisible = false
      }, 0)
    },
    loadService(serviceName) {
      if (!serviceName) {
        return
      }
      if (this.services[serviceName]) {
        this.currentService = this.services[serviceName]
        return
      }
      this.currentService = {}
      this.$httpGet(`/services/${serviceName}`).then((response) => {
        this.services[serviceName] = response.data
        this.currentService = response.data
      }).catch()
    },
    handleInstance(start = true, id) {
      if (start) {
        this.$httpPut(`/instances/${id}/start`).then(() => {
          this.$message.success(this.$t('oper.startSuccess'))
          this.loadData()
        }).catch(this.handleError)
      } else {
        this.hidePopover()
        this.$httpPut(`/instances/${id}/stop`).then(() => {
          this.$message.success(this.$t('oper.stopSuccess'))
          this.loadData()
        }).catch(this.handleError)
      }
    },
    handleError(error) {
      this.$message.error(error.message || this.$t('error.networkError'))
    },
    deleteInstance(instance) {
      this.$confirm(this.$t('oper.confirmDelete'), 'Notice', {
        confirmButtonClass: 'confirm-btn',
        confirmButtonText: this.$t('oper.confirm'),
        cancelButtonClass: 'cache-btn el-button--text',
        cancelButtonText: this.$t('oper.cancel'),
        type: 'warning',
      }).then(() => {
        this.$httpDelete(`/instances/${instance.id}`).then(() => {
          this.$message.success(this.$t('oper.deleteSuccess'))
          this.loadData()
        }).catch((error) => {
          this.$message.error(error.message || this.$t('error.networkError'))
        })
      }).catch()
    },
    // filter instances
    handlerFilter() {
      this.displayList = this.instanceList.filter((instance) => {
        // state
        if (Object.keys(this.filterState).includes(this.$route.query.state)) {
          return instance.status === this.filterState[this.$route.query.state]
        }
        return true
      })
    },
    // load all services
    handleService() {
      this.dialogVisible = true
      this.serviceName = ''
      this.$httpGet('/services').then((response) => {
        this.serviceList = response.data.items
        this.handlerServiceListFilter()
      }).catch()
    },
    // filter services
    handlerServiceListFilter() {
      this.serviceName = ''
      this.count = {
        auth: 0,
        backend: 0,
        bridge: 0,
        hook: 0,
        other: 0,
      }
      this.displayServiceList = this.serviceList.filter((item) => {
        const other = !this.filterType.includes(item.type)
        if (other) {
          this.count.other += 1
        } else {
          this.count[item.type] += 1
        }
        if (this.serviceType === 'other') {
          return other
        }
        return this.serviceType === item.type
      })
    },
    handleCurrentChange(row) {
      this.serviceName = row.name
    },
  },
  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
  .instances-view {
    * {
      box-sizing: border-box;
    }
    .instances-desc {
      font-size: 14px;
    }
    .tabs-head, .instances-list {
      margin-top: 24px;
    }
    .instances-list {
      width: 100%;
      .instance-card {
        position: relative;
        margin-top: 20px;
        cursor: pointer;
        text-align: center;
        .el-card {
          transition: all .5s;
          font-size: 14px !important;
          .delete-btn {
            width: 20px;
            height: 20px;
            cursor: pointer;
            position: absolute;
            right: 20px;
            top: 10px;
          }
          .el-card__body {
            padding-bottom: 0;
          }
        }
        &:hover {
          .el-card {
            box-shadow: 0 15px 30px #242327;
          }
        }
        &.stopped {
          .instance-card-name h3 {
            color: #a7a7a7 !important;
          }
        }
        .instance-card-top {
          width: 100%;
          height: 100px;
          text-align: center;
          .instance-card-icon {
            width: 54px;
            height: 54px;
            border: 2px solid #a7a7a7;
            color: #a7a7a7;
            text-align: center;
            border-radius: 50%;
            line-height: 62px;
            margin: 0 auto;
            .fa {
              font-size: 32px;
            }
          }
          .instance-card-name {
            h3 {
              color: #fff;
            }
          }
          .instance-action-btn {
            /*position: absolute;*/
            /*top: 20px;*/
            /*right: 30px;*/
            &.el-button--mini.is-round {
              padding: 7px 15px !important;
            }
            float: right;
            &.active {}
          }
        }
        .instance-card-details {
          clear: both;
          width: 100%;
          height: 60px;
        }
        .instance-card-footer {
          width: 100%;
          height: 60px;
          line-height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .instance-instance-status {
            a {
              margin-right: 10px;
            }
          }
        }
        .instance-active-btn {
          /*visibility: hidden;*/
        }
        &.running {
          .instance-card-icon {
            border: 2px solid #42d885;
            color: #42d885;
          }
        }
        &:hover, &:focus {
          .instance-active-btn {
            visibility: visible;
          }
        }
      }
    }
    .service-card {
      max-height: 320px;
      overflow-y: auto;
      width: 100%;
      margin-top: 10px;
      .el-table__header-wrapper {
        display: none;
      }
      .el-radio__label {
        display: none;
      }
      .el-button {
        display: none;
      }
      .el-card {
        border-radius: 4px;
        border: 1px solid #e4e7ed;
        .el-card__body {
          padding: 0;
        }
        h3 {
          color: #606266;
        }
      }
    }
    .blank-block {
      text-align: center;
      height: 300px;
      line-height: 300px;
    }
  }
</style>
