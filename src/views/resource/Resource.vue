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
        :disabled="$store.state.loading">
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
            <div class="item btn">
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
  </div>
</template>


<script>
export default {
  name: 'emq-resource',
  data() {
    return {
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
    handleCommand({ command, item }) {
      if (command === 'edit') {
        console.log(command, item)
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
      }
    },
  },
  created() {},
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
    .blank {
      max-width: 500px;
      width: 100%;
      margin: 100px auto;
      text-align: center;
      height: 200px;
      .icon {
        width: 80px;
        height: 80px;
        margin: 4px auto;
        border: 2px solid #42d885;
        border-radius: 50%;
        font-size: 36px;
        color: #42d885;
        line-height: 80px;
      }
    }
  }
}
</style>
