<template>
  <div class="service-details">
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item @click.native="$router.go(-1)" class="uppercase">
          {{ $t('instances.instances') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item class="breadcrumb-name">
          {{ instanceID ? instanceName : $t('oper.create') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card :class="['el-card--self', view ? 'card-view' : '']">
      <div slot="header">
        <span v-if="!instanceID">
          {{ instanceID ? `${$t('oper.edit')} ${instanceName}` : `${$t('oper.from')} ${serviceName} ${$t('oper.create')}` }}
        </span>
        <i v-if="instanceID && view" class="el-icon-edit-outline edit-btn" @click="view = false"></i>
        <i v-if="instanceID && view" class="el-icon-download edit-btn" @click="handleExport"></i>
        <i v-else-if="instanceID && !view" class="el-icon-view edit-btn" @click="view = true"></i>
      </div>
      <el-row>
        <el-col class="sub-title" style="font-size: 14px;margin: 0 0 10px 0">
          <span>{{ $t('instances.info') }}</span>
        </el-col>
      </el-row>
      <el-form
        ref="instance"
        :record="instance"
        :rules="instanceID && view ? {} : instanceRules"
        :model="instance"
        :disabled="instanceID && view"
        size="medium"
        label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="name" :label="$t('instances.name')">
              <el-input v-model="instance.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="descr" :label="$t('instances.descr')">
              <el-input v-model="instance.descr"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="instanceID" :span="12">
            <el-form-item :label="$t('instances.service')">
              <el-input v-model="instance.service" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="instanceID" :span="12">
            <el-form-item :label="$t('config.createAt')">
              <el-input disabled :value="instance.createAt | dateFormat"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col class="sub-title">
          <span>{{ instanceID ? $t('instances.configInfo') : $t('instances.initConfig')}}</span>
          <el-button v-if="!view && $env.components.includes('qingcloud')" type="text" style="padding: 0" size="medium" @click="handleImportCloud">
            {{ $t('config.importCloud') }}
          </el-button>
          <el-popover
            v-if="!view && $env.components.includes('qingcloud')"
            placement="right"
            width="200"
            :title="$t('oper.prompt')"
            trigger="hover">
            <p v-html="$t('config.noticeCloud')" style="text-align: left"></p>
            <i slot="reference" class="fa fa-question-circle-o tips" aria-hidden="true"></i>
          </el-popover>
          <el-button v-if="!view" type="text" style="padding: 0;" size="medium" @click="handleImport">
            {{ $t('config.importConfig') }}
          </el-button>
          <el-popover
            v-if="!view"
            placement="right"
            width="200"
            :title="$t('oper.prompt')"
            trigger="hover">
            <p v-html="$t('config.notice')" style="text-align: left"></p>
            <i slot="reference" class="fa fa-question-circle-o tips" aria-hidden="true"></i>
          </el-popover>
        </el-col>
      </el-row>
      <el-form
        ref="record"
        :record="record"
        :rules="instanceID && view ? {} : rules"
        :model="record"
        :disabled="instanceID && view"
        size="medium"
        label-position="top">
        <el-row :gutter="20">
          <div v-for="item in items" :key="item.key">
            <!-- 不带高级配置的 -->
            <el-col v-if="record[item.selfKey] !== undefined && !item.key.includes('.$name')" :span="12">
            <el-form-item :prop="(item.required || rules[item.selfKey]) ? item.selfKey : ''" :label="item.key">
              <!-- Boolean -->
              <el-select
                v-if="item.type === 'boolean'"
                v-model="record[item.selfKey]"
                clearable>
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
              <!-- Array -->
              <el-select
                v-else-if="item.type === 'array'"
                v-model="record[item.selfKey]"
                placeholder=""
                clearable>
                <el-option
                  v-for="(option, index) in item.default"
                  :key="index"
                  :label="option.toString()"
                  :value="option">
                </el-option>
              </el-select>
              <!-- number -->
              <el-input
                v-else-if="item.type === 'number'"
                v-model.number="record[item.selfKey]"
                :placeholder="item.desc">
              </el-input>
              <!-- String (default) -->
              <el-input
                v-else-if="item.default.length > 35"
                v-model="record[item.selfKey]"
                type="textarea"
                :rows="2"
                :placeholder="item.desc">
              </el-input>
              <el-input
                v-else
                v-model="record[item.selfKey]"
                :placeholder="item.desc">
              </el-input>
            </el-form-item>
            </el-col>
            <el-col v-else-if="record[item.selfKey] !== undefined && item.key.includes('.$name')">
              <!-- 渲染高级配置的每一项 -->
              <!-- 高级配置的标题 -->
              <el-form-item :label="item.key.replace(/\.\$name.*/g, '')">
                <div v-for="(option, index) in record[item.selfKey]" class="multiple-block" :key="index">
                  <!-- 渲染每一项的多个字段 -->
                  <el-col v-for="(key, _index) in Object.keys(option)" v-if="key !== 'action'" class="primary-item" :key="_index" :span="8">
                    <el-form-item :label="key" :prop="item.selfKey + '.' + index + '.' + key" :rules="view ? [] : [{ required: true, message: $t('alert.required'), trigger: 'change' }]">
                      <el-input v-model="record[item.selfKey][index][key]"></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- 新增或移除按钮 -->
                  <el-col v-if="!view" :span="8">
                    <el-form-item label=" ">
                      <el-button :type="index === 0 ? 'success' : 'danger'" plain @click="handleMultiple(item.selfKey, index)">{{ index === 0 ? $t('oper.add') : $t('oper.delete') }}</el-button>
                    </el-form-item>
                  </el-col>
                </div>
              </el-form-item>
            </el-col>
          </div>
        </el-row>
      </el-form>
      <div v-if="!view" class="operation-area">
        <el-button
          class="confirm-btn"
          type="success"
          @click="updateConfig">
          {{ $t('oper.confirm') }}
        </el-button>
        <el-button class="cache-btn" type="text" @click="$router.go(-1)">
          {{ $t('oper.cancel') }}
        </el-button>
        <el-button v-if="advance.length > 0" type="text" class="cache-btn" @click="selecting = true">
          {{ $t('plugins.advancedConfig') }}
        </el-button>
      </div>
    </el-card>
    <import-config
      :serviceName="serviceName"
      :visible="importConfig"
      @close="importConfig = false"
      @import="handleImported">
    </import-config>

    <import-cloud
      :option="{ serviceName }"
      :visible="importCloud"
      @close="importCloud = false"
      @import="handleImported">
    </import-cloud>
    <!-- advancedConfig -->
    <el-dialog
      width="500px"
      :title="$t('plugins.advancedConfig')"
      :visible.sync="selecting"
      @keyup.enter.native="moreConfig">
      <div class="advanced-config" :gutter="20">
        <el-checkbox-group v-model="selectedAdvancedConfig">
          <el-checkbox v-for="item in advance" :label="item" :key="item.key">
            {{ item.key }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" class="cache-btn" @click="selecting = false">
          {{ $t('oper.cancel') }}
        </el-button>
        <el-button class="confirm-btn" type="success" @click="moreConfig">
          {{ $t('oper.confirm') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import ImportCloud from '~/components/ImportCloud'
import ImportConfig from '~/components/ImportConfig'
import { Config } from '~/common/utils'
import _dict from '~/common/dict.json'

export default {
  name: 'service-details',
  components: {
    ImportCloud,
    ImportConfig,
  },
  data() {
    return {
      importConfig: false,
      importCloud: false,
      selecting: false,
      serviceName: '',
      instanceName: '',
      instanceID: '',
      service: {},
      record: {},
      rules: {},
      dict: _dict,
      view: true,
      instance: {
        name: '',
        descr: '',
        serviceName: '',
      },
      selectedAdvancedConfig: [],
      instanceRules: {
        name: [
          { required: true, message: this.$t('alert.required') },
        ],
        descr: [
          { required: true, message: this.$t('alert.required') },
        ],
      },
      items: [],
      advance: [],
      multiple: [], // { key: 'xxx', value: {} }
    }
  },
  methods: {
    handleMultiple(key, index) {
      if (index === 0) {
        const d = { ...this.record[key][0] }
        this.record[key].push(d)
      } else {
        const item = []
        this.record[key].forEach((it, i) => {
          if (i !== index) {
            item.push(it)
          }
        })
        this.$set(this.record, key, item)
      }
    },
    handleImport() {
      this.configTree = []
      this.importConfig = true
    },
    handleImportCloud() {
      this.importCloud = true
    },
    handleImported(instance = {}) {
      this.importConfig = false
      this.importCloud = false
      if (instance.conf) {
        Object.keys(instance.conf).forEach((key) => {
          if (instance.conf[key]) {
            this.$set(this.record, key.replace(/\./g, '__'), instance.conf[key])
          }
        })
        this.$message.success(this.$t('config.importSuccess'))
      }
    },
    updateConfig() {
      this.$refs.instance.validate((valid) => {
        if (!valid) {
          return
        }
        this.$refs.record.validate((isValid) => {
          if (!isValid) {
            return
          }
          const config = {}
          Object.keys(this.record).forEach((item) => {
            const key = item.replace(/__/g, '.')
            const value = this.record[item]
            if (!value) {
              return
            }
            // 是多项配置的需要转换
            if (this.dict[key]) {
              value.forEach((it, index) => {
                config[`${key}:${index + 1}`] = JSON.stringify(it)
              })
            } else {
              config[key] = this.record[item]
            }
          })
          if (this.instanceID) {
            this.$httpPut(`/instances/${this.instanceID}`, {
              name: this.instance.name,
              descr: this.instance.descr,
              config,
            }).then(() => {
              this.$message.success(this.$t('oper.editSuccess'))
              this.$router.push('/instances')
            }).catch(this.handleError)
          } else {
            this.instance.serviceName = this.serviceName
            this.$httpPost('/instances', { ...this.instance, config }).then(() => {
              this.$message.success(this.$t('success.success'))
              this.$router.push('/instances')
            }).catch(this.handleError)
          }
        })
      })
    },
    loadData() {
      this.$httpGet(`/services/${this.serviceName}`).then((response) => {
        this.service = response.data
        this.rules = Config.rulesConstructor(response.data.schema)
        this.initForm()
      }).catch(this.handleError)
    },
    handleError(error) {
      this.$message.error(error.message || this.$t('error.initializationError'))
    },
    // 转换一次
    initInstanceForm() {
      Object.keys(this.instance.conf).forEach((item) => {
        const value = this.instance.conf[item]
        // 未自增的不要
        if (item.includes('.$name') && !item.includes('.$name:')) {
          return
        }
        item = item.replace(/\.\$name.*/g, '.$name')
        const key = item.replace(/\./g, '__')
        // 有值才处理
        if (value) {
          if (this.dict[item]) {
            let it = {}
            try {
              it = JSON.parse(value)
            } catch (e) {
              console.log(e)
            }
            const data = this.record[key] || []
            this.$set(this.record, key, [...data, it])
            console.log('set', it)
          } else {
            this.$set(this.record, key, this.instance.conf[item])
          }
        }
      })
    },
    loadInstance() {
      this.$httpGet(`/instances/${this.instanceID}`).then((response) => {
        this.instance = response.data
        this.instanceName = response.data.name
        this.serviceName = response.data.service
        this.loadData()
      }).catch(this.handleError)
    },
    // 从 schema 渲染
    initForm(resetDefault = false) {
      this.items = []
      this.service.schema.forEach((item) => {
        item.type = typeof item.default
        item.selfKey = item.key.replace(/\./g, '__')
        // 将 dict 具体的值初始化
        if (this.dict[item.key]) {
          // 初始化 dict[0]
          item.$value = [this.dict[item.key]]
        }
        if (item.type === 'object') {
          item.type = Array.isArray(item.default) ? 'array' : item.type
        }
        if (item.type === 'array') {
          item.value = item.default[0] || ''
        } else {
          item.value = item.default || ''
        }
        // 编辑时可以恢复默认值，多项配置放入数组
        if (!this.instanceID || resetDefault) {
          if (this.dict[item.key]) {
            this.$set(this.record, item.selfKey, [this.dict[item]])
          } else {
            this.$set(this.record, item.selfKey, item.value)
          }
        }
        if (item.value.toString().length > 35) {
          this.items.push(item)
        } else {
          this.items.unshift(item)
        }
        // dict 中存在就放到高级设置
        if (this.dict[item.key] || (!item.required && !item.value)) {
          this.advance.push(item)
          this.$delete(this.record, item.selfKey)
        }
      })
      if (this.instanceID && !resetDefault) {
        this.initInstanceForm()
      }
    },
    handleExport() {
      this.$prompt(this.$t('instances.remarkConfig'), this.$t('config.exportConfig'), {
        confirmButtonText: this.$t('config.ex'),
        confirmButtonClass: 'confirm-btn',
        cancelButtonText: this.$t('oper.cancel'),
        cancelButtonClass: 'cache-btn el-button--text',
        inputPattern: /.{3,}/,
        inputErrorMessage: this.$t('config.atLeastThree'),
      }).then(({ value }) => {
        const content = Config.exportConfig({ name: this.serviceName, description: value }, [this.instance])
        Config.renderDownload(JSON.parse(content).fileName, content)
      }).catch((error) => {
        if (error !== 'cancel') {
          this.$message.error(`${this.$t('alert.failure')}: ${error.message}`)
        }
      })
    },
    handleRouter() {
      if (!this.$route.path.includes('/create')) {
        this.instanceID = this.$route.params.instanceID
        this.view = this.$route.query.oper !== 'edit'
        this.loadInstance()
      } else {
        this.serviceName = this.$route.params.serviceName
        this.instanceID = false
        this.view = false
        this.loadData()
      }
    },
    moreConfig() { // 高级配置控制
      const selectedKeyList = []
      // remove cancel select && add selected options
      this.selectedAdvancedConfig.forEach((config) => {
        // add
        if (this.record[config.selfKey] === undefined) {
          if (this.dict[config.key]) {
            this.$set(this.record, config.selfKey, [this.dict[config.key]])
          } else {
            this.$set(this.record, config.selfKey, config.value)
          }
        }
        selectedKeyList.push(config.selfKey)
      })
      // remove
      this.advance.forEach((item) => {
        if (!selectedKeyList.includes(item.selfKey)) {
          this.$delete(this.record, item.selfKey)
        }
      })
      this.selecting = false
    },
  },
  created() {
    this.handleRouter()
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === '') {
      next('/instances')
    } else {
      next()
    }
  },
}
</script>


<style lang="scss">
.service-details {
  .el-card--self {
    margin-top: 24px;
  }
  .edit-btn {
    float: right;
    border-radius: 50%;
    font-size: 14px;
    color: #42d885;
    background-color: #37363d;
    padding: 4px;
    cursor: pointer;
    margin-left: 10px;
    &:hover {
      background-color: #42d885;
      color: #ffffff;
    }
  }
  .sub-title {
    font-size: 14px;
    margin: 0 0 10px 0;
    .el-button {
      margin-left: 6px;
    }
  }
  .el-select {
    width: 100%;
  }
  .el-upload-list {
    display: none;
  }
  .refresh-btn {
    cursor: pointer;
    font-size: 16px;
    padding: 0 !important;
  }
  .tips {
    cursor: pointer;
  }
  .el-checkbox {
    display: block;
    margin-bottom: 10px !important;
    margin-left: 0 !important;
  }
  .primary-item {
  }
  .multiple-block {
    display: flex;
    .el-button {
      float: right;
    }
  }
}
</style>
