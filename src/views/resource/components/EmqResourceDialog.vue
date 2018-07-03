<template>
  <el-dialog
    class="emq-resource-dialog"
    width="500px"
    :title="operatorDict[operator]"
    :visible="visible"
    @open="handleOpen"
    @close="handleClose">
    <!-- body -->
    <el-form v-loading="loading" ref="record" :model="record" :rules="rules" :disabled="disabled">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="name" label="资源名称">
            <el-input v-model="record.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="type" label="资源类型">
            <emq-select v-model="record.type" :record="record" :field="{ key: 'resource' }"></emq-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 基本操作 -->
      <el-row :gutter="20">
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


        <el-col>
          <el-form-item label="备注">
            <el-input v-model="record.description" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 操作按钮 -->
    <div class="operation-area" slot="footer">
      <el-button type="text" @click="close">取消</el-button>
      <el-button type="success" @click="handleConfirm">确定</el-button>
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
    type: {
      type: String,
      default: 'kafka',
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
      disabled: false,
      title: '资源',
      resourceID: '',
      record: {
        type: 'kafka',
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
          sentinel: 'mymaster',
        },
        // rabbitmq: {},
      },
      recordStash: {},
      // 当前操作 view edit create
      operator: 'create',
      operatorDict: {
        create: '新建资源',
        edit: '编辑资源',
        view: '详情',
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
    close() {
      this.$emit('update:visible', false)
    },
    handleOpen() {
      // 恢复
      if (this.operator === 'create') {
        this.record = { ...this.recordStash }
      }
      this.loadData()
    },
    handleClose() {
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
      if (this.operator === 'view' && this.resourceID) {
        this.loading = true
        this.$httpGet(`/resource/${this.resourceID}`).then((response) => {
          this.record[this.type] = response.data
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
}
</script>


<style lang="scss">
.emq-resource-dialog {
  .el-form {
    min-height: 240px;
  }
}
</style>
