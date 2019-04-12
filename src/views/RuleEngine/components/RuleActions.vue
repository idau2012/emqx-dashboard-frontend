<template>
  <div class="rule-actions">
    <el-table :data="actionData">
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column prop="value" label="值"></el-table-column>
      <el-table-column v-if="has.delete && has.edit" label="操作">
        <template slot-scope="{ row }">
          <el-button v-if="has.delete" type="text">删除</el-button>
          <el-button v-if="has.edit" type="text">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button
      v-if="has.create"
      type="success"
      plain
      icon="el-icon-plus"
      size="small"
      style="margin-top:24px;min-width: 80px"
      @click="dialogVisible = true">
      添加
    </el-button>

    <action-dialog :visible.sync="dialogVisible"></action-dialog>
  </div>
</template>


<script>
import ActionDialog from './ActionDialog'

export default {
  name: 'rule-actions',

  components: { ActionDialog },

  props: {
    actions: {
      type: Array,
      required: true,
    },
    operations: {
      type: Array,
      default: () => ['create', 'edit', 'delete'],
    },
  },

  data() {
    return {
      dialogVisible: false,
      actionData: [],
    }
  },

  methods: {
    // form actions load actionsData
    loadActions() {},

    // form actionsData updata actions
    updateActions() {
      this.$emit('update:actions')
    },
  },

  created() {
    this.loadActions()
  },

  computed: {
    has() {
      const dict = []
      this.operations.forEach((item) => {
        dict[item] = true
      })
      return dict
    },
  },
}
</script>


<style lang="scss">
.rule-actions {
}
</style>
