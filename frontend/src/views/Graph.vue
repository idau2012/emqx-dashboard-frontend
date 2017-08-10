<template>
  <div class="graph-view" v-loading="loading">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/cluster' }">Cluster</el-breadcrumb-item>
      <el-breadcrumb-item>{{ nodeName }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page-title">{{ graphName }} Graph</div>
    <iframe v-bind:src="'http://' + hostname + ':3000/dashboard/file/' + graphFile"
      style="border:none;width:100%;"
      width="100%"
      :height="iframeHeight"
      frameborder="0"
      scrolling="no"
      id="node-grafana">
    </iframe>
  </div>
</template>


<script>
import NProgress from 'nprogress'

export default {
  name: 'overview-view',
  data() {
    return {
      loading: false,
      hostname: '127.0.0.1',
      nodeName: '',
      graphName: 'EMQ',
      graphFile: 'EMQ.json',
      iframeHeight: '1100px',
    }
  },
  created() {
    this.hostname = window.location.hostname
  },
  mounted() {
    this.iframeLoaded()
    const nodeHost = this.nodeName.replace(/@/, '~')
    switch (this.$route.params.graph_type) {
      case 'emq':
        this.iframeHeight = '1100px'
        this.graphName = 'EMQ'
        this.graphFile = `EMQ.json?var-host=${nodeHost}`
        break
      case 'host':
        this.iframeHeight = '2100px'
        this.graphName = 'Host'
        this.graphFile = `System_Overview.json?var-host=${this.nodeName}`
        break
      case 'erlang':
        this.iframeHeight = '900px'
        this.graphName = 'ErlangVM'
        this.graphFile = `ErlangVM.json?var-host=${nodeHost}`
        break
      default:
        this.iframeHeight = '1100px'
        this.graphName = 'EMQ'
        this.graphFile = `EMQ.json?var-host=${nodeHost}`
    }
  },
  methods: {
    iframeLoaded() {
      NProgress.start()
      this.loading = true
      this.nodeName = atob(this.$route.params.node)
      document.getElementById('node-grafana').onload = () => {
        NProgress.done()
        this.loading = false
      }
    },
  },
}
</script>


<style>
.graph-view {
  padding-top: 20px;
}
.graph-view .el-breadcrumb {
  margin-top: 10px;
  margin-bottom: 20px;
}
.graph-view .page-title {
  position: absolute;
  padding: 10px 0;
}
.graph-view .el-loading-spinner {
  top: 10%;
}
</style>

