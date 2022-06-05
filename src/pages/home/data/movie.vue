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
      <card-chart title="影视评分分布" id="ratingChart" />
      <card-chart title="影视年代分布" id="yearChart" />
      <card-chart title="影视国家/地区分布" id="countryChart" />
      <card-chart title="影视类型分布" id="genreChart" />
    </div>
  </div>
</template>

<script>
import {
  getDataMovies,
  getDataYears,
  getDataCountries,
  getDataGenres,
  getDataRatings,
} from "@/api/data";

import countTo from "vue-count-to";
import { barChart } from "@/chart/barChart";

export default {
  name: "DataMovie",
  components: { countTo },
  data() {
    return {
      loading: false,
      summary: [],

      yearChart: null,
      countryChart: null,
      genreChart: null,
      ratingChart: null,
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
        this.getDataMovies(),
        this.getDataYears(),
        this.getDataCountries(),
        this.getDataGenres(),
        this.getDataRatings(),
      ]);

      this.loading = false;
    },

    // 页面尺寸改变时重置图表
    chartResize() {
      const charts = [
        this.ratingChart,
        this.yearChart,
        this.countryChart,
        this.genreChart,
      ];

      if (charts.every((chart) => chart)) {
        charts.map((chart) => chart.resize());
      }
    },

    // 获取影视数据汇总
    async getDataMovies() {
      const { code, data } = await getDataMovies();

      if (code === 200) {
        this.summary = data;
      }
    },

    // 获取影视评分数据汇总
    async getDataRatings() {
      let { code, data } = await getDataRatings();

      if (code === 200) {
        const ratings = data.map((i) => i.rating);
        const counts = data.map((i) => i.total);
        this.ratingChart = barChart("ratingChart", ratings, counts);
      }
    },

    // 获取影视上映年份汇总
    async getDataYears() {
      const { code, data } = await getDataYears({ type: "movie" });

      if (code === 200) {
        const years = data.map((i) => i.year);
        const counts = data.map((i) => i.total);

        this.yearChart = barChart("yearChart", years, counts, "bar", true);
      }
    },

    // 获取影视创作国家/地区汇总
    async getDataCountries() {
      const { code, data } = await getDataCountries({ type: "movie" });

      if (code === 200) {
        const countries = data.map((i) => i.country);
        const counts = data.map((i) => i.total);

        this.countryChart = barChart("countryChart", countries, counts);
      }
    },

    // 获取影视类型汇总
    async getDataGenres() {
      const { code, data } = await getDataGenres();

      if (code === 200) {
        const genres = data.map((i) => i.genre);
        const counts = data.map((i) => i.total);

        this.genreChart = barChart("genreChart", genres, counts);
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
