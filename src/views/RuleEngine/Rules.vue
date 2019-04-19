<template>
  <div class="rules-view">
    <div class="page-title">
      {{ $t('rule.message_rule') }}
      <el-button
        class="confirm-btn"
        round
        plain
        type="success"
        icon="el-icon-plus"
        size="medium"
        style="float: right"
        :disable="$store.state.loading"
        @click="handleOperation">
        {{ $t('rule.create') }}
      </el-button>
    </div>

    <!-- rules list -->
    <el-table v-loading="$store.state.loading" border :data="tableData">

      <!-- rule name -->
      <el-table-column prop="name" :label="$t('rule.rule_name')">
        <!--<template slot-scope="{ row }">-->
        <!--<router-link :to="`/rules/${row.id}`">-->
        <!--{{ row.name }}-->
        <!--</router-link>-->
        <!--</template>-->
      </el-table-column>

      <!--<el-table-column prop="for" label="响应事件"></el-table-column>-->

      <!--<el-table-column prop="enabled" label="是否启用">-->
      <!--<template slot-scope="{ row }">-->
      <!--{{ row.enabled }}-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="rawsql" min-width="120px" label="SQL"></el-table-column>
      <!--<el-table-column prop="description" label="描述"></el-table-column>-->
      <el-table-column prop="actions" :label="$t('rule.actions')">
        <template slot-scope="{ row }">
          <div v-for="(item, i) in row.actions" class="action-item" :key="i">
            {{ item.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('rule.oper')">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            size="mini"
            plain
            @click="viewRule(row)">
            {{ $t('rule.view') }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            @click="handleDelete(row)">
            {{ $t('rule.delete') }}
          </el-button>
        </template>
      </el-table-column>

    </el-table>


    <el-dialog :title="$t('rule.rule_details')" :visible.sync="dialogVisible">
      <div class="dialog-preview">
        <div class="option-item">
          <div class="option-title">{{ $t('rule.rule_name') }}</div>
          <div class="option-value">{{ rule.name }}</div>
        </div>
        <div class="option-item">
          <div class="option-title">{{ $t('rule.rule_desc') }}</div>
          <div class="option-value">{{ rule.description }}</div>
        </div>
        <div class="option-item">
          <div class="option-title">SQL</div>
          <div class="option-value">{{ rule.rawsql }}</div>
        </div>
        <div class="option-item">
          <div class="option-title">{{ $t('rule.actions') }}</div>
          <div class="option-all">
            <rule-actions
              in-dialog
              :record="rule"
              :operations="[]">
            </rule-actions>
          </div>
        </div>
      </div>

      <div slot="footer">
        <el-button class="confirm-btn" type="success" @click="dialogVisible = false">
          {{ $t('rule.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import RuleActions from '~/views/RuleEngine/components/RuleActions'

export default {
  name: 'rules-view',

  components: { RuleActions },

  props: {},

  data() {
    return {
      rule: {},
      dialogVisible: false,
      tableData: [],
    }
  },

  methods: {
    viewRule(row) {
      this.rule = row
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm(this.$t('rule.confirm_stop_delete'), 'Notice', {
        confirmButtonClass: 'confirm-btn',
        confirmButtonText: this.$t('oper.confirm'),
        cancelButtonClass: 'cache-btn el-button--text',
        cancelButtonText: this.$t('oper.cancel'),
        type: 'warning',
      }).then(() => {
        this.$httpDelete(`/rules/${ row.id }`).then(() => {
          this.$message.success(this.$t('rule.delete_success'))
          this.loadData()
        })
      }).catch()
    },
    handleOperation() {
      this.$router.push('/rules/0?oper=create')
    },
    loadData() {
      this.$httpGet('/rules').then((response) => {
        this.tableData = response.data.filter($ => $.for === 'message.publish')
      })
    },
  },

  filters: {
    actionsFilter(actions) {
      return actions.map($ => $.name).join(',  ')
    },
  },

  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
.rules-view {
  .el-table {
    margin-top: 24px;
  }
}
</style>
