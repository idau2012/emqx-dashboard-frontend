<template>
  <el-dialog
    class="emq-resource"
    width="600px"
    :title="title"
    :visible="dialogVisible"
    @open="handleOpen"
    @close="handleClose">
    <!-- 操作按钮 -->
    <div class="operation-area" slot="footer">
      <el-button type="text">取消</el-button>
      <el-button type="success">确定</el-button>
    </div>
  </el-dialog>
</template>


<script>
export default {
  name: 'emq-resource',
  data() {
    return {
      dialogVisible: true,
      title: '资源',
    }
  },
  methods: {
    handleOpen() {},
    handleClose() {
      this.$emit('close')
    },
  },
  created() {},
}
</script>


<style lang="scss">
.emq-resource {}
</style>
