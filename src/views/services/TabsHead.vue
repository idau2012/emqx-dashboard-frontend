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
        { name: 'All', path: '/services', handle: { key: 'type', value: undefined } },
        { name: 'Auth', path: '/services?type=auth', handle: { key: 'type', value: 'auth' } },
        { name: 'Backend', path: '/services?type=backend', handle: { key: 'type', value: 'backend' } },
        { name: 'Bridge', path: '/services?type=bridge', handle: { key: 'type', value: 'bridge' } },
        { name: 'Hock', path: '/services?type=hock', handle: { key: 'type', value: 'hock' } },
        { name: 'Other', path: '/services?type=other', handle: { key: 'type', value: 'other' } },
      ],
    }
  },
}
</script>
