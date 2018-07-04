<template>
  <div class="emq-rule">
    <div class="page-title">
      消息规则

      <el-button
        class="confirm-btn"
        round
        plain
        type="success"
        icon="el-icon-plus"
        style="float: right"
        :disable="$store.state.loading"
        @click="handleCommand">
        新建
      </el-button>
    </div>

    <el-row class="emq-rule-list cards-lit" :gutter="40">
      <!-- 卡片列表 -->
      <div v-if="list.length > 0">
        <el-col v-for="(item, index) in 6" :xs="12" :sm="8" :key="index">
          <el-card class="list-card el-card--self btn" shadow="hover">
            <div slot="header">
            <span>
              {{ item.name || '规则名称' }}
            </span>
              <!-- 操作 -->
              <el-dropdown placement="bottom" @command="handleCommand">
                <i class="el-icon-more"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{ command: 'edit', item }">编辑</el-dropdown-item>
                  <el-dropdown-item :command="{ command: 'start', item }">
                    {{ item.running ? '禁用' : '启用' }}
                  </el-dropdown-item>
                  <el-dropdown-item :command="{ command: 'delete', item }">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="item btn" @click.stop @click="handleCommand({ command: 'view', item })">
              <ul>
                <li>
                  使用资源：
                  <i class="status btn a-line" :class="{ running: item.running }" @click.stop @click.self="handleResourceView(item)">
                    {{ item.server || 'qingcloud-kafka-3core' }}
                    <span v-show="!item.running" @click.self="handleResourceView(item)">(已停止)</span>
                  </i>
                </li>
                <li>
                  适用主题：
                  {{ item.topic || '#' }}
                </li>
                <li>
                  适用 QoS：
                  {{ item.qos || '任意 QoS' }}
                </li>
                <li>
                  启用时间：
                  {{ item.createAt || '3h 44 min' }}
                </li>
                <li>
                  状态：
                  <el-tag type="success" plain size="mini" style="margin-right: 8px;">{{ item.number || '20' }} 成功</el-tag>
                  <el-tag type="danger" plain size="mini">{{ item.number || 1 }} 失败</el-tag>
                </li>
                <li>
                  备注：
                  {{ item.description || '全部消息' }}
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </div>
      <!-- 空 -->
      <div v-else class="blank">
        <div class="icon">
          <i class="fa fa-random"></i>
        </div>
        <h2>消息规则</h2>
        <p>配置 EMQ 设备消息持久化规则。</p>
        <el-button type="success" @click="list.push(1)">新建规则</el-button>
      </div>
    </el-row>

    <emq-resource-dialog ref="resourceDialog" :visible.sync="dialogVisible"></emq-resource-dialog>
  </div>
</template>


<script>
import EmqResourceDialog from '~/views/resource/components/EmqResourceDialog'

export default {
  name: 'emq-rule',
  components: { EmqResourceDialog },
  data() {
    return {
      dialogVisible: false,
      list: [],
      typeIcon: {
        mysql: 'fa-database',
        pgsql: 'fa-database',
        kafka: 'fa-expand',
        rabbitmq: 'fa-expand',
        webhook: 'fa-toggle-off',
        mongodb: 'fa-database',
        redis: 'fa-database',
      },
      typeName: {
        kafka: 'Kafka',
        pgsql: 'PostgresSQL',
        webhook: 'WebHook',
        mysql: 'MySQL',
        mongodb: 'MongoDB',
        redis: 'Redis',
        rabbitmq: 'RabbitMQ',
      },
    }
  },
  methods: {
    loadData() {},
    handleCommand({ command = 'create', item = {} }) {
      console.log('command', command)
      if (command === 'create') {
        this.$router.push('/rule/0?oper=create')
      } else if (command === 'edit') {
        this.$router.push(`/rule/${item.id}?oper=edit`)
      } else if (command === 'start') {
        this.$httpPut(`/rule/${item.id}/${item.running ? 'load' : 'unload'}`).then(() => {
          this.$message.success('操作成功')
          this.loadData()
        })
      } else if (command === 'delete') {
        this.$confirm('此操作将停用并删除该规则, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$httpDelete(`/rule/${item.id}`).then(() => {
            this.$message.success('删除成功')
            this.loadData()
          })
        }).catch(() => {})
      } else if (command === 'view') {
        this.$router.push(`/rule/${item.id}?oper=view`)
      }
    },
    handleResourceView(item) {
      const dialog = this.$refs.resourceDialog
      dialog.resourceID = item.id
      dialog.operator = 'view'
      this.dialogVisible = true
      console.log(item)
    },
  },
  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
.emq-rule {
  .emq-rule-list {
    margin-top: 24px;
    .el-card.list-card {
      margin-bottom: 40px;
      .el-card__header {
        border-bottom: none;
      }
      .el-dropdown {
        float: right;
      }
      .el-card__body {
        padding-top: 0;
        font-size: 12px;
        font-weight: normal;
        .item {
          ul {
            padding: 0;
            list-style-type: none;
            li {
              margin-bottom: 4px;
            }
          }
          .fa {
            margin-right: 3px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
