<template>
  <div class="import-config">
    <el-dialog
      class="config-dialog"
      width="500px"
      :visible="visible"
      :title="$t('config.importConfig')"
      @open="configTree = []"
      @close="$emit('close')">
      <div v-if="configTree.length === 0" class="config__upload">
        <el-upload
          action="#"
          accept="application/json"
          :before-upload="handleReader">
          <el-button slot="trigger" type="success" size="large" round>
            {{ $t('config.selectConfigFile') }}
            <i class="el-icon-upload el-icon--right"></i>
          </el-button>
          <div slot="tip" class="el-upload__tip">
            {{ $t('config.configFileMustBeJson') }}
          </div>
        </el-upload>
      </div>
      <div v-else class="config__tree">
        <div class="config__info">
          <p>{{ fileName }} {{ $t('config.createBy') }} {{ feature.owner }} {{ $t('config.create') }}
            <el-popover
              placement="right"
              width="200"
              trigger="hover">
              <div class="config__details">
                {{ $t('config.createUser') }}：{{ feature.owner }}<br/>
                {{ $t('config.nodeName') }}：{{ feature.nodeName }}<br/>
                {{ $t('config.host') }}：{{ feature.host }}<br/>
                {{ $t('config.descr') }}：{{ description }}<br/>
                {{ $t('config.createAt') }}：{{ feature.createAt }}
              </div>
              <el-button slot="reference" type="text">
                {{ $t('config.more') }}
              </el-button>
            </el-popover>
            <el-button type="text" class="re-select" @click="configTree = []">
              {{ $t('config.reSelect') }}
            </el-button>
          </p>
        </div>
        <el-tree
          :data="configTree"
          :default-expanded-keys="defaultExpanded"
          ref="node"
          accordion
          show-checkbox
          node-key="name"
          @check-change="handleTreeClick">
        </el-tree>
      </div>
      <div slot="footer">
        <el-button type="text" class="cache-btn" @click="$emit('close')">
          {{ $t('oper.cancel') }}
        </el-button>
        <el-button
          type="success"
          class="confirm-btn"
          :disabled="!selectedInstance.name || configTree.length === 0"
          @click="handleImport">
          {{ $t('oper.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  name: 'import-config',
  props: {
    serviceName: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      type: 'service',
      fileName: '',
      content: '',
      description: '',
      feature: {},
      // stash target
      instances: {},
      // target
      selectedInstance: {},
      configTree: [],
      defaultExpanded: [],
    }
  },
  methods: {
    handleReader(file) {
      if (file) {
        this.fileName = file.name
        const reader = new FileReader()
        reader.onload = () => {
          this.configParse(reader.result)
        }
        reader.readAsText(file)
      }
      return false
    },
    handleTreeClick(data, checked) {
      if (!checked && data.name === this.selectedInstance.id) {
        this.selectedInstance = {}
      }
      // select just one
      if (checked && !data.children) {
        this.$refs.node.setCheckedNodes([])
        this.$refs.node.setCheckedNodes([data])
        this.selectedInstance = this.instances[data.name]
      }
    },
    configParse(content = '') {
      try {
        const config = JSON.parse(content)
        if (!['service', 'cluster'].includes(config.type)) {
          throw new Error(this.$t('config.not_a_valid_config_file'))
        }
        this.configTree = []
        this.content = content
        this.feature = config.feature
        this.description = config.description
        this.instances = {}
        if (config.type === 'service') {
          this.defaultExpanded.push(config.name)
          this.configTree.push({
            name: config.name,
            label: config.name,
            disabled: true,
            // Service -> payload -> instance
            children: config.payload.map((instance) => {
              // stash instance
              this.instances[instance.id] = instance
              return {
                name: instance.id,
                label: `${instance.name}  ${instance.descr}`,
                disabled: instance.service !== this.serviceName,
              }
            }),
          })
        } else {
          // Service -> payload
          config.payload.forEach((service) => {
            if (service.name === this.serviceName) {
              this.defaultExpanded.push(service.name)
            }
            this.configTree.push({
              name: service.name,
              label: service.name,
              disabled: true,
              // Service -> payload -> instance
              children: service.payload.map((instance) => {
                // stash instance
                this.instances[instance.id] = instance
                return {
                  name: instance.id,
                  label: `${instance.name}  ${instance.descr}`,
                  disabled: instance.service !== this.serviceName,
                }
              }),
            })
          })
        }
      } catch (e) {
        this.configTree = []
        this.handleErrorMessage(e)
      }
    },
    handleErrorMessage(error) {
      const content = error.message.includes('$i18n_')
        ? this.$t(`config.${error.message.replace('$i18n_', '')}`)
        : error.message
      this.$message.error(content || this.$t('config.import_file_error'))
    },
    handleImport() {
      this.$emit('import', this.selectedInstance)
    },
  },
  created() {},
}
</script>


<style lang="scss">
.import-config {
  .config-dialog {
    .el-dialog__body {
      height: 400px;
      overflow-y: auto;
    }
    .config__upload {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      height: 100%;
    }
    .config__tree {
      height: 100%;
    }
    .el-button--small {
      font-size: 14px !important;
    }
    .re-select {
      font-size: 14px;
      color: #a7a7a7 !important;
      float: right;
    }
  }
}
</style>
