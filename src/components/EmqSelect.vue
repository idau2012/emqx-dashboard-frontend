<template>
  <el-select
    class="emq-select"
    :placeholder="placeholder"
    :multiple="multiple"
    :disabled="disabled"
    :value="secureValue"
    :filterable="filterable"
    :remote="filterable"
    :remote-method="remoteMethod"
    :loading="loading"
    :clearable="clearable"
    :popper-class="popperClass"
    @visible-change="visibleChange"
    @input="change">
    <el-option
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value">
    </el-option>
  </el-select>
</template>


<script>
import { Select, Option } from 'element-ui'

import dictCode from '../template'

export default {
  name: 'emq-select',
  components: {
    'el-select': Select,
    'el-option': Option,
  },
  props: {
    value: {
      required: true,
    },
    /**
     * {
     *    url: '远端加载 url',
     *    key: '本地加载 dictCode key',
     *    params: {}, // 固定的查询参数
     *    searchKey: '与 searchValue 关键字组成 params 中一个值',
     *    其他
     * }
     */
    field: {
      type: Object,
      required: true,
    },
    // select 的 rely 场景需要用到 record
    record: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
    },
    placeholder: {
      type: String,
    },
    autoSelect: {
      type: Boolean,
      default: true,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    popperClass: {
      type: String,
    },
    // 自定义获取方法
    getter: {
      type: Function,
    },
  },
  data() {
    return {
      loading: false,
      timer: 0,
      options: [],
    }
  },
  computed: {
    secureValue() {
      if (this.multiple && !this.value) {
        return []
      }
      return this.value
    },
    relyData() {
      if (this.field.rely) {
        return this.record[this.field.rely]
      }
    },
  },
  watch: {
    // 监听 select 所依赖的字段的值的变化
    relyData(newValue, oldValue) {
      // 依赖值变化(由非 undefined 变为另一个值)的时候，清空 select 绑定的值
      if (oldValue !== undefined) {
        this.$emit('input', undefined)
      }
      if (this.field.options) {
        return
      }
      if (this.relyData) {
        this.$httpGet(`${this.field.url}?${this.field.rely}=${this.relyData}`).then((response) => {
          this.options = response.data
        })
      } else {
        // 如果所依赖的字段变为空了，则自己的下拉列表也清空
        this.options = []
      }
    },
  },
  methods: {
    async loadData() {
      // 自定义获取函数
      if (this.getter) {
        this.options = await this.getter().catch(this.$message.error)
        return
      }
      // 自定义 options
      if (this.field.options) {
        this.options = this.field.options
        return
      }
      if (!this.field.url) {
        this.options = dictCode[this.field.key] || []
        // 单选默认选中第一个
        if (this.autoSelect && !this.multiple && !this.value && this.options[0]) {
          this.$emit('input', this.options[0].value)
        }
        return
      }
      if (this.filterable) { // 使用搜索方法加载数据
        this.remoteMethod(this.value)
        return
      }
      if (this.field.rely) {
        return
      }
      this.$httpGet(this.field.url).then((response) => {
        this.options = response.data
      })
    },
    // 当 select 选中值变化时，触发父组件的 v-model 绑定
    change(value) {
      this.$emit('input', value)
    },
    // 下拉框出现时, 并且当前下拉框的依赖字段为空时触发
    visibleChange(visible) {
      if (visible && this.field.rely && !this.relyData) {
        this.$message.error(`请先选择${this.field.relyName}！`)
      }
    },
    // 远程搜索
    remoteMethod(searchValue) {
      clearTimeout(this.timer)
      if (!searchValue) {
        return
      }
      this.timer = setTimeout(() => {
        let params = Object.assign({}, this.field.params)
        if (this.field.searchKey) {
          params = Object.assign({}, params, { [this.field.searchKey]: searchValue })
        }
        this.loading = true
        this.$httpGet(this.field.url, { params }).then((response) => {
          // 远程搜索编辑状态: options 始终保留已选中的选项的值, 避免被搜索结果覆盖
          if (this.field.state === 'edit') {
            const hash = {}
            // 已选中的值 hash
            this.secureValue.forEach((value) => {
              hash[value] = true
            })
            // 已选中的 option
            const options = this.options.filter($ => hash[$.value])
            // 对象数组去重 -> 全部 option
            response.data.forEach((item) => {
              if (!hash[item.value]) {
                options.push(item)
              }
            })
            this.options = options
          } else {
            this.options = response.data
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }, 200)
    },
  },
  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
.emq-select {
  width: 100%;
}
</style>
