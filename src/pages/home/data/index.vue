<template>
  <div class="content" v-loading="loading">
    <div class="count-list">
      <card-count
        v-for="(item, index) in summary"
        :title="item.title"
        :today="item.today"
        :total="item.total"
        :key="index"
      />
    </div>

    <div class="chart-list">
      <card-chart title="影视近7日新增记录" id="movieChart" />
      <card-chart title="影人近7日新增记录" id="actorChart" />
      <card-chart title="角色近7日新增记录" id="roleChart" />
      <card-chart title="用户近7日新增记录" id="userChart" />
    </div>
  </div>
</template>

<script>
import { getDataSummary } from "@/api/data";
import { getDataDays } from "@/api/data";

import { barChart } from "@/chart/barChart";

export default {
  name: "DataSummary",

  data() {
    return {
      loading: false,
      summary: [],
      movieChart: null,
      actorChart: null,
      roleChart: null,
      userChart: null,
    };
  },

  mounted() {
    this.getAll();

    window.addEventListener(
      "resize",
      this.$Util.debounce(this.chartResize, 100)
    );
  },

  destroyed() {
    window.removeEventListener("resize", this.chartResize);
  },

  methods: {
    async getAll() {
      this.loading = true;
      await Promise.all([this.getDataSummary(), this.getDataDays()]);
      this.loading = false;
    },

    // 页面尺寸改变时重置图表
    chartResize() {
      const charts = [
        this.movieChart,
        this.actorChart,
        this.roleChart,
        this.userChart,
      ];

      if (charts.every((chart) => chart)) {
        charts.map((chart) => chart.resize());
      }
    },

    // 获取资源汇总
    async getDataSummary() {
      const { code, data } = await getDataSummary();

      if (code === 200) {
        this.summary = data;
      }
    },

    // 获取资源日新增汇总
    async getDataDays() {
      const { code, data } = await getDataDays();

      if (code === 200) {
        for (let type in data) {
          let dates = data[type].map((i) => i.date);
          let counts = data[type].map((i) => i.total);
          this[type + "Chart"] = barChart(
            type + "Chart",
            dates,
            counts,
            "line"
          );
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  padding: 8px;
  min-height: calc(100vh - 50px);
  background-color: #f5f6fa;
  box-sizing: border-box;
  .chart-list {
    .card-chart {
      width: 50%;
    }
  }
}
</style>
