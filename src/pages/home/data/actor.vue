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
      <card-chart title="影人年代分布" id="yearChart" />
      <card-chart title="影人国家/地区分布" id="countryChart" />
      <card-chart title="影人职务分布" id="professionChart" />
    </div>
  </div>
</template>

<script>
import {
  getDataActors,
  getDataYears,
  getDataCountries,
  getDataProfessions,
} from "@/api/data";

import countTo from "vue-count-to";
import { barChart } from "@/chart/barChart";

export default {
  name: "DataActor",
  components: { countTo },
  data() {
    return {
      loading: false,
      summary: [],

      yearChart: null,
      countryChart: null,
      professionChart: null,
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

      await Promise.all([
        this.getDataActors(),
        this.getDataYears(),
        this.getDataCountries(),
        this.getDataProfessions(),
      ]);

      this.loading = false;
    },

    // 页面尺寸改变时重置图表
    chartResize() {
      const charts = [this.yearChart, this.countryChart, this.professionChart];
      if (charts.every((chart) => chart)) {
        charts.map((chart) => chart.resize());
      }
    },

    // 获取影人数据汇总
    async getDataActors() {
      const { code, data } = await getDataActors();

      if (code === 200) {
        this.summary = data;
      }
    },

    // 获取影人出生年份数据
    async getDataYears() {
      const { code, data } = await getDataYears({ type: "actor" });

      if (code === 200) {
        const years = data.map((i) => i.year);
        const counts = data.map((i) => i.total);

        this.yearChart = barChart("yearChart", years, counts, "bar", true);
      }
    },

    // 获取影人国家/地区汇总
    async getDataCountries() {
      const { code, data } = await getDataCountries({ type: "actor" });

      if (code === 200) {
        const countries = data.map((i) => i.country);
        const counts = data.map((i) => i.total);

        this.countryChart = barChart("countryChart", countries, counts);
      }
    },

    // 获取影人主要职务汇总
    async getDataProfessions() {
      const { code, data } = await getDataProfessions();

      if (code === 200) {
        const professions = data.map((i) => i.profession);
        const counts = data.map((i) => i.total);

        this.professionChart = barChart("professionChart", professions, counts);
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
}
</style>
