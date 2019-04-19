<template>
  <div class="resources-view">
    <div class="page-title">
      资源
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
        新建
      </el-button>
    </div>

    <!-- rules list -->
    <el-table border :data="tableData">

      <!-- rule name -->
      <el-table-column prop="name" label="资源名称"></el-table-column>

      <el-table-column prop="type" label="资源类型"></el-table-column>

      <el-table-column prop="description" label="描述"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            size="mini"
            plain
            @click="viewResource(row)">
            查看
          </el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <resource-dialog
      ref="resourceDialog"
      :visible.sync="dialogVisible"
      @confirm="loadData">
    </resource-dialog>

    <el-dialog title="资源详情" :visible.sync="viewDialogVisible">
      <div class="dialog-preview">
        <div class="option-item">
          <div class="option-title">资源名称</div>
          <div class="option-value">{{ res.name }}</div>
        </div>
        <div class="option-item">
          <div class="option-title">资源类型</div>
          <div class="option-value">{{ res.type }}</div>
        </div>
        <div class="option-item">
          <div class="option-title">资源描述</div>
          <div class="option-value">{{ res.description }}</div>
        </div>

        <!-- 这里是参数 -->
        <div
          v-if="res.config && Object.keys(res.config).length > 0"
          class="option-item">
          <div class="option-title">参数信息</div>
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
