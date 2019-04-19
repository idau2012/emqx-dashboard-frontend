<!-- 动作类型编辑与选择 -->
<template>
  <el-dialog
    v-bind="$attrs"
    width="500px"
    append-to-body
    class="action-dialog"
    :visible.sync="dialogVisible"
    :title="$t('rule.actions')"
    @close="close">
    <el-form
      class="el-form--public"
      ref="record"
      :model="record"
      :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="action" :label="$t('rule.action')">
            <el-select
              v-model="record.action"
              class="el-select--public"
              popper-class="el-select--public"
              @change="handleActionChange"
              style="width: 100%">
              <el-option
                v-for="(item, index) in actionsList"
                :key="index"
                :label="item.name"
                :value="item.name">
                <div>
                  <span>{{ item.name }}</span>
                  <p>{{ item.description }}</p>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 选择 resource -->
        <el-col v-if="action.params && action.params.$resource" :span="12">
          <el-form-item prop="params.$resource" :label="$t('rule.resource')">
            <el-select
              v-model="record.params.$resource"
              class="el-select--public"
              popper-class="el-select--public"
              style="width: 100%">
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col v-for="(item, index) in paramsList" :span="12" :key="index">
          <el-form-item
            :prop="`params.${item.prop}`"
            :label="item.label"
            :rules="item.rules">
            <el-input
              v-model="record.params[item.key]"
              :placehoder="item.placeholder">
            </el-input>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <div slot="footer">
      <el-button class="cache-btn" type="text" @click="dialogVisible = false">
        {{ $t('rule.cancel') }}
      </el-button>
      <el-button class="confirm-btn" type="success" @click="handleAdd">
        {{ $t('rule.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>


<script>
import { params2Form } from '~/common/utils'

export default {
  name: 'action-dialog',

  inheritAttrs: false,

  components: {},

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    formData: {
      type: Object,
    },
    currentActions: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      record: {
        params: {},
      },
      rules: {
        action: {
          required: true,
        },
        params: {
          $resource: {
            required: true,
          },
        },
      },
      options: [],
      action: {},

      actionsList: [],
      paramsList: [],
    }
  },

  methods: {
    _isEmpty(val) {
      if (!val) {
        return true
      }
      if (Array.isArray(val) && val.length === 0) {
        return true
      }
      if (typeof val === 'object') {
        return Object.keys(val).length === 0
      }
      return !!val
    },
    close() {
      if (this.$refs.record) {
        this.options = {}
        this.action = {}
        this.paramsList = []
        this.$refs.record.resetFields()
      }
    },
    handleAdd() {
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        const { params, action: name } = this.record
        // 资源类型 资源参数
        const action = { name, params: { ...params } }
        const hash = JSON.stringify(action)
        if (this.currentActionsMap[hash]) {
          this.$message.error(this.$t('rule.action_exists'))
          return
        }
        this.$emit('confirm', action)
        this.dialogVisible = false
      })
    },
    handleActionChange(val) {
      this.paramsList = []
      this.action = this.actionsList.find($ => $.name === val)
      if (!this.action) {
        return
      }
      // TODO: resource_type to action layout
      const { model = [] } = params2Form(this.action.params)
      this.paramsList = model

      // fillData
      model.forEach((item) => {
        const { key } = item
        this.$set(this.record, `params.${ key }`, undefined)
      })

      return this.loadResource()
    },

    // 加载 resource 列表
    loadResource() {
      if (!this.action || !this.action.params || !this.action.params.$resource) {
        return
      }
      const { $resource: resource } = this.action.params
      return this.$httpGet('/resources').then((response) => {
        const { data } = response
        this.options = data.filter($ => $.type === resource)
        // 清空 待选择
        this.$set(this.record, 'resource', undefined)
      })
    },

    loadActions() {
      return this.$httpGet('/actions').then((response) => {
        this.actionsList = response.data
      })
    },
    // 使用配置绘制
    async renderForm(formData) {
      if (!this.formData) {
        return
      }
      const { name, params = {} } = this.formData || formData

      // 加载资源
      await this.handleActionChange(name)
      // 填充数据
      this.fillData(params)
    },
    fillData(data) {
      Object.entries(data).forEach((item) => {
        const [key, value] = item
        this.$set(this.record, key, value)
      })
    },
    open(formData) {
      this.dialogVisible = true
      this.renderForm(formData)
    },
  },

  async created() {
    await this.loadActions()
    await this.renderForm()
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
    currentActionsMap() {
      const dict = {}
      this.currentActions.forEach((item) => {
        const hash = JSON.stringify(item)
        dict[hash] = true
      })
      return dict
    },
  },
}
</script>


<style lang="scss">
.action-dialog {
  .action-tips {
    padding: 20px auto;
    font-size: 13px;
  }
}
</style>
