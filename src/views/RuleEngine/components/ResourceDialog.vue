<template>
  <el-dialog
    v-bind="$attrs"
    title="资源管理"
    width="700px"
    append-to-body
    class="resource-dialog"
    :visible.sync="dialogVisible"
    @close="close">
    <el-form
      class="el-form--public"
      :model="record"
      :rules="rules">
      <el-row :gutter="20">

        <div class="block__title">资源信息</div>

        <el-col :span="12">
          <el-form-item prop="name" label="名称">
            <el-input v-model="record.name"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="type" label="资源类型">
            <el-select v-model="record.type" style="width: 100%" @change="handleTypeChange">
              <el-option
                v-for="(item, index) in resourceTypes"
                :key="index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="description" label="备注">
            <el-input v-model="record.description" type="textarea"></el-input>
          </el-form-item>
        </el-col>

        <div class="divide"></div>

        <div class="block__title">资源配置</div>

        <el-col v-for="(item, index) in paramsList" :span="12" :key="index">
          <el-form-item :prop="item.prop" :label="item.label">
            <el-input v-model="record.config[item.key]"></el-input>
          </el-form-item>
        </el-col>


      </el-row>
    </el-form>

    <div slot="footer">
      <el-button class="cache-btn" type="text" @click="dialogVisible = false">取消</el-button>
      <el-button class="confirm-btn" type="success" @click="handleCreate">创建</el-button>
    </div>

  </el-dialog>
</template>


<script>
export default {
  name: 'resource-dialog',

  inheritAttrs: false,

  components: {},

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    record: {
      type: Object,
      default: () => ({
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
      resourceTypes: [],
      rules: {
        name: { required: true },
        type: { required: true },
      },
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
        this.$httpPost('/resources', this.record).then(() => {
          this.$message.success('创建成功')
          this.dialogVisible = false
        })
      })
    },
    initParams(params) {
      console.log(params)
      this.paramsList = []
    },
    handleTypeChange(val) {
      this.paramsList = []
      const resourceType = this.paramsList.find($ => $.type === val)
      if (!resourceType) {
        return
      }
      this.initParams(resourceType.params)
    },
    loadResourceTypes() {
      this.$httpGet('/resource_types').then((response) => {
        this.resourceTypes = response.data
      })
    },
  },

  created() {
    this.loadResourceTypes()
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
  .divide {
    margin: 25px auto;
    border-bottom: 1px solid #d8d8d8;
    clear: both;
  }
}
</style>
