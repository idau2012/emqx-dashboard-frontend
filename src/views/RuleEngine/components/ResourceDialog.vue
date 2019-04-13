<template>
  <el-dialog
    v-bind="$attrs"
    width="700px"
    class="resource-dialog"
    :visible.sync="dialogVisible"
    :title="$t('rule.resource_mgmt')"
    @close="close">
    <el-form
      class="el-form--public"
      ref="record"
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

        <el-col :span="12">
          <el-form-item prop="description" :label="$t('rule.description')">
            <el-input v-model="record.description"></el-input>
          </el-form-item>
        </el-col>

        <!--<div class="divide"></div>-->

        <!--<div class="block__title">资源配置</div>-->

        <el-col v-for="(item, index) in paramsList" :span="12" :key="index">
          <el-form-item :prop="item.prop" :label="item.label">
            <el-input v-model="record.config[item.key]"></el-input>
          </el-form-item>
        </el-col>


      </el-row>
    </el-form>

    <div slot="footer">
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
          this.$message.success(this.$t('rule.create_success'))
          this.dialogVisible = false
        })
      })
    },
    handleTypeChange(val) {
      this.paramsList = []
      const resourceType = this.paramsList.find($ => $.type === val)
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
