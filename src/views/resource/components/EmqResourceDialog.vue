<template>
  <el-dialog
    class="emq-resource-dialog"
    width="500px"
    :title="step === 1 ? '选择资源类型' : operatorDict[operator]"
    :visible="visible"
    @open="handleOpen"
    @close="handleClose">
    <!-- type -->
    <el-row v-if="step === 1" class="card-list" style="margin-top: 18px" :gutter="20">
      <el-col v-for="(item, index) in list" :span="12" :key="index">
        <div class="item-card btn" :class="{ active: record.type === item.type }" @click="handleNext(item)">
          <i class="fa card-icon" :class="item.icon"></i>
          <h4>{{ item.name }}</h4>
          <!--<p>{{ item.description }}</p>-->
        </div>
      </el-col>
    </el-row>
    <!-- body -->
    <el-form v-else v-loading="loading" ref="record" :model="record" :rules="disabled ? {} : rules" :disabled="disabled">
      <!-- 基本操作 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="name" label="资源名称">
            <el-input v-model="record.name"></el-input>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">-->
        <!--<el-form-item prop="type" label="资源类型">-->
        <!--<emq-select v-model="record.type" :record="record" :field="{ key: 'resource' }"></emq-select>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!-- Kafka -->
        <div v-if="record.type === 'kafka'">
          <!-- 连接地址 -->
          <el-col :span="12">
            <el-form-item prop="kafka.servers" label="连接地址">
              <el-input v-model="record.kafka.servers" placeholder="servers"></el-input>
            </el-form-item>
          </el-col>

          <!-- Produce -->
          <el-col :span="12">
            <el-form-item prop="kafka.produce" label="Produce">
              <emq-select v-model="record.kafka.produce" :field="{ key: 'kafkaProduce' }" :record="record"></emq-select>
            </el-form-item>
          </el-col>

          <!-- 最大缓冲区大小 -->
          <el-col :span="12">
            <el-form-item prop="kafka.max_buffer_size" label="Max Buffer Size">
              <el-input v-model.number="record.kafka.max_buffer_size" type="number" placeholder="max_buffer_size:10000"></el-input>
            </el-form-item>
          </el-col>

          <!-- 最大缓冲区大小 -->
          <el-col :span="12">
            <el-form-item prop="kafka.max_buffer_ttl" label="Max Buffer TTL">
              <el-input v-model="record.kafka.max_buffer_ttl" placeholder="max_buffer_ttl:1s"></el-input>
            </el-form-item>
          </el-col>
        </div>

        <!-- pgsql -->
        <div v-if="record.type === 'pgsql'">
          <!--连接地址-->
          <el-col :span="12">
            <el-form-item prop="pgsql.server" label="连接地址">
              <el-input v-model="record.pgsql.server"></el-input>
            </el-form-item>
          </el-col>

          <!-- 数据库 -->
          <el-col :span="12">
            <el-form-item prop="pgsql.database" label="数据库">
              <el-input v-model="record.pgsql.database" placeholder="database:platform"></el-input>
            </el-form-item>
          </el-col>

          <!-- 数据库用户名 -->
          <el-col :span="12">
            <el-form-item prop="pgsql.user" label="数据库用户名">
              <el-input v-model="record.pgsql.user" placeholder="user:root"></el-input>
            </el-form-item>
          </el-col>

          <!-- 数据库密码 -->
          <el-col :span="12">
            <el-form-item prop="pgsql.password" label="数据库密码">
              <el-input v-model="record.pgsql.password" placeholder="password:root"></el-input>
            </el-form-item>
          </el-col>

          <!-- pool -->
          <el-col :span="12">
            <el-form-item prop="pgsql.pool" label="连接池大小">
              <el-input v-model.number="record.pgsql.pool" type="number" placeholder="pool:8"></el-input>
            </el-form-item>
          </el-col>

          <!-- ssl -->
          <el-col :span="12">
            <el-form-item prop="pgsql.ssl" label="SSL 连接">
              <emq-select v-model="record.pgsql.ssl" :record="record" :field="{ key: 'booleanType' }"></emq-select>
            </el-form-item>
          </el-col>
          <div v-if="record.pgsql.ssl">
            <!-- 证书文件 -->
            <el-col :span="12">
              <el-form-item prop="pgsql.keyfile" label="keyfile">
                <el-input v-model="record.pgsql.keyfile"></el-input>
              </el-form-item>
            </el-col>
            <!-- 证书 key -->
            <el-col :span="12">
              <el-form-item prop="pgsql.certfile" label="certfile">
                <el-input v-model="record.pgsql.certfile"></el-input>
              </el-form-item>
            </el-col>
          </div>
        </div>

        <!-- webhook -->
        <div v-if="record.type === 'webhook'">
          <!--连接地址-->
          <el-col :span="12">
            <el-form-item prop="webhook.server" label="连接地址">
              <el-input v-model="record.webhook.server"></el-input>
            </el-form-item>
          </el-col>
        </div>


        <!-- mysql -->
        <div v-if="record.type === 'mysql'">
          <!--连接地址-->
          <el-col :span="12">
            <el-form-item prop="mysql.server" label="连接地址">
              <el-input v-model="record.mysql.server"></el-input>
            </el-form-item>
          </el-col>

          <!-- 数据库 -->
          <el-col :span="12">
            <el-form-item prop="mysql.database" label="数据库">
              <el-input v-model="record.mysql.database" placeholder="database:platform"></el-input>
            </el-form-item>
          </el-col>

          <!-- 数据库用户名 -->
          <el-col :span="12">
            <el-form-item prop="mysql.user" label="数据库用户名">
              <el-input v-model="record.mysql.user" placeholder="user:root"></el-input>
            </el-form-item>
          </el-col>

          <!-- 数据库密码 -->
          <el-col :span="12">
            <el-form-item prop="mysql.password" label="数据库密码">
              <el-input v-model="record.mysql.password" placeholder="password:root"></el-input>
            </el-form-item>
          </el-col>

          <!-- pool -->
          <el-col :span="12">
            <el-form-item prop="mysql.pool" label="连接池大小">
              <el-input v-model.number="record.mysql.pool" type="number" placeholder="pool:8"></el-input>
            </el-form-item>
          </el-col>

          <!-- ssl -->
          <el-col :span="12">
            <el-form-item prop="mysql.ssl" label="SSL 连接">
              <emq-select v-model="record.mysql.ssl" :record="record" :field="{ key: 'booleanType' }"></emq-select>
            </el-form-item>
          </el-col>
          <div v-if="record.mysql.ssl">
            <!-- 证书文件 -->
            <el-col :span="12">
              <el-form-item prop="mysql.keyfile" label="keyfile">
                <el-input v-model="record.mysql.keyfile"></el-input>
              </el-form-item>
            </el-col>
            <!-- 证书 key -->
            <el-col :span="12">
              <el-form-item prop="mysql.certfile" label="certfile">
                <el-input v-model="record.mysql.certfile"></el-input>
              </el-form-item>
            </el-col>
          </div>
        </div>
        
        <!-- mongo -->
        <div v-if="record.type === 'mongo'">
          <!--连接地址-->
          <el-col :span="12">
            <el-form-item prop="mongo.server" label="连接地址">
              <el-input v-model="record.mongo.server"></el-input>
            </el-form-item>
          </el-col>

          <!-- 数据库 -->
          <el-col :span="12">
            <el-form-item prop="mongo.database" label="数据库">
              <el-input v-model="record.mongo.database" placeholder="database:platform"></el-input>
            </el-form-item>
          </el-col>

          <!-- 数据库用户名 -->
          <el-col :span="12">
            <el-form-item prop="mongo.login" label="数据库用户名">
              <el-input v-model="record.mongo.login"></el-input>
            </el-form-item>
          </el-col>

          <!-- 数据库密码 -->
          <el-col :span="12">
            <el-form-item prop="mongo.password" label="数据库密码">
              <el-input v-model="record.mongo.password"></el-input>
            </el-form-item>
          </el-col>

          <!-- 数据库密码 -->
          <el-col :span="12">
            <el-form-item prop="mongo.pool" label="连接池大小">
              <el-input v-model.number="record.mongo.pool" type="number" placeholder="pool:8"></el-input>
            </el-form-item>
          </el-col>

          <!-- ssl -->
          <el-col :span="12">
            <el-form-item prop="mongo.ssl" label="SSL 连接">
              <emq-select v-model="record.mongo.ssl" :record="record" :field="{ key: 'booleanType' }"></emq-select>
            </el-form-item>
          </el-col>
          <div v-if="record.mongo.ssl">
            <!-- 证书文件 -->
            <el-col :span="12">
              <el-form-item prop="mongo.keyfile" label="keyfile">
                <el-input v-model="record.mongo.keyfile"></el-input>
              </el-form-item>
            </el-col>
            <!-- 证书 key -->
            <el-col :span="12">
              <el-form-item prop="mongo.certfile" label="certfile">
                <el-input v-model="record.mongo.certfile"></el-input>
              </el-form-item>
            </el-col>
          </div>
        </div>

        <!-- redis -->
        <div v-if="record.type === 'redis'">
          <!--连接地址-->
          <el-col :span="12">
            <el-form-item prop="redis.server" label="连接地址">
              <el-input v-model="record.redis.server"></el-input>
            </el-form-item>
          </el-col>

          <!-- 数据库 -->
          <el-col :span="12">
            <el-form-item prop="redis.database" label="数据库">
              <emq-select v-model.number="record.redis.database" :record="record" :field="{ key: 'redisDatabase' }" placeholder="database:0"></emq-select>
            </el-form-item>
          </el-col>

          <!-- 数据库密码 -->
          <el-col :span="12">
            <el-form-item prop="redis.password" label="数据库密码">
              <el-input v-model="record.redis.password"></el-input>
            </el-form-item>
          </el-col>

          <!-- pool -->
          <el-col :span="12">
            <el-form-item prop="redis.pool" label="连接池大小">
              <el-input v-model.number="record.redis.pool" type="number" placeholder="pool:8"></el-input>
            </el-form-item>
          </el-col>

          <!-- sentinel -->
          <el-col :span="12">
            <el-form-item prop="redis.sentinel" label="Sentinel">
              <el-input v-model="record.redis.sentinel"></el-input>
            </el-form-item>
          </el-col>
        </div>

        <!-- rabbitmq -->
        <div v-if="record.type === 'rabbitmq'"></div>


        <el-col :span="12">
          <el-form-item label="备注">
            <el-input v-model="record.description"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 操作按钮 -->
    <div class="operation-area" slot="footer">
      <div v-if="step === 2 && !disabled">
        <el-button v-if="operator !== 'edit'" type="text" @click="handleLast" icon="el-icon-arrow-left" style="float: left">上一步</el-button>
        <el-button v-if="operator !== 'edit'" type="text" @click="handlePreConnect">测试连接</el-button>
        <el-button type="text" @click="close">取消</el-button>
        <el-button v-if="step === 2 && !disabled" type="success" @click="handleConfirm">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>


