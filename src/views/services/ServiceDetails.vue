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
        从 {{ serviceName }} 创建实例
      </div>
      <div class="graph-chart"></div>
      <el-form
        ref="instances"
        :record="instances"
        :rules="instanceRules"
        :model="instances"
        size="medium"
        label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="name" label="实例名称">
              <el-input v-model="instances.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="descr" label="说明">
              <el-input v-model="instances.descr"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row style="margin: 20px auto">
        <el-col style="font-size: 14px">
          <span>初始化配置或</span>
          <el-button type="text" size="medium" @click="importConfig = true">
            导入配置
          </el-button>
        </el-col>
      </el-row>
      <el-form
        ref="record"
        label-position="top"
        size="medium"
        :rules="rules"
        :model="record"
        @keyup.enter.native="updateConfig">
        <el-row :gutter="20">
          <el-col v-for="item in items" v-if="record[item.key] !== undefined" :span="12" :key="item.key">
            <el-form-item :prop="(item.required || rules[item.key].length > 0) ? item.key : ''" :label="item.key">
              <!-- Boolean -->
              <el-select
                v-if="item.type === 'boolean'"
                v-model="record[item.key]"
                placeholder=""
                clearable>
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
              <!-- Array -->
              <el-select
                v-else-if="item.type === 'array'"
                v-model="record[item.key]"
                placeholder=""
                clearable>
                <el-option
                  v-for="(option, index) in item.default"
                  :key="index"
                  :label="option"
                  :value="option">
                </el-option>
              </el-select>
              <!-- number -->
              <el-input
                v-else-if="item.type === 'number'"
                v-model.number="record[item.key]"
                :placeholder="item.desc">
              </el-input>
              <!-- String (default) -->
              <el-input
                v-else-if="item.default.length > 35"
                v-model="record[item.key]"
                type="textarea"
                :rows="2"
                :placeholder="item.desc">
              </el-input>
              <el-input
                v-else
                v-model="record[item.key]"
                :placeholder="item.desc">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-dialog
        title="导入配置"
        :visible.sync="importConfig"
        width="500px">
        <el-row :gutter="20" type="flex" align="middle" justify="center" style="min-height: 500px">
          <el-col style="text-align: center">
            <el-upload
              action="#"
              accept="application/json"
              :before-upload="handleReader">
              <el-button slot="trigger" type="success" size="large" round>
                选择配置文件
                <i class="el-icon-upload el-icon--right"></i>
              </el-button>
              <div slot="tip" class="el-upload__tip">请确保备份文件为正常 JSON 格式</div>
            </el-upload>
          </el-col>
          <el-col>
            <el-tree
              :data="configTree"
              show-checkbox
              node-key="name">
            </el-tree>
          </el-col>
        </el-row>
      </el-dialog>
      <div class="operation-area">
        <el-button
          class="confirm-btn"
          type="success"
          @click="updateConfig">
          {{ $t('oper.confirm') }}
        </el-button>
        <el-button class="cache-btn" type="text" @click="updateConfig">
          {{ $t('oper.cancel') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>


<script>
import {
  Dialog, Input, Checkbox, CheckboxGroup, Select, Option, Button, Table, TableColumn,
  Breadcrumb, BreadcrumbItem, Form, FormItem, Row, Col, Card,
} from 'element-ui'

import Config from '~/common/config'

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
      importConfig: false,
      serviceName: this.$route.params.serviceName,
      configTree: [{
        id: 'pgsql auth',
        label: 'pgsql auth',
        disabled: true,
        children: [
          {
            id: 'instances',
            label: 'xxxxxxxx',
          },
        ],
      }],
      backupFile: {
        type: 'service',
        fileName: '',
        content: '',
        feature: {},
        services: [],
        instances: {},
      },
      service: {},
      record: {},
      instances: {
        name: '',
        descr: '',
        serviceName: this.serviceName,
      },
      rules: {},
      instanceRules: {
        name: [
          { required: true, message: 'Name is required' },
        ],
        descr: [
          { required: true, message: 'Descrption is required' },
        ],
      },
      items: [],
    }
  },
  methods: {
    updateConfig() {},
    loadData() {
      this.$httpGet(`/services/${this.serviceName}`).then((response) => {
        this.service = response.data
        this.rules = Config.rulesConstructor(response.data.schema)
        this.initForm()
      }).catch((error) => {
        this.$message.error(error.message || '网络错误')
      })
    },
    handleReader(file) {
      if (file) {
        this.backupFile.fileName = file.name
        const reader = new FileReader()
        reader.onload = () => {
          this.configParse(reader.result)
        }
        reader.readAsText(file)
      }
      return false
    },
    configParse(content = '') {
      try {
        const config = JSON.parse(content)
        console.log(config)
        if (!['service', 'cluster'].includes(config.type)) {
          throw new Error('Not a valid config file')
        }
        this.configTree = []
        this.backupFile.content = content
        this.backupFile.feature = config.feature
        this.backupFile.instances = []
        if (config.type === 'service') {
          this.configTree.push({
            name: config.name,
            label: config.name,
            disabled: true,
            // 从 Service 的 payload 中加载 instance
            children: config.payload.map((instance) => {
              // stash instance
              this.backupFile.instances[instance.id] = instance
              return {
                name: instance.id,
                label: `${instance.name} ${Object.keys(instance.conf).length} 项配置`,
              }
            }),
          })
        } else {
          // 加载所有的 Service
          config.payload.forEach((service) => {
            this.configTree.push({
              name: service.name,
              label: `Service ${service.name}`,
              disabled: true,
              // 加载 Service 下的 instance
              children: service.payload.map((instance) => {
                // stash instance
                this.backupFile.instances[instance.id] = instance
                return {
                  name: instance.id,
                  label: `${instance.name} ${instance.id}`,
                }
              }),
            })
          })
        }
      } catch (e) {
        this.$message.error(e.message || '导入配置文件出错')
      }
    },
    initForm() {
      this.items = []
      this.service.schema.forEach((item) => {
        item.type = typeof item.default
        if (item.type === 'object') {
          item.type = Array.isArray(item.default) ? 'array' : item.type
        }
        if (item.type === 'array') {
          item.value = item.default[0]
        } else {
          item.value = item.default
        }
        this.$set(this.record, item.key, item.value)
        if (item.value.toString().length > 35) {
          this.items.push(item)
        } else {
          this.items.unshift(item)
        }
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
  .el-select {
    width: 100%;
  }
  .el-upload-list {
    display: none;
  }
}
</style>
