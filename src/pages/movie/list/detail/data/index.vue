<template>
  <div class="content" v-loading="loading">
    <div class="count-list">
      <card-count
        v-for="(item, index) in summary"
        :title="item.title"
        :total="item.total"
        :key="index"
      />
    </div>
  </div>
</template>

<script>
import { getMovieData } from "@/api/movie";

export default {
  name: "MovieDetailData",

  inject: ["id"],

  data() {
    return {
      loading: false,
      summary: [],
    };
  },

  mounted() {
    this.getMovieData();
  },

  methods: {
    async getMovieData() {
      this.loading = true;
      const { code, data } = await getMovieData(this.id);
      this.loading = false;

      if (code === 200) {
        this.summary = data.summary;
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
