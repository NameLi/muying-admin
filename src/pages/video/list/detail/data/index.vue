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
import { getVideoData } from "@/api/video";

export default {
  name: "VideoDetailData",

  inject: ["id"],

  data() {
    return {
      loading: false,
      summary: [],

      chartList: [
        {
          title: "日/周/月访问次数折线图",
        },
      ],
    };
  },

  mounted() {
    this.getVideoData();
  },

  methods: {
    // 获取视频数据
    async getVideoData() {
      this.loading = true;
      const { code, data } = await getVideoData(this.id);
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
  background-color: #f5f6fa;
  box-sizing: border-box;
  min-height: calc(100vh - 50px);
}
</style>
