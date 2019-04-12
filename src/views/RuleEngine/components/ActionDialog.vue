<!-- 动作类型编辑与选择 -->
<template>
  <el-dialog
    v-bind="$attrs"
    title="触发动作"
    width="500px"
    append-to-body
    class="action-dialog"
    :visible.sync="dialogVisible"
    @close="close">
    <el-form
      class="el-form--public"
      ref="record"
      :model="record"
      :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="action" label="动作">
            <el-select v-model="record.action" @change="handleActionChange" style="width: 100%">
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

        <el-col v-if="action.resource_type" :span="12">
          <el-form-item prop="resource" label="资源类型">
            <el-select v-model="record.resource" style="width: 100%">
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col v-for="(item, index) in paramsList" :span="12" :key="index">
          <el-form-item
            :prop="`params.${item.key}`"
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
      <el-button class="cache-btn" type="text" @click="dialogVisible = false">取消</el-button>
      <el-button class="confirm-btn" type="success" @click="handleAdd">确定</el-button>
    </div>
  </el-dialog>
</template>


<script>
export default {
  name: 'action-dialog',

  inheritAttrs: false,

  components: {},

  props: {
    visible: {
      type: Boolean,
      required: true,
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
      },
      options: [],
      action: {},

      actionsList: [],
      paramsList: [],
    }
  },

  methods: {
    close() {
      if (this.$refs.record) {
        // this.record = {
        //   params: {},
        // }
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
        this.$message.success('创建成功')
      })
    },
    // 渲染 params 列
    initParams(params = {}) {
      Object.entries(params).forEach((item) => {
        const [key, value] = item
        this.paramsList.push({
          key,
          label: key,
          prop: key,
          placeholder: value,
          rules: { required: true, message: `${key} is required` },
        })
      })
    },
    handleActionChange(val) {
      this.paramsList = []
      this.action = this.actionsList.find($ => $.name === val)
      if (!this.action) {
        return
      }
      this.loadResource()
      this.initParams(this.action.params)
    },
    // 加载 resource 列表
    loadResource() {
      if (!this.action || !this.action.resource_type) {
        return
      }
      const { resource_type: resourceType } = this.action
      this.$httpGet('/resources').then((response) => {
        const { data } = response
        this.options = data.filter($ => $.name === resourceType)
      })
    },
    loadActions() {
      this.$httpGet('/actions').then((response) => {
        this.actionsList = response.data
      })
    },
    // 使用配置绘制
    renderForm() {},
  },

  created() {
    this.loadActions()
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
