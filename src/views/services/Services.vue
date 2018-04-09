<template>
  <div class="services-view">
    <div class="page-title">
      {{ $t('leftbar.services') }}
    </div>
    <tabs-head></tabs-head>

    <!-- filter -->
    <el-row type="flex" justify="space-between" align="middle" style="margin: 10px auto">
      <div class="desc--text services-desc">
        {{ handleDescription }}
      </div>
      <el-radio-group v-model="state" size="mini" @change="handlerStateFilter">
        <el-radio-button label="All"></el-radio-button>
        <el-radio-button label="Running"></el-radio-button>
        <el-radio-button label="Stopped"></el-radio-button>
      </el-radio-group>
    </el-row>
    <div class="services-list">
      <el-row :gutter="20">
        <el-col
          v-for="(service, index) in displayList"
          :class="['service-card', service.status === 1 ? 'running' : 'stopped']"
          :xs="24"
          :sm="12"
          :lg="8"
          :key="index">
          <el-card class="el-card--self" @click.native="$router.push(`/services/${service.name}`)">
            <!-- card body -->
            <div class="service-card-top">
              <!-- card icon -->
              <div class="service-card-icon">
                <i v-if="service.type === 'auth'" class="fa fa-lock" aria-hidden="true"></i>
                <i v-else-if="service.type === 'backend'" class="fa fa-floppy-o" aria-hidden="true"></i>
                <i v-else-if="service.type === 'bridge'" class="fa fa-expand" aria-hidden="true"></i>
                <i v-else-if="service.type === 'hock'" class="fa fa-toggle-off" aria-hidden="true"></i>
                <i v-else class="fa fa-plug" aria-hidden="true"></i>
              </div>
              <!-- card description -->
              <div class="service-card-name">
                <h3>{{ service.name }}</h3>
              </div>
            </div>
            <!-- card body -->
            <div class="service-card-details">
              <p>{{ service.descr }}</p>
              <!--<p>-->
                <!--Running on {{ service.nodes.join(', ') }}-->
              <!--</p>-->
            </div>
            <!-- card footer -->
            <div class="service-card-footer clear-fix">
              <div v-if="service.status === 1" class="service-instance-status">
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  popper-class="popover-details"
                  @hide="popoverLoading = false"
                  @show="handleTagDetails">
                  <!-- details list -->
                  <div v-loading="popoverLoading">
                    <p>实例 1 <el-button size="mini" type="danger">停止</el-button></p>
                    <p>实例 2 <el-button size="mini" type="danger">停止</el-button></p>
                    <p>实例 3 <el-button size="mini" type="danger">停止</el-button></p>
                  </div>
                  <router-link slot="reference" class="running-btn" :to="`/services/${service.name}/instance?state=running`">
                    <el-tag type="success" size="mini">
                      {{ service.instances.running }} Running
                    </el-tag>
                  </router-link>
                </el-popover>
                <router-link class="stopped-btn" :to="`/services/${service.name}/instance?state=stopping`">
                  <el-tag type="danger" size="mini">
                    {{ service.instances.stopping }} Stopped
                  </el-tag>
                </router-link>
              </div>
              <div v-else class="service-instance-status">
                <el-tag type="info" size="mini">
                  Service Stopped
                </el-tag>
              </div>
              <div class="service-active-btn">
                <el-button v-if="service.status === 0" size="mini" type="success" icon="el-icon-caret-right">
                  启用
                </el-button>
                <el-popover
                  v-else
                  placement="top"
                  trigger="click"
                  width="160">
                  <p>确定停用？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="stopPopover = false">取消</el-button>
                    <el-button type="primary" size="mini">确定</el-button>
                  </div>
                  <el-button slot="reference" size="mini" type="danger" icon="el-icon-close" @click.stop="">
                    停用
                  </el-button>
                </el-popover>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>


<script>
import { Card, Row, Col, Button, Dropdown, DropdownItem, DropdownMenu, Tag, Popover } from 'element-ui'

import TabsHead from './TabsHead'

export default {
  name: 'services-view',
  components: {
    'el-card': Card,
    'el-row': Row,
    'el-col': Col,
    'el-button': Button,
    'el-dropdown': Dropdown,
    'el-dropdown-item': DropdownItem,
    'el-dropdown-menu': DropdownMenu,
    'el-tag': Tag,
    'el-popover': Popover,
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
      popoverLoading: false,
      stopPopover: false,
      filterType: ['auth', 'backend', 'all', 'bridge', 'hock', 'other'],
      filterState: {
        Stopped: 0,
        Running: 1,
      },
      serviceList: [],
      displayList: [],
      description: {
        all: 'Services 为 EMQ 添加扩展功能，提供 ALC 认证发布鉴权、系统监控、消息持久化等服务。',
        auth: '提供登录认证与发布订阅 ACL 服务。',
        backend: '提供消息持久化到数据库服务。',
        bridge: '提供将消息流桥接为消息中间件数据源服务。',
        hock: '使用触发回调机制响应操作的服务。',
        other: '系统运行信息等其他服务。',
      },
    }
  },
  methods: {
    loadData() {
      this.$httpGet('/services').then((response) => {
        this.serviceList = response.data.items
        this.handlerFilter()
      }).catch((error) => {
        this.$message.error(error || '网络错误')
      })
    },
    loadStateFromUrl() {
      this.state = Object.keys(this.filterState).includes(this.$route.query.state) ? this.$route.query.state : 'All'
    },
    handlerStateFilter() {
      this.$router.push({
        path: this.$route.path,
        query: { ...this.$route.query, state: this.state },
      })
    },
    handlerFilter() {
      this.displayList = this.serviceList.filter((service) => {
        const type = this.filterType.includes(this.$route.query.type) ? this.$route.query.type : service.type
        // state
        if (Object.keys(this.filterState).includes(this.$route.query.state)) {
          return service.type === type && service.status === this.filterState[this.$route.query.state]
        }
        return service.type === type
      })
    },
    handleTagDetails() {
      this.popoverLoading = true
      setTimeout(() => {
        this.popoverLoading = false
      }, 600)
    },
  },
  created() {
    this.loadData()
    this.loadStateFromUrl()
  },
}
</script>


<style lang="scss">
  .services-view {
    * {
      box-sizing: border-box;
    }
    .services-desc {
      font-size: 14px;
    }
    .tabs-head, .services-list {
      margin-top: 24px;
    }
    .services-list {
      width: 100%;
      .service-card {
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
        .service-card-top {
          width: 100%;
          height: 100px;
          text-align: center;
          .service-card-icon {
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
          .service-card-name {
            h3 {
              color: #fff !important;
            }
          }
          .service-action-btn {
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
        .service-card-details {
          clear: both;
          width: 100%;
          height: 60px;
        }
        .service-card-footer {
          width: 100%;
          height: 60px;
          line-height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .service-instance-status {
            a {
              margin-right: 10px;
            }
          }
        }
        .service-active-btn {
          /*visibility: hidden;*/
        }
        &.running {
          .service-card-icon {
            border: 2px solid #42d885;
            color: #42d885;
          }
        }
        &:hover, &:focus {
          .service-active-btn {
            visibility: visible;
          }
        }
      }
    }
  }
</style>
