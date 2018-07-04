<template>
  <div class="emq-rule-details">
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/rule' }">消息规则</el-breadcrumb-item>
        <el-breadcrumb-item class="breadcrumb-name">
          {{ $route.query.oper === 'edit' ? '编辑' : '新建' }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card class="emq-rule-form el-card--self" shadow="never">
      <el-form ref="record" :disabled="disabled" :model="record" :rules="disabled ? {} : rules" label-width="80px" label-position="top">
        <div class="card-header--like" style="padding-top: 0">
          基础配置
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="name" label="规则名称">
              <el-input v-model="record.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="events" label="消息类型">
              <emq-select v-model="record.events" :record="record" :field="{ key: 'messageEvents' }" @change="handleTypeChange"></emq-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="filter" label="消息主题">
              <el-input v-model="record.filter" placeholder="#"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="qos" label="QoS">
              <emq-select
                v-model.number="record.qos"
                :record="record"
                :field="{ key: 'qos' }"
                placeholder="全部">
              </emq-select>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item prop="description" label="备注">
              <el-input v-model="record.description" type="textarea"></el-input>
            </el-form-item>
          </el-col>

        </el-row>


        <div class="card-header--like">
          规则详情
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="resource" label="关联资源">
              <span slot="label">
                关联资源
                <!-- 刷新 -->
                <i class="fa fa-refresh tips btn" style="margin: 0 10px" @click="loadResource"></i>
                <el-button type="text" @click="handleCreate">新建资源</el-button>
              </span>
              <el-select v-model="record.resource" @change="handleResource">
                <el-option v-for="(item, index) in list" :key="index" :label="item.name" :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; font-size: 13px">{{ item.typeName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--&lt;!&ndash; 刷新 &ndash;&gt;-->
          <!--<el-col :span="12">-->
            <!--<el-form-item>-->
              <!--<span slot="label">-->
                <!--&nbsp;&nbsp;-->
              <!--</span>-->
              <!--<i class="el-icon-refresh btn" style="margin-right: 10px" title="刷新" @click="loadResource"></i>-->
              <!--<el-button type="text" @click="handleCreate">新建资源</el-button>-->
            <!--</el-form-item>-->
          <!--</el-col>-->

          <!-- kafka -->
          <div v-if="record.type === 'kafka'">
            <el-col :span="12">
              <el-form-item prop="kafka.action" label="Kafka 主题">
                <el-input v-model="record.kafka.action" :placeholder="`action:${record.events}`"></el-input>
              </el-form-item>
            </el-col>


            <el-col :span="12">
              <el-form-item prop="kafka.strategy" label="parition strategy">
                <emq-select
                  v-model="record.kafka.strategy"
                  :record="record"
                  :field="{ key: 'paritionStrategy' }">
                </emq-select>
              </el-form-item>
            </el-col>

            <el-col  v-if="record.kafka.strategy === 'custom'" :span="12">
              <!-- 自定义 key -->
              <el-form-item prop="kafka.partitionKey" label="partition key">
                <el-input v-model="record.kafka.partitionKey"></el-input>
              </el-form-item>
            </el-col>

            <el-col>
              <el-form-item prop="kafka.template">
                <span slot="label">
                  消息模板
                  <el-popover
                    placement="right"
                    width="200"
                    trigger="hover">
                    当前消息内容，使用占位符获取消息参数。
                    <i slot="reference" class="fa fa-question-circle-o tips" aria-hidden="true"></i>
                    </el-popover>
                </span>
                <sql-editor v-model="record.kafka.template" class="el-textarea__inner" :disabled="disabled"></sql-editor>
              </el-form-item>
            </el-col>
          </div>

          <!-- sql -->
          <div v-if="['pgsql', 'mysql'].includes(record.type)">
            <el-col>
              <el-form-item prop="sql.sql" label="操作 SQL">
                <span slot="label">
                  操作 SQL
                  <el-popover
                    placement="right"
                    width="200"
                    trigger="hover">
                    消息记录至数据库的 SQL 语句，使用占位符获取消息参数。
                    <i slot="reference" class="fa fa-question-circle-o tips" aria-hidden="true"></i>
                    </el-popover>
                </span>
                <sql-editor v-model="record.sql.sql" class="el-textarea__inner" :disabled="disabled"></sql-editor>
              </el-form-item>
            </el-col>
          </div>

          <!-- nosql -->
          <div v-if="record.type === 'mongo'">
            <el-col :span="12">
              <el-form-item prop="mongo.collection" label="MongoDB 集合">
                <el-input v-model="record.mongo.collection"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
            <el-form-item prop="mongo.template">
                <span slot="label">
                  消息模板
                  <el-popover
                    placement="right"
                    width="200"
                    trigger="hover">
                    当前消息内容，使用占位符获取消息参数。
                    <i slot="reference" class="fa fa-question-circle-o tips" aria-hidden="true"></i>
                    </el-popover>
                </span>
              <sql-editor v-model="record.mongo.template" class="el-textarea__inner" :disabled="disabled"></sql-editor>
            </el-form-item>
          </el-col>
          </div>

          <!-- http -->
          <div v-if="record.type === 'http'">
            <el-col :span="12">
              <el-form-item prop="http.method" label="请求方法">
                <emq-select v-model="record.http.method" :record="record" :field="{ key: 'method' }"></emq-select>
              </el-form-item>
            </el-col>

            <!-- 请求头 -->
            <el-col>
              <el-form-item prop="http.header">
                <span slot="label">
                  请求头
                  <el-popover
                    placement="right"
                    width="200"
                    trigger="hover">
                    自定义请求头并携带认证信息。
                    <i slot="reference" class="fa fa-question-circle-o tips" aria-hidden="true"></i>
                    </el-popover>
                </span>
                <sql-editor v-model="record.http.header" class="el-textarea__inner" :disabled="disabled"></sql-editor>
              </el-form-item>
            </el-col>

            <!-- URL -->
            <el-col>
              <el-form-item prop="http.query">
                <span slot="label">
                  URL 参数
                  <el-popover
                    placement="right"
                    width="200"
                    trigger="hover">
                    自定义 URL 参数。
                    <i slot="reference" class="fa fa-question-circle-o tips" aria-hidden="true"></i>
                    </el-popover>
                </span>
                <sql-editor v-model="record.http.query" class="el-textarea__inner" :disabled="disabled"></sql-editor>
              </el-form-item>
            </el-col>

            <!-- 请求体 -->
            <el-col v-if="['POST', 'PUT'].includes(record.http.method)">
              <el-form-item prop="http.body">
                <span slot="label">
                  请求体
                  <el-popover
                    placement="right"
                    width="200"
                    trigger="hover">
                    当前请求信息，使用占位符获取消息参数。
                    <i slot="reference" class="fa fa-question-circle-o tips" aria-hidden="true"></i>
                    </el-popover>
                </span>
                <sql-editor v-model="record.http.body" class="el-textarea__inner" :disabled="disabled"></sql-editor>
              </el-form-item>
            </el-col>
          </div>

        </el-row>
      </el-form>

      <el-row v-if="!disabled" :gutter="20">
        <el-col class="operation-area" style="margin-top: 24px">
          <el-button type="success" style="margin-right: 20px" @click="handleUpdate">确定</el-button>
          <el-button type="text">取消</el-button>
        </el-col>
      </el-row>
    </el-card>

    <emq-resource-dialog ref="dialogVisible" :visible.sync="dialogVisible" @comfirm="loadResource"></emq-resource-dialog>
  </div>
</template>


<script>
import SqlEditor from '~/components/SQLEditor'
import EmqResourceDialog from '~/views/resource/components/EmqResourceDialog'

export default {
  name: 'emq-rule-details',
  components: { SqlEditor, EmqResourceDialog },
  data() {
    const required = { required: true, message: '请输入' }
    return {
      dialogVisible: false,
      typeName: {
        kafka: 'Kafka',
        pgsql: 'PostgresSQL',
        webhook: 'WebHook',
        mysql: 'MySQL',
        mongodb: 'MongoDB',
        redis: 'Redis',
        rabbitmq: 'RabbitMQ',
      },
      // 资源列表
      list: [
        {
          id: 1,
          name: 'qingcloud-kafka 3core',
          type: 'kafka',
          typeName: 'Kafka',
        },
        {
          id: 2,
          name: 'qingcloud-pgsql',
          type: 'pgsql',
          typeName: 'PgSQL',
        },
        {
          id: 3,
          name: 'qingcloud-mysql',
          type: 'mysql',
          typeName: 'MySQL',
        },
        {
          id: 4,
          name: 'API-Cloud',
          type: 'http',
          typeName: 'WebHook',
        },
        {
          id: 5,
          name: 'Local Mongo',
          type: 'mongo',
          typeName: 'MongoDB',
        },
      ],
      record: {
        events: 'on_message_published',
        resource: 1,
        type: 'kafka',
        filter: '#',
        qos: null,
        kafka: {
          action: 'on_message_publish',
          strategy: 'random',
          partitionKey: '',
          template: JSON.stringify({
            client_id: '{{client_id}}',
            username: '{{username}}',
            topic: '{{topic}}',
            payload: '{{payload}}',
            protocol: '{{protocol}}',
            qos: '{{qos}}',
            node: '{{node}}',
            ts: '{{ts}}',
            custom: 'This is custom field',
          }, null, 2),
        },
        sql: {
          sql: `INSERT INTO
emq_message (client_id, topic, qos, payload)
VALUES ( \`{{client_id}}\`, \`{{topic}}\`, \`{{qos}}\`, \`{{payload}}\` )
`,
        },
        mongo: {
          collection: 'emq_mesage',
          template: JSON.stringify({
            client_id: '{{client_id}}',
            username: '{{username}}',
            topic: '{{topic}}',
            payload: '{{payload}}',
            protocol: '{{protocol}}',
            qos: '{{qos}}',
            node: '{{node}}',
            ts: '{{ts}}',
            custom: 'This is custom field',
          }, null, 2),
        },
        http: {
          method: 'POST',
          query: JSON.stringify({
            client_id: '{{client_id}}',
          }, null, 2),
          body: JSON.stringify({
            client_id: '{{client_id}}',
            username: '{{username}}',
            topic: '{{topic}}',
            payload: '{{payload}}',
            protocol: '{{protocol}}',
            qos: '{{qos}}',
            node: '{{node}}',
            ts: '{{ts}}',
            custom: 'This is custom field',
          }, null, 2),
          header: JSON.stringify({ 'Content-Type': 'application/json', token: '' }, null, 2),
        },
      },
      rules: {
        name: required,
        events: required,
        type: required,
        resource: required,
        qos: required,
        filter: required,
        kafka: {
          action: required,
          strategy: required,
          partitionKey: required,
          template: required,
        },
        sql: {
          sql: required,
        },
        mongo: {
          collection: required,
          template: required,
        },
        http: {
          method: required,
          header: required,
        },
      },
    }
  },
  methods: {
    handleCreate() {
      this.dialogVisible = true
    },
    handleTypeChange(value) {
      this.$set(this.record.kafka, 'action', value)
    },
    loadData() {
      const accessType = this.$route.query.oper
      if (['edit', 'view'].includes(accessType)) {
        this.$httpGet(`/rule/${this.$router.params.id}`).then((response) => {
          this.record = response.data
        })
      }
    },
    // 动态改变表单
    handleResource(key) {
      console.log(key)
      const item = this.list.find($ => $.id === key)
      this.record.type = item && item.type
    },
    // 加载可用资源
    loadResource() {
      this.$httpGet('/resource').then((response) => {
        this.list = response.data.map(($) => {
          $.typeName = this.typeName[$.type] || ''
          return $
        })
        // 默认第一个
        if (!this.record.resource) {
          this.record.resource = this.list[0] && this.list[0].id
        }
      })
    },
    handleUpdate() {
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        console.log(this.record.type)
        this.$message.success('新建成功')
        this.$router.push('/rule')
      })
    },
  },
  created() {
    this.loadResource()
    this.loadData()
  },
  computed: {
    disabled() {
      return this.$route.query.oper === 'view'
    },
  },
}
</script>


<style lang="scss">
.emq-rule-details {
  .emq-rule-form {
    margin-top: 24px;
    .el-form-item--medium .el-form-item__content {
      line-height: 40px;
    }
    .el-select {
      width: 100%;
    }
    .sql-editor.el-textarea__inner {
      padding: 0;
    }
  }
}
</style>
