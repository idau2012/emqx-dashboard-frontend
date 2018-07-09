import resource from 'src/template/resource'
<template>
  <div class="emq-resource">
    <div class="page-title">
      资源
      <el-button
        class="confirm-btn"
        round
        plain
        type="success"
        style="float: right"
        icon="el-icon-plus"
        size="medium"
        :disabled="$store.state.loading"
        @click="handleCommand">
        新建
      </el-button>
    </div>

    <el-row class="emq-resource-list card-list" :gutter="40">
      <div v-if="list.length > 0">
        <el-col v-for="(item, index) in 6" :xs="12" :sm="8" :key="index">
          <el-card class="list-card el-card--self btn" shadow="hover">
            <div slot="header">
            <span>
              <!--<i class="fa" :class="[typeIcon[item.type] || 'fa-database', item.running ? 'running' : '']"></i>-->
              {{ item.name || '资源名称' }}
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
            <div class="item btn" @click="handleCommand({ command: 'view', item })">
              <ul>
                <li>
                  服务状态：
                  <i class="status" :class="{ running: item.running }"></i>
                  {{ item.running ? '运行中' : '已停止' }}
                </li>
                <li>
                  服务类型：
                  <!--<i class="fa" :class="typeIcon[item.type] || 'fa-database'"></i>-->
                  {{ typeName[item.type] || '其他' }}
                </li>
                <li>
                  服务器地址：
                  {{ item.server || '127.0.0.1:3306' }}
                </li>
                <li>
                  备注：
                  {{ item.description || 'EMQ 资源测试服务器' }}
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </div>
      <!-- 空 -->
      <div v-else class="blank">
        <div class="icon">
          <i class="fa fa-server"></i>
        </div>
        <h2>资源</h2>
        <p>配置 EMQ 连接到消息存储、设备认证等外部资源。</p>
        <el-button type="success" @click="list.push(1)">新建资源</el-button>
      </div>
    </el-row>

    <!-- 创建 card -->
    <emq-resource-dialog ref="resourceDialog" :visible.sync="dialogVisible"></emq-resource-dialog>
  </div>
</template>


<script>
import EmqResourceDialog from './components/EmqResourceDialog'

export default {
  name: 'emq-resource',
  components: { EmqResourceDialog },
  data() {
    return {
      dialogVisible: false,
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
      list: [],
    }
  },
  methods: {
    loadData() {},
    handleCommand({ command = 'create', item = {} }) {
      const dialog = this.$refs.resourceDialog
      if (command === 'create') {
        dialog.operator = 'create'
        this.dialogVisible = true
      } else if (command === 'edit') {
        const { id, type } = item
        dialog.record.type = type
        dialog.resourceID = id
        dialog.step = 2
        dialog.operator = 'edit'
        this.dialogVisible = true
      } else if (command === 'start') {
        this.$httpPut(`/resource/${item.id}/${item.running ? 'load' : 'unload'}`).then(() => {
          this.$message.success('操作成功')
          this.loadData()
        })
      } else if (command === 'delete') {
        this.$confirm('此操作将停用并删除该资源, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$httpDelete(`/resource/${item.id}`).then(() => {
            this.$message.success('删除成功')
            this.loadData()
          })
        }).catch(() => {})
      } else if (command === 'view') {
        dialog.resourceID = item.id
        dialog.operator = 'view'
        dialog.record.type = item.type
        dialog.step = 2
        this.dialogVisible = true
      }
    },
  },
}
</script>


<style lang="scss">
.emq-resource {
  .emq-resource-list {
    margin-top: 24px;
    .el-card.list-card {
      margin-bottom: 40px;
      .el-card__header {
        border-bottom: none;
        .fa {
          margin-right: 4px;
          color: #42d885;
          &.running {
            color: #42d885;
          }
        }
        .el-dropdown {
          float: right;
        }
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
