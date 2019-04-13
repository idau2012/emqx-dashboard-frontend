<template>
  <div class="rule-view">
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/rules' }">
          {{ $t('rule.message_rule') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item class="breadcrumb-name">
          {{ operationName }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card class="el-card--self">
      <el-form
        label-position="left"
        label-width="80px"
        ref="record"
        :model="record"
        :rules="rules">

        <!-- 基本信息 -->
        <div class="form-block--wrapper">
          <div class="form-block__title">
            {{ $t('rule.conditional') }}
            <div class="form-block__title-tips">
              {{ $t('rule.conditional_tips') }}
            </div>
          </div>

          <div class="form-block__body">
            <el-row style="max-width: 1366px">
              <el-col :span="12">
                <el-form-item prop="name" :label="$t('rule.name')">
                  <el-input
                    v-model="record.name"
                    :placeholder="$t('rule.rule_name_required')">

                  </el-input>
                </el-form-item>

                <el-form-item prop="rawsql" :label="$t('rule.rule_sql')">
                  <el-input
                    v-model="record.rawsql"
                    type="textarea"
                    :rows="5"
                    :placeholder="rawSqlPlaceholder"></el-input>
                </el-form-item>

                <el-form-item :label="$t('rule.description')">
                  <el-input
                    v-model="record.description"
                    type="textarea"
                    :rows="4"
                    :placeholder="$t('rule.rule_descr_placeholder')">
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col class="sql-tips" :span="8" :offset="1">
                <div class="title">
                  {{ $t('rule.rule_sql_tips_title') }}
                </div>

                <div v-html="$t('rule.sql_tips_html')"></div>
              </el-col>
            </el-row>
          </div>


        </div>


        <!-- 条件筛选 -->
        <div v-if="false" class="form-block--wrapper">
          <div class="form-block__title">
            {{ $t('rule.condition_screening') }}
          </div>

          <div class="form-block__body">
            <div style="width: 500px;">
              <el-form-item :label="$t('rule.topic_condition')">
                <el-input
                  v-model="record.filterTopic" prop="name"
                  :placeholder="$t('rule.message_publish_topic')">
                </el-input>
              </el-form-item>

              <el-form-item label="测试消息">
                <el-input
                  v-model="record.description"
                  type="textarea"
                  :rows="5"
                  :placeholder="JSON.stringify({ data: '100' }, null, 2)">
                </el-input>
              </el-form-item>

              <el-form-item label="选取字段">
                <el-input
                  v-model="record.selectFields"
                  type="textarea"
                  placeholder="*"
                  :rows="5">
                </el-input>
                <p>仅支持'*' 、 ',' 、'.' 、 空格、字母和数字，不为空</p>
              </el-form-item>

              <el-form-item label="筛选条件">
                <el-input
                  v-model="record.reg"
                  prop="name"
                  placeholder="e.g. data > 90">
                </el-input>
              </el-form-item>
            </div>
          </div>

        </div>


        <!-- 触发动作 -->
        <div class="form-block--wrapper" style="clear: both;">
          <div class="form-block__title">
            <span style="color: #ff6d6d">*</span>
            {{ $t('rule.set_action') }}
            <div class="form-block__title-tips">
              {{ $t('rule.actions_tips') }}
            </div>
          </div>

          <div class="form-block__body">
            <el-row>
              <el-col :span="12">
                <rule-actions
                  :operations="['create', 'delete']"
                  :record="record">
                </rule-actions>
              </el-col>

              <el-col class="sql-tips" :span="8" :offset="1">
                <div class="title">
                  {{ $t('rule.rule_action_tips_title') }}
                </div>

                <div v-html="$t('rule.action_tips_html')"></div>
              </el-col>
            </el-row>
          </div>


        </div>

      </el-form>

      <div>
        <el-button
          class="confirm-btn"
          type="success"
          @click="handleCreate">
          {{ $t('rule.create') }}
        </el-button>
        <el-button
          class="cache-btn"
          type="text"
          @click="handleCancel">
          {{ $t('rule.cancel') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>


<script>
import RuleActions from './components/RuleActions'

export default {
  name: 'rule-view',

  components: { RuleActions },

  props: {},

  data() {
    return {
      id: this.$route.params.id,
      record: {
        name: '',
        for: 'message.publish',
        rawsql: '',
        actions: [],
        description: '',
      },
      rawSqlPlaceholder: 'select payload from "tipic/1"',
      rules: {
        name: { required: true },
        rawsql: { required: true, message: this.$t('rule.sql_required') },
      },
    }
  },

  methods: {
    handleCreate() {
      if (this.$refs.record) {
        this.$refs.record.validate((valid) => {
          if (!valid) {
            return
          }
          if (this.record.actions.length === 0) {
            this.$message.error(this.$t('rule.actions_required'))
            return
          }
          this.$httpPost('/rules', this.record).then(() => {
            this.$message.success(this.$t('rule.create_success'))
            this.$router.push('/rules')
          })
        })
      }
    },
    loadData() {
      if (this.id === 0 || this.id === '0') {
        return
      }
      this.$httpGet(`/rules/${this.id}`).then((response) => {
        this.record = response.data
      })
    },
    handleCancel() {
      this.$router.push('/rules')
    },
  },

  created() {
    this.loadData()
  },

  computed: {
    operationName() {
      const { oper = 'view' } = this.$route.query
      const operationNameMap = {
        view: this.$t('rule.view'),
        edit: this.$t('rule.edit'),
        create: this.$t('rule.create'),
      }
      if (this.id === '0' || this.id === 0) {
        return operationNameMap.create
      }
      return operationNameMap[oper]
    },
  },
}
</script>


<style lang="scss">
.rule-view {

  .page-title .el-breadcrumb {
    text-transform: none;
  }
  .el-card {
    margin-top: 24px;
    min-height: 150px;
    padding: 20px;
    .config-null {
      text-align: center;
      margin: 20px auto;
    }
  }

  .form-block--wrapper {
    margin-bottom: 50px;
    padding-bottom: 24px;
    .form-block__title {
      margin-bottom: 30px;
      padding-left: 10px;
      border-left: 4px solid #34c388;

      .form-block__title-tips {
        font-size: 12px;
        display: inline-block;
        margin-left: 4px;
      }
    }
    .form-block__body {
      padding-left: 20px;
    }
  }

  .sql-tips {
    padding: 20px;
    border-radius: 4px;
    font-size: 15px;
    p {
      font-size: 12px;
      margin-bottom: 4px;
    }
    code, span {
      font-size: 12px;
      margin-bottom: 12px;
    }
  }
}
</style>
