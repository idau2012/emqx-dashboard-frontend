<template>
  <div class="rule-view">
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/rules' }">规则引擎</el-breadcrumb-item>
        <el-breadcrumb-item class="breadcrumb-name">
          {{ operationName }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card class="el-card--self">
      <el-form
        label-position="left"
        label-width="80px"
        :model="record"
        :rules="rules">

        <!-- 基本信息 -->
        <div class="form-block--wrapper">
          <div class="form-block__title">
            基本信息
          </div>

          <div class="form-block__body">
            <el-row style="max-width: 1366px">
              <el-col :span="12">
                <el-form-item prop="name" label="规则名称">
                  <el-input v-model="record.name" placeholder="请输入规则名称"></el-input>
                </el-form-item>

                <el-form-item prop="rawsql" label="规则 SQL">
                  <el-input
                    v-model="record.rawsql"
                    type="textarea"
                    :rows="5"
                    :placeholder="rawSqlPlaceholder"></el-input>
                </el-form-item>

                <el-form-item label="规则描述">
                  <el-input v-model="record.description" type="textarea" :rows="4" placeholder="请输入规则描述"></el-input>
                </el-form-item>
              </el-col>

              <el-col class="sql-tips" :span="8" :offset="1">
                <div class="title">
                  编写 SQL 进行条件过滤，示例：
                </div>

                <p>1. 选择发往 "command/#" 主题的消息体</p>
                <code>select payload from "command/#"</code>

                <p>2. 选择发往任意主题的消息体中的 "name" 字段，消息体需要为 JSON 格式</p>
                <code> select payload.name from "#"</code>

                <p>3. 选择发往 "t/a" 主题的消息体中的 name 字段, 过滤条件为 name = 'EMQ'</p>
                <code>select payload.name as name from "t/a" when name = 'EMQ'</code>

                <p>详细规则见文档</p>
              </el-col>
            </el-row>
          </div>


        </div>


        <!-- 条件筛选 -->
        <div v-if="false" class="form-block--wrapper">
          <div class="form-block__title">
            条件筛选
          </div>

          <div class="form-block__body">
            <div style="width: 500px;">
              <el-form-item label="主题条件">
                <el-input v-model="record.filterTopic" prop="name" placeholder="消息发布主题"></el-input>
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
            触发动作
          </div>

          <div class="form-block__body">
            <el-row>
              <el-col :span="12">
                <rule-actions :actions="record.actions"></rule-actions>
              </el-col>
            </el-row>
          </div>


        </div>

      </el-form>

      <div>
        <el-button class="confirm-btn" type="success">新建</el-button>
        <el-button class="cache-btn" type="text">取消</el-button>
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
        actions: [],
      },
      rawSqlPlaceholder: 'select payload from "tipic/1"',
      rules: {
        name: { required: true },
        rawsql: { required: true, message: '请输入 SQL' },
        description: {},
        actions: [
          { type: 'array', required: true },
        ],
      },
    }
  },

  methods: {
    loadData() {
      if (this.id === 0 || this.id === '0') {
        return
      }
      this.$httpGet(`/rules/${this.id}`).then((response) => {
        this.record = response.data
      })
    },
  },

  created() {
    this.loadData()
  },

  computed: {
    operationName() {
      const { oper = 'view' } = this.$route.query
      const operationNameMap = {
        view: '查看',
        edit: '编辑',
        create: '新建',
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
    border-bottom: 1px solid #37363d;

    .form-block__title {
      margin-bottom: 30px;
      padding-left: 10px;
      border-left: 4px solid #34c388;
    }
    .form-block__body {
      padding-left: 20px;
    }
  }

  .sql-tips {
    padding: 20px;
    background-color: #37363d;
    color: #c0c4cc;
    border-radius: 4px;
    font-size: 15px;
    .title {
      color: #fff;
    }
    p {
      color: #c0c4cc;
      font-size: 12px;
      margin-bottom: 4px;
    }
    code {
      font-size: 12px;
      margin-bottom: 12px;
    }
  }
}
</style>
