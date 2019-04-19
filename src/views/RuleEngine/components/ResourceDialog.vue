<template>
  <el-dialog
    v-bind="$attrs"
    width="700px"
    class="resource-dialog"
    :visible.sync="dialogVisible"
    :title="$t('rule.resource_mgmt')"
    @close="close"
    @open="loadResourceTypes">
    <el-form
      class="el-form--public"
      ref="record"
      :disabled="record.disabled === true"
      :model="record"
      :rules="rules">
      <el-row :gutter="20">

        <!--<div class="block__title">资源信息</div>-->

        <el-col :span="12">
          <el-form-item prop="name" :label="$t('rule.name')">
            <el-input v-model="record.name"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="type" :label="$t('rule.resource_type')">
            <el-select
              v-model="record.type"
              class="el-select--public"
              popper-class="el-select--public"
              style="width: 100%"
              @change="handleTypeChange">
              <el-option
                v-for="(item, index) in resourceTypes"
                :key="index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!--<div class="divide"></div>-->

        <!--<div class="block__title">资源配置</div>-->

        <el-col v-for="(item, index) in paramsList" :span="item.type === 'object' ? 24 : 12" :key="index">
          <el-form-item :prop="`config.${item.prop}`" :label="item.label">


            <json-input
              v-if="item.type === 'object'"
              v-model="record.config[item.key]"
            ></json-input>

            <emq-select
              v-else-if="item.type === 'emq-select'"
              v-bind="item.$attrs"
              v-model="record.config[item.key]"
              class="el-select--public"
              popper-class="el-select--public">
            </emq-select>

            <el-input
              v-else
              v-bind="item.$attrs"
              v-model="record.config[item.key]">
            </el-input>

          </el-form-item>
        </el-col>


        <el-col :span="12">
          <el-form-item prop="description" :label="$t('rule.description')">
            <el-input v-model="record.description"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <div v-if="record.disabled !== true" slot="footer">
      <el-button class="cache-btn" type="text" @click="dialogVisible = false">
        {{ $t('rule.cancel') }}
      </el-button>
      <el-button class="confirm-btn" type="success" @click="handleCreate">
        {{ $t('rule.confirm') }}
      </el-button>
    </div>

  </el-dialog>
</template>


<script>
import { params2Form2 } from '~/common/utils'

export default {
  name: 'resource-dialog',

  inheritAttrs: false,

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    record: {
      type: Object,
      default: () => ({
        disabled: false,
        name: '',
        type: '',
        config: {},
        description: '',
      }),
    },
  },

  data() {
    return {
      paramsList: [],
      resourceRules: {},
      resourceTypes: [],
      objectPlaceholder: `JSON, e.g: \n${ JSON.stringify({
        Authorization: 'Basic YWRtaW46cHVibGlj',
      }, null, 2) }`,
    }
  },

  methods: {
    close() {
      if (this.$refs.record) {
        this.$refs.record.resetFields()
      }
    },
    handleCreate() {
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        this.$httpPost('/resources', this.record).then((res) => {
          this.$message.success(this.$t('rule.create_success'))
          this.dialogVisible = false
          this.$emit('confirm', res.data)
        })
      })
    },
    handleTypeChange(val) {
      this.paramsList = []
      this.resourceRules = {}
      const resourceType = this.resourceTypes.find($ => $.name === val)
      if (!resourceType) {
        return
      }
      const { model, rules } = params2Form2(resourceType.params)
      this.resourceRules = rules
      this.paramsList = model
      this.initRecord()
    },
    // 初始化 record
    initRecord() {
      if (this.paramsList.length === 0) {
        this.$set(this.record, 'config', undefined)
      } else if (!this.record.config) {
        this.$set(this.record, 'config', {})
      }
      if (this.record.disabled === true) {
        this.paramsList.forEach((item) => {
          this.$set(this.record.config, item.key, this.record.config[item.key])
        })
      } else {
        this.paramsList.forEach((item) => {
          this.$set(this.record.config, item.key, item.defaultValue)
        })
      }
    },
    loadResourceTypes() {
      if (this.$refs.record) {
        this.$refs.record.clearValidate()
      }
      this.$httpGet('/resource_types').then((response) => {
        this.resourceTypes = response.data
        this.handleTypeChange(this.record.type)
      })
    },
  },

  created() {
    // this.loadResourceTypes()
  },

  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      },
    },
    rules() {
      return {
        name: { required: true },
        type: { required: true },
        ...this.resourceRules,
      }
    },
  },
}
</script>


<style lang="scss">
.resource-dialog {
  .el-form {
    padding: 20px;
  }

  .block__title {
    padding-left: 10px;
    margin-left: 10px;
    border-left: 4px solid #34c388;
    margin-bottom: 20px;
  }

  .el-select {
    width: 100%;
  }

  .divide {
    margin: 25px auto;
    border-bottom: 1px solid #d8d8d8;
    clear: both;
  }
}
</style>
