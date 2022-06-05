<template>
  <div class="content">
    <div class="count-list" v-loading="loading">
      <card-count
        v-for="(item, index) in summary"
        :title="item.title"
        :total="item.total"
        :key="index"
      />
    </div>

    <div class="chart-list">
      <card-chart title="评分分数变化" v-loading="daysLoading" id="ratingChart" />
      <card-chart title="评分人数变化" v-loading="votesLoading" id="voteChart" />
    </div>
  </div>
</template>

<script>
import { getMovieRatingData } from "@/api/movie";
import { barChart } from "@/chart/barChart";

export default {
  name: "MovieDetailRate",

  inject: ["id"],

  data() {
    return {
      loading: false,
      daysLoading: false,
      votesLoading: false,
      summary: [],
      ratingChart: null,
      voteChart: null,
    };
  },
  mounted() {
    this.getMovieRating();

    window.addEventListener(
      "resize",
      this.$Util.debounce(this.chartResize, 100)
    );
  },

  destroyed() {
    window.removeEventListener("resize", this.chartResize);
  },

  methods: {
    // 页面尺寸改变时重置图表
    chartResize() {
      const charts = [this.ratingChart, this.voteChart];

      if (charts.every((chart) => chart)) {
        charts.map((chart) => chart.resize());
      }
    },

    getMovieRating() {
      this.getMovieRatingData();
      this.getMovieRatingDays();
      this.getMovieRatingVotes();
    },

    // 评分数据
    async getMovieRatingData() {
      this.loading = true;
      const { code, data } = await getMovieRatingData(this.id);
      this.loading = false;

      if (code === 200) {
        this.summary = data;
      }
    },

    // 评分分数
    async getMovieRatingDays() {
      this.daysLoading = true;
      const { code, data } = await getMovieRatingData(this.id, { type: "day" });
      this.daysLoading = false;

      if (code === 200) {
        const dates = data.map((i) => i.date);
        const counts = data.map((i) => i.total);

        this.yearChart = barChart("ratingChart", dates, counts, "bar");
      }
    },

    // 评分人数
    async getMovieRatingVotes() {
      this.votesLoading = true;
      const { code, data } = await getMovieRatingData(this.id, {
        type: "vote",
      });
      this.votesLoading = false;

      if (code === 200) {
        const dates = data.map((i) => i.date);
        const counts = data.map((i) => i.total);

        this.yearChart = barChart("voteChart", dates, counts, "bar");
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
