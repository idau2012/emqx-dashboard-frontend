<template>
  <div class="service-details">
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item @click.native="$router.go(-1)" class="uppercase">Services</el-breadcrumb-item>
        <el-breadcrumb-item class="breadcrumb-name">
          {{ serviceName }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card class="el-card--self">
      <div slot="header">
        {{ serviceName }}
      </div>
      <div v-html="JSON.stringify(record, '--', 4)" class="running-chart">
      </div>
    </el-card>
  </div>
</template>


<script>
import {
  Dialog, Input, Checkbox, CheckboxGroup, Select, Option, Button, Table, TableColumn,
  Breadcrumb, BreadcrumbItem, Form, FormItem, Row, Col, Card,
} from 'element-ui'

export default {
  name: 'service-details',
  components: {
    'el-dialog': Dialog,
    'el-input': Input,
    'el-checkbox': Checkbox,
    'el-checkbox-group': CheckboxGroup,
    'el-select': Select,
    'el-option': Option,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-row': Row,
    'el-col': Col,
    'el-card': Card,
  },
  data() {
    return {
      serviceName: this.$route.params.serviceName,
      record: {},
    }
  },
  methods: {
    loadData() {
      this.$httpGet(`/services/${this.serviceName}`).then((response) => {
        this.record = response.data
      }).catch((error) => {
        this.$message.error(error.message || '网络错误')
      })
    },
  },
  created() {
    this.loadData()
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === '/services') {
      next()
    } else {
      next('/services')
    }
  },
}
</script>


<style lang="scss">
.service-details {
  .el-card--self {
    margin-top: 24px;
  }
}
</style>
