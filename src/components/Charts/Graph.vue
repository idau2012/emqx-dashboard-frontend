<template>
  <div :ref="chartId">
  </div>
</template>


<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/graphic'
import 'echarts/lib/chart/graph'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

export default {
  name: 'graph-chart',
  props: {
    chartId: { // DOM 容器的 id
      type: String,
      required: true,
    },
    redraw: { // 是否重新绘制
      type: Boolean,
      default: true,
    },
    // chartColor: { // 线的颜色
    //   type: Object,
    //   default: () => ['#23c88e'],
    // },
  },
  data() {
    return {}
  },
  methods: {
    drawChart() {
      const chart = echarts.init(this.$refs[this.chartId])
      chart.setOption({
        title: {
          text: 'Graph 简单示例',
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            name: '节点关系',
            layout: 'none',
            symbolSize: 50,
            roam: true,
            label: {
              normal: {
                show: true,
              },
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              normal: {
                textStyle: {
                  fontSize: 20,
                },
              },
            },
            data: [
              {
                name: 'emqx@127.0.0.1',
                value: '127.0.0.1',
                x: 100,
                y: 100,
              },
              {
                name: 'Postgresql',
                value: '10.12.11.12:5432',
                x: 200,
                y: 100,
              },
            ],
            // links: [],
            links: [
              {
                target: 1,
                source: 0,
              }],
            lineStyle: {
              normal: {
                opacity: 0.9,
                width: 2,
                curveness: 0,
              },
            },
          },
        ],
      })
    },
  },
  mounted() {
    this.drawChart()
  },
}
</script>


<style lang="scss">
  .graph {
  }
</style>
