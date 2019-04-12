<template>
  <div class="rules-view">
    <div class="page-title">
      规则引擎
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
    <el-table v-loading="$store.state.loading" border :data="tableData">

      <!-- rule name -->
      <el-table-column prop="name" label="规则名称">
        <template slot-scope="{ row }">
          <router-link :to="`/rules/${row.id}`">
            {{ row.name }}
          </router-link>
        </template>
      </el-table-column>


      <el-table-column prop="actions" label="响应动作"></el-table-column>

      <el-table-column prop="enabled" label="是否启用"></el-table-column>
      <el-table-column prop="rawsql" label="SQL"></el-table-column>
      <el-table-column prop="description" label="规则描述"></el-table-column>
      <el-table-column label="操作">
        <template slor-scope="{ row }">
          <el-button
            type="success"
            size="mini"
            :plain="true">
            编辑
          </el-button>
          <el-button
            size="mini"
            type="warning">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>


<script>
export default {
  name: 'rules-view',

  components: {},

  props: {},

  data() {
    return {
      tableData: [],
    }
  },

  methods: {
    handleOperation() {
      this.$router.push('/rules/0?oper=create')
    },
    loadData() {
      this.$httpGet('/rules').then((response) => {
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
.rules-view {
  .el-table {
    margin-top: 24px;
  }
}
</style>
