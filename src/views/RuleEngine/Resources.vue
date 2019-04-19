<template>
  <div class="resources-view">
    <div class="page-title">
      {{ $t('rule.resource_title') }}
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
    <el-table border :data="tableData">

      <!-- rule name -->
      <el-table-column prop="name" :label="$t('rule.resource_name')"></el-table-column>

      <el-table-column prop="type" :label="$t('rule.resource_type')"></el-table-column>

      <el-table-column prop="description" :label="$t('rule.description')"></el-table-column>

      <el-table-column :label="$t('rule.oper')">
        <template slot-scope="{ row }">
          <el-button
            plain
            type="success"
            size="mini"
            @click="viewResource(row)">
            {{ $t('rule.view') }}
          </el-button>
          <el-button
            plain
            size="mini"
            type="warning"
            @click="handleDelete(row)">
            {{ $t('rule.delete') }}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <resource-dialog
      ref="resourceDialog"
      :visible.sync="dialogVisible"
      @confirm="loadData">
    </resource-dialog>

    <el-dialog :title="$t('rule.resource_details')" :visible.sync="viewDialogVisible">
      <div class="dialog-preview">
        <div class="option-item">
          <div class="option-title">
            {{ $t('rule.resource_name') }}
          </div>
          <div class="option-value">{{ res.name }}</div>
        </div>
        <div class="option-item">
          <div class="option-title">
            {{ $t('rule.resource_type') }}
          </div>
          <div class="option-value">{{ res.type }}</div>
        </div>
        <div class="option-item">
          <div class="option-title">
            {{ $t('rule.description') }}
          </div>
          <div class="option-value">{{ res.description }}</div>
        </div>

        <!-- 这里是参数 -->
        <div
          v-if="res.config && Object.keys(res.config).length > 0"
          class="option-item">
          <div class="option-title">
            {{ $t('rule.config_info') }}
          </div>
          <div class="option-all">


            <div
              v-for="(item, index) in Object.entries(res.config)"
              :key="index"
              class="option-item">
              <div class="option-title">
                {{ item[0] }}
              </div>
              <div class="option-value">
                {{ item[1] }}
              </div>
            </div>

          </div>
        </div>

      </div>

      <div slot="footer">
        <el-button class="confirm-btn" type="success" @click="viewDialogVisible = false">
          {{ $t('rule.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
import ResourceDialog from './components/ResourceDialog'

export default {
  name: 'resources-view',

  components: { ResourceDialog },

  props: {},

  data() {
    return {
      dialogVisible: false,
      viewDialogVisible: false,
      tableData: [],
      res: {},
    }
  },

  methods: {
    handleDelete(row) {
      this.$confirm(this.$t('rule.confirm_stop_delete'), 'Notice', {
        confirmButtonClass: 'confirm-btn',
        confirmButtonText: this.$t('oper.confirm'),
        cancelButtonClass: 'cache-btn el-button--text',
        cancelButtonText: this.$t('oper.cancel'),
        type: 'warning',
      }).then(() => {
        this.$httpDelete(`/resources/${ row.id }`).then(() => {
          this.$message.success(this.$t('rule.delete_success'))
          this.loadData()
        })
      }).catch()
    },
    viewResource(row) {
      this.res = { ...row }
      this.viewDialogVisible = true
    },
    handleOperation() {
      this.dialogVisible = true
    },
    loadData() {
      this.$httpGet('/resources').then((response) => {
        this.tableData = response.data
      })
    },
  },

  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
.resources-view {
  .el-table {
    margin-top: 24px;
  }
}
</style>
