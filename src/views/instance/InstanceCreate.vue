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
        <el-col class="sub-title" style="font-size: 14px;margin: 30px 0 10px 0">
          <span>{{ instanceID ? $t('instances.configInfo') : $t('instances.initConfig')}}</span>
          <el-button v-if="!view" type="text" style="padding: 0" size="medium" @click="handleImport">
            {{ $t('config.importConfig') }}
          </el-button>
          <el-popover
            v-if="!view"
            placement="right"
            width="200"
            :title="$t('oper.notice')"
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
          <el-col v-for="item in items" v-if="record[item.selfKey] !== undefined" :span="12" :key="item.key">
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
import ImportConfig from '~/components/ImportConfig'
import { Config } from '~/common/utils'

export default {
  name: 'service-details',
  components: {
    ImportConfig,
  },
  data() {
    return {
      importConfig: false,
      selecting: false,
      serviceName: '',
      instanceName: '',
      instanceID: '',
      service: {},
      record: {},
      rules: {},
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
    }
  },
  methods: {
    handleImport() {
      this.configTree = []
      this.importConfig = true
    },
    handleImported(instance = {}) {
      this.importConfig = false
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
            if (!this.record[item]) {
              return
            }
            config[key] = this.record[item]
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
    initInstanceForm() {
      Object.keys(this.instance.conf).forEach((item) => {
        const key = item.replace(/\./g, '__')
        if (this.instance.conf[item]) {
          this.$set(this.record, key, this.instance.conf[item])
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
    initForm(resetDefault = false) {
      this.items = []
      this.service.schema.forEach((item) => {
        item.type = typeof item.default
        item.selfKey = item.key.replace(/\./g, '__')
        if (item.type === 'object') {
          item.type = Array.isArray(item.default) ? 'array' : item.type
        }
        if (item.type === 'array') {
          item.value = item.default[0] || ''
        } else {
          item.value = item.default || ''
        }
        // reset to default when you edit it
        if (!this.instanceID || resetDefault) {
          this.$set(this.record, item.selfKey, item.value)
        }
        if (item.value.toString().length > 35) {
          this.items.push(item)
        } else {
          this.items.unshift(item)
        }
        if (!item.required && !item.value) {
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
    moreConfig() {
      const selectedKeyList = []
      // remove cancel select && add selected options
      this.selectedAdvancedConfig.forEach((config) => {
        // add
        if (this.record[config.selfKey] === undefined) {
          this.$set(this.record, config.selfKey, config.value)
        }
        selectedKeyList.push(config.selfKey)
        // remove
      })
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
    color: #fff !important;
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
}
</style>
