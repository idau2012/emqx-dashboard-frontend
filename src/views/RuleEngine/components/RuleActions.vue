<template>
  <div class="rule-actions">
    <el-table :class="{ 'el-table--public': inDialog }" :data="record.actions">
      <el-table-column prop="name" :label="$t('rule.type')"></el-table-column>
      <el-table-column prop="params" :label="$t('rule.value')">
        <template slot-scope="{ row }">
          <div v-for="(item, i) in Object.entries(row.params)" class="action-item" :key="i">
            {{ item[0] }}: {{ item[1] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="has.delete || has.edit" :label="$t('rule.oper')">
        <template slot-scope="props">
          <el-button v-if="has.delete" type="text" @click="handleRemove(props)">
            {{ $t('rule.delete') }}
          </el-button>
          <el-button v-if="has.edit" type="text">{{ $t('rule.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button
      v-if="has.create"
      type="success"
      plain
      icon="el-icon-plus"
      size="small"
      style="margin-top:24px; min-width: 80px"
      @click="dialogVisible = true">
      {{ $t('rule.add') }}
    </el-button>

    <action-dialog
      :visible.sync="dialogVisible"
      :currentActions="record.actions"
      @confirm="handleActionAdd"></action-dialog>
  </div>
</template>


<script>
import ActionDialog from './ActionDialog'

export default {
  name: 'rule-actions',

  components: { ActionDialog },

  props: {
    record: {
      type: Object,
      required: true,
    },
    inDialog: {
      type: Boolean,
      default: false,
    },
    operations: {
      type: Array,
      default: () => ['create', 'edit', 'delete'],
    },
  },

  data() {
    return {
      dialogVisible: false,
    }
  },
  filters: {
    jsonFormat(val) {
      return JSON.stringify(val, null, 2)
    },
  },

  methods: {
    /**
     * 新建好一个 action
     * { name: 'action_name', params: { ...params } }
     * @param action
     */
    handleActionAdd(action) {
      this.record.actions.push(action)
    },

    handleRemove(props) {
      const { $index } = props
      this.record.actions = this.record.actions.filter((item, index) => index !== $index)
    },
  },

  created() {
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
