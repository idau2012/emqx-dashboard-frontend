<template>
  <div class="tabs-card-head">
    <a
      v-for="(tab, index) in tabs"
      class="tab-title"
      href="javascript:;"
      :class="{ active: $route.query[tab.handle.key] === tab.handle.value }"
      :key="index"
      @click="$router.push(tab.path)">
      {{ tab.name }}
    </a>
  </div>
</template>


<script>
import { Badge } from 'element-ui'

export default {
  name: 'tabs-card-head',
  components: {
    'el-badge': Badge,
  },
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
}
</script>


<style lang="scss">
.tabs-card-head {
  border-bottom: 2px solid #37363b;
  .tab-title {
    color: #a7a7a7;
    display: inline-block;
    line-height: 30px;
    margin: 8px 40px -2px 0;
    min-width: 50px;
    text-align: center;
    &:hover {
      color: #fff;
    }
  }
  .tab-title.active {
    color: #fff;
    border-bottom: 2px solid #227d51;
  }
}
</style>
