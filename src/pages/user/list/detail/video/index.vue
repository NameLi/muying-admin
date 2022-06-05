<template>
  <container-layout>
    <template v-slot:header>
      <m-button type="refresh" :loading="loading" @click="getData(true)" />
    </template>

    <template v-slot:default>
      <m-table
        v-loading="loading"
        :data="list"
        :sort.sync="sort"
        @sort-change="getData(true)"
        sortBy="duration, size, play_count, like_count, save_count, report_count, created_at"
      >
        <m-table-column label="视频封面" width="175">
          <template slot-scope="scope">
            <img class="poster" :src="scope.row.poster" />
          </template>
        </m-table-column>

        <m-table-column prop="title" label="标题" min-width="220" />
        <m-table-column prop="duration" label="时长/s" width="100" />
        <m-table-column prop="size" label="大小/MB" width="100" />

        <m-table-column label="所属影视" width="120">
          <template slot-scope="scope">
            <movie-popover :movie="scope.row.movie" />
          </template>
        </m-table-column>

        <m-table-column prop="play_count" label="播放量" width="100" />
        <m-table-column prop="like_count" label="点赞数" width="100" />
        <m-table-column prop="collection_count" label="收藏数" width="100" />
        <m-table-column prop="report_count" label="举报数" width="100" />
        <m-table-column prop="created_at" label="上传时间" width="100" />
        <m-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <m-button type="detail" @click="showPreviewModal(scope.row)"
              >查看</m-button
            >
            <m-button type="delete" @click="showDeleteModal(scope.row)" />
          </template>
        </m-table-column>
      </m-table>

      <!-- 视频播放 -->
      <video-preview ref="previewModal" />

      <!-- 删除视频 -->
      <delete-modal ref="deleteModal" type="video" />
    </template>

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import { getUserVideos } from "@/api/user";

export default {
  name: "UserDetailVideos",

  inject: ["id"],

  data() {
    return {
      ...this.$defaults(),
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    // 获取用户视频列表
    getData(isReset) {
      this.$getData(getUserVideos, this, isReset, this.id);
    },

    // 视频预览
    showPreviewModal(row) {
      this.$refs["previewModal"].open(row);
    },

    // 删除视频
    showDeleteModal(row) {
      this.$refs["deleteModal"].open(row.id);
    },
  },
};
</script>
