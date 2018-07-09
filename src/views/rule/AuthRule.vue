<template>
  <div class="auth-rule">
    <div class="page-title">
      认证规则

      <el-button
        class="confirm-btn"
        round
        plain
        type="success"
        icon="el-icon-plus"
        style="float: right"
        :disable="$store.state.loading">
        新建
      </el-button>
    </div>


    <el-row class="emq-rule-list cards-lit" :gutter="40">
      <!-- 卡片列表 -->
      <!-- 空 -->
      <div class="blank">
        <div class="icon">
          <i class="fa fa-universal-access"></i>
        </div>
        <h2>认证规则</h2>
        <p>配置 EMQ 设备连接与发布 ACL。</p>
        <el-button type="success" @click="list.push(1)">新建规则</el-button>
      </div>
    </el-row>

  </div>
</template>


<script>
export default {
  name: 'auth-rule',
  data() {
    return {}
  },
  methods: {},
  created() {},
}
</script>


<style lang="scss">
.auth-rule {
  .emq-rule-list {
    margin-top: 24px;
    .el-card.list-card {
      margin-bottom: 40px;
      .el-card__header {
        border-bottom: none;
      }
      .el-dropdown {
        float: right;
      }
      .el-card__body {
        padding-top: 0;
        font-size: 12px;
        font-weight: normal;
        .item {
          ul {
            padding: 0;
            list-style-type: none;
            li {
              margin-bottom: 4px;
            }
          }
          .fa {
            margin-right: 3px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