<script>
export default {
  name: 'emq-resource-dialog',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    const required = { required: true, message: '请输入' }
    const numberRange = {
      type: 'number',
      min: 1,
      max: 65536,
      message: '1~65536',
    }
    return {
      loading: false,
      title: '资源',
      resourceID: '',
      step: 1,
      list: [
        {
          icon: 'fa-expand',
          name: 'Kafka',
          type: 'kafka',
          description: '',
        },
        {
          icon: 'fa-database',
          name: 'PostgreSQL',
          type: 'pgsql',
          description: '',
        },
        {
          icon: 'fa-database',
          name: 'MySQL',
          type: 'mysql',
          description: '',
        },
        {
          icon: 'fa-floppy-o',
          name: 'Redis',
          type: 'redis',
          description: '',
        },
        {
          icon: 'fa-database',
          name: 'MongoDB',
          type: 'mongo',
          description: '',
        },
        {
          icon: 'fa-toggle-off',
          name: 'WebHook',
          type: 'http',
          description: '',
        },
      ],
      record: {
        type: '',
        kafka: {
          servers: '127.0.0.1:9092',
          produce: 'sync',
          max_buffer_size: 10000,
          max_buffer_ttl: '1s',
          per_partition_workers: 64,
        },
        pgsql: {
          server: '127.0.0.1:5432',
          user: 'root',
          password: 'root',
          database: 'platform',
          encoding: 'utf8',
          pool: 8,
          ssl: false,
          keyfile: '',
          certfile: '',
        },
        webhook: {
          server: ' http://127.0.0.1:9099/rules',
        },
        mysql: {
          server: '127.0.0.1:3306',
          user: 'root',
          password: 'root',
          database: 'platform',
          encoding: 'utf8',
          pool: 8,
          ssl: false,
          keyfile: '',
          certfile: '',
        },
        mongo: {
          server: '127.0.0.1:27017',
          pool: 8,
          database: 'platform',
          login: '',
          password: '',
          ssl: false,
          keyfile: '',
          certfile: '',
        },
        redis: {
          server: '127.0.0.1:6379',
          pool: 8,
          database: 0,
          password: '',
          sentinel: '',
        },
        // rabbitmq: {},
      },
      recordStash: {},
      // 当前操作 view edit create
      operator: 'create',
      operatorDict: {
        create: '初始化配置',
        edit: '编辑资源',
        view: '资源详情',
      },
      rules: {
        type: { required: true, message: '请选择' },
        name: required,
        kafka: {
          servers: required,
          produce: { required: true, message: '请选择' },
          max_buffer_size: numberRange,
        },
        pgsql: {
          server: required,
          user: required,
          // password: required,
          database: required,
          pool: numberRange,
          keyfile: required,
          certfile: required,
        },
        mysql: {
          server: required,
          user: required,
          // password: required,
          database: required,
          pool: numberRange,
          keyfile: required,
          certfile: required,
        },
        mongo: {
          server: required,
          database: required,
          pool: numberRange,
          keyfile: required,
          certfile: required,
        },
        redis: {
          server: required,
          pool: numberRange,
          database: required,
        },
        webhook: {
          server: required,
        },
      },
    }
  },
  methods: {
    handleNext({ type }) {
      if (type) {
        this.record.type = type
        this.step = 2
      }
    },
    handlePreConnect() {
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        const record = { ...this.record[this.record.type] }
        record.name = this.record.name
        record.description = this.record.description
        record.type = this.record.type
        this.$httpPut('/resource/status', record).then(() => {
          this.$message.success('资源可以成功连接！')
        }).catch(() => {})
      })
    },
    handleLast() {
      this.step = 1
    },
    close() {
      this.$emit('update:visible', false)
    },
    handleOpen() {
      // 恢复
      if (this.operator === 'create') {
        this.record = { ...this.recordStash }
        this.step = 1
        return
      }
      this.loadData()
    },
    handleClose() {
      this.record.type = ''
      this.step = 1
      this.$emit('close')
      this.close()
    },
    handleConfirm() {
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        const record = { ...this.record[this.record.type] }
        record.name = this.record.name
        record.description = this.record.description
        record.type = this.record.type
        // update
        if (this.operator === 'edit') {
          this.$httpPut(`/resource/${this.resourceID}`, record).then(() => {
            this.$message.success('编辑成功')
            this.$emit('confirm', record)
            this.handleClose()
          })
        } else if (this.operator === 'create') {
          this.$httpPost(`/resource/${this.resourceID}`, record).then(() => {
            this.$message.success('新建成功')
            this.$emit('confirm', record)
            this.handleClose()
          })
        } else {
          this.$emit('confirm', record)
          this.handleClose()
        }
      })
    },
    // 加载信息
    loadData() {
      // 编辑 查看
      if (['view', 'edit'].includes(this.operator) && this.resourceID) {
        this.step = 2
        this.loading = true
        this.$httpGet(`/resource/${this.resourceID}`).then((response) => {
          this.record[this.record.type] = response.data
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
  },
  created() {
    this.recordStash = { ...this.record }
  },
  computed: {
    disabled() {
      return this.operator === 'view'
    },
  },
}
</script>


<style lang="scss">
.emq-resource-dialog {
  .card-list {
    .item-card {
      margin-top: 20px;
      display: flex;
      align-items: center;
      padding: 10px;
      border: 2px solid #f5f5f5;
      border-radius: 4px;
      transition: all .3s;
      .card-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid #d8d8d8;
        color: #c9c9c9;
        margin-right: 20px;
        text-align: center;
        line-height: 50px;
        font-size: 24px;
        display: inline-block;
        transition: all .3s;
      }
      h4 {
        transition: all .3s;
      }
      &:hover, &.active {
        border-color: #42d885;
        h4 {
          color: #303133;
        }
        .card-icon {
          border-color: #42d885;
          color: #42d885;
        }
      }
    }
  }
  .el-form {
    min-height: 240px;
  }
}
</style>
