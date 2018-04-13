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
    <div class="instances-list">
      <el-row :gutter="20">
        <el-col
          v-for="(instance, index) in displayList"
          :class="['instance-card', instance.status === 1 ? 'running' : 'stopped']"
          :xs="24"
          :sm="12"
          :lg="8"
          :xl="4"
          :key="index">
          <el-card class="el-card--self" @click.native="$router.push(`/instances/${instance.id}`)">
            <!-- card body -->
            <div class="instance-card-top">
              <!-- card icon -->
              <div class="instance-card-icon">
                <i v-if="instance.type === 'auth'" class="fa fa-lock" aria-hidden="true"></i>
                <i v-else-if="instance.type === 'backend'" class="fa fa-floppy-o" aria-hidden="true"></i>
                <i v-else-if="instance.type === 'bridge'" class="fa fa-expand" aria-hidden="true"></i>
                <i v-else-if="instance.type === 'hock'" class="fa fa-toggle-off" aria-hidden="true"></i>
                <i v-else class="fa fa-plug" aria-hidden="true"></i>
              </div>
              <!-- card description -->
              <div class="instance-card-name">
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
                  {{ instance.createAt | howLong }}
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
                      <el-button type="success"  size="mini" @click.native="handleInstance(false)">
                        {{ $t('oper.confirm') }}
                      </el-button>
                    </div>
                    <el-button slot="reference" type="danger" size="mini" @click.stop="">
                      {{ $t('oper.stop') }}
                      <i class="el-icon-close"></i>
                    </el-button>
                  </el-popover>
                </div>
                <el-button v-else type="success" size="mini" @click.stop="handleInstance">
                  $t('oper.start')
                  <i class="el-icon-caret-right"></i>
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog width="500px" :title="$t('instances.selectServiceType')" class="service-list" :visible.sync="dialogVisible">
      <el-tabs v-model="initInstance.serviceType">
        <el-tab-pane name="auth" :label="$t('instances.auth')">
          {{ description.auth }}
          <div class="service-card" >
            <el-table class="el-table--public" :data="serviceList.auth">
              <el-table-column prop="name" min-width="200px"></el-table-column>
              <el-table-column prop="descr" min-width="160px"></el-table-column>
              <el-table-column min-width="100px">
                <template slot-scope="props">
                  <el-button v-if="serviceName !== props.row.name" type="success" size="small" @click="serviceName = props.row.name">
                    {{ $t('instances.select') }}
                  </el-button>
                  <el-button style="display: block" v-if="serviceName === props.row.name" type="danger" size="small" @click="serviceName = ''">
                    {{ $t('instances.selected') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane name="backend" :label="$t('instances.backend')">
          {{ description.backend }}
          <div class="service-card" >
            <el-table class="el-table--public" :data="serviceList.backend">
              <el-table-column prop="name" min-width="200px"></el-table-column>
              <el-table-column prop="descr" min-width="160px"></el-table-column>
              <el-table-column min-width="100px">
                <template slot-scope="props">
                  <el-button v-if="serviceName !== props.row.name" type="success" size="small" @click="serviceName = props.row.name">
                    {{ $t('instances.select') }}
                  </el-button>
                  <el-button style="display: block" v-if="serviceName === props.row.name" type="danger" size="small" @click="serviceName = ''">
                    {{ $t('instances.selected') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane name="bridge" :label="$t('instances.bridge')">
          {{ description.bridge }}
          <div class="service-card" >
            <el-table class="el-table--public" :data="serviceList.bridge">
              <el-table-column prop="name" min-width="200px"></el-table-column>
              <el-table-column prop="descr" min-width="160px"></el-table-column>
              <el-table-column min-width="100px">
                <template slot-scope="props">
                  <el-button v-if="serviceName !== props.row.name" type="success" size="small" @click="serviceName = props.row.name">
                    {{ $t('instances.select') }}
                  </el-button>
                  <el-button style="display: block" v-if="serviceName === props.row.name" type="danger" size="small" @click="serviceName = ''">
                    {{ $t('instances.selected') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane name="hock" :label="$t('instances.hock')">
          {{ description.hock }}
          <div class="service-card" >
            <el-table class="el-table--public" :data="serviceList.hock">
              <el-table-column prop="name" min-width="200px"></el-table-column>
              <el-table-column prop="descr" min-width="160px"></el-table-column>
              <el-table-column min-width="100px">
                <template slot-scope="props">
                  <el-button v-if="serviceName !== props.row.name" type="success" size="small" @click="serviceName = props.row.name">
                    {{ $t('instances.select') }}
                  </el-button>
                  <el-button style="display: block" v-if="serviceName === props.row.name" type="danger" size="small" @click="serviceName = ''">
                    {{ $t('instances.selected') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane name="other" :label="$t('instances.other')">
          {{ description.other }}
          <div class="service-card" >
            <el-table class="el-table--public" :data="serviceList.other">
              <el-table-column prop="name" min-width="200px"></el-table-column>
              <el-table-column prop="descr" min-width="160px"></el-table-column>
              <el-table-column min-width="100px">
                <template slot-scope="props">
                  <el-button v-if="serviceName !== props.row.name" type="success" size="small" @click="serviceName = props.row.name">
                    {{ $t('instances.select') }}
                  </el-button>
                  <el-button style="display: block" v-if="serviceName === props.row.name" type="danger" size="small" @click="serviceName = ''">
                    {{ $t('instances.selected') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
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
  },
  watch: {
    $route: 'handlerFilter',
  },
  data() {
    return {
      state: 'All',
      displayStyle: 'card',
      popoverVisible: false,
      stopPopover: false,
      dialogVisible: false,
      filterType: ['auth', 'backend', 'bridge', 'hock'],
      filterState: {
        stopped: 0,
        running: 1,
      },
      initInstance: {
        serviceType: 'auth',
      },
      serviceName: '',
      currentService: {},
      services: {},
      instanceList: [],
      displayList: [],
      serviceList: {
        auth: [],
        bridge: [],
        backend: [],
        other: [],
      },
      description: {
        auth: this.$t('instances.authDesc'),
        backend: this.$t('instances.backendDesc'),
        bridge: this.$t('instances.bridgeDesc'),
        hock: this.$t('instances.hockDesc'),
        other: this.$t('instances.otherDesc'),
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
    handleInstance(start = true) {
      if (start) {
        this.$message.success('等待后端完成API')
      } else {
        this.hidePopover()
        this.$message.success('等待后端完成API')
      }
      this.loadData()
    },
    loadStateFromUrl() {
      this.state = Object.keys(this.filterState).includes(this.$route.query.state) ? this.$route.query.state : 'All'
    },
    handlerFilter() {
      this.displayList = this.instanceList.filter((instance) => {
        // state
        if (Object.keys(this.filterState).includes(this.$route.query.state)) {
          return instance.status === this.filterState[this.$route.query.state]
        }
        return true
      })
    },
    handleService() {
      this.dialogVisible = true
      this.$httpGet('/services').then((response) => {
        response.data.items.forEach((item) => {
          if (this.filterType.includes(item.type)) {
            this.serviceList[item.type].push(item)
          } else {
            this.serviceList.other.push(item)
          }
        })
      }).catch()
    },
  },
  created() {
    this.loadData()
    this.loadStateFromUrl()
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
    .service-list {
      .service-card {
        max-height: 320px;
        overflow-y: auto;
        width: 100%;
        margin-top: 10px;
        .el-table__header-wrapper {
          display: none;
        }
        .el-button {
          display: none;
        }
        .el-table__row:hover {
          .el-button {
            display: block;
          }
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
    }
  }
</style>
