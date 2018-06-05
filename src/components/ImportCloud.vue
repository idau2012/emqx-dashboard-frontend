<!-- import config from cloud -->
<template>
  <div class="import-cloud">
    <el-dialog
      class="config-config"
      width="500px"
      :title="$t('config.importCloud')"
      :visible="visible"
      @close="$emit('close')">
      <p>{{ option.serviceName }} {{ $t('config.available') }}</p>
      <el-row class="resource-list" :gutter="10">
        <el-col v-if="resources.length === 0" class="blank-block" :span="24">
          <p>{{ $t('error.blank') }}</p>
        </el-col>
        <div v-else>
          <el-col v-for="(item, index) in resources" :span="12" :key="index" @click.native="handleSelected(item)">
            <div :class="{ 'resource-item': true, selected: item.cluster_id === instance.cluster_id }">
              <span>
                {{ item.cluster_id }}
              </span>
              <p>
                {{ item.info.cpu + ' Core ' + item.info.mem + ' MB ' + item.info.node + ' Nodes ' }}
              </p>
            </div>
          </el-col>
        </div>
      </el-row>

      <div slot="footer">
        <el-button type="text" class="cache-btn" @click="$emit('close')">
          {{ $t('oper.cancel') }}
        </el-button>
        <el-button
          type="success"
          class="confirm-btn"
          :disabled="!instance.cluster_id"
          @click="handleImport">
          {{ $t('oper.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  name: 'import-cloud',
  props: {
    option: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      resources: [],
      instance: {},
    }
  },
  watch: {
    visible: 'loadData',
  },
  methods: {
    loadData(load = true, _serviceName) {
      const serviceName = _serviceName || this.option.serviceName
      if (load && serviceName) {
        this.instance = {}
        this.$httpGet(
          `/services/${serviceName}/available_deps`,
          { platform: this.option.platform || this.$env.platform },
        ).then((response) => {
          const { enable, clusters } = response.data
          if (enable) {
            this.resources = clusters.map(($) => {
              const server = $.hosts ? $.hosts[0] || {} : {}
              const { cpu = 1, mem = 1 } = server
              $.info = {
                cpu,
                mem,
                node: $.hosts ? $.hosts.length : 1,
              }
              return $
            })
            return this.$emit('ready')
          }
        })
      }
    },
    handleSelected(item) {
      if (item.cluster_id === this.instance.cluster_id) {
        this.instance = {}
      } else {
        this.instance = { ...item }
        this.instance.conf = this.instance.config
      }
    },
    handleImport() {
      this.$emit('import', this.instance)
    },
  },
  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
.import-cloud {
  .resource-list {
    .resource-item {
      border: 2px solid #f1f1f1;
      border-radius: 2px;
      padding: 10px;
      cursor: pointer;
      &.selected {
        border-color: #42d885;
      }
    }
  }
  .blank-block {
    text-align: center;
    height: 200px;
    line-height: 200px;
  }
}
</style>
