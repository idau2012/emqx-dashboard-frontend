<template>
  <el-row type="flex" justify="space-between" align="middle">
    <el-col>
      <tabs-card-head :tabs="tabs"></tabs-card-head>
    </el-col>
  </el-row>
</template>


<script>
import { Row, Col } from 'element-ui'

import TabsCardHead from '~/components/TabsCardHead'

export default {
  name: 'tabs-head',
  components: {
    'el-row': Row,
    'el-col': Col,
    TabsCardHead,
  },
  data() {
    return {
      tabs: [
        { name: this.$t('instances.all'), path: '/instances', handle: { key: 'state', value: undefined } },
        { name: this.$t('instances.running'), path: '/instances?state=running', handle: { key: 'state', value: 'running' } },
        { name: this.$t('instances.stopped'), path: '/instances?state=stopped', handle: { key: 'state', value: 'stopped' } },
      ],
    }
  },
}
</script>
