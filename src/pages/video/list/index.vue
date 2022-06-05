<template>
  <container-layout>
    <template v-slot:header>
      <m-select
        v-model="form.status"
        :options="statusList"
        placeholder="视频状态"
      />

      <m-select
        v-model="form.type"
        :options="videoTypes"
        placeholder="所属类型"
      />

      <el-input
        size="medium"
        clearable
        v-model="form.keyword"
        @keyup.enter.native="getData(true)"
        placeholder="视频 ID / 标题"
      />
      <m-button type="search" @click="getData(true)" :loading="loading" />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
      sortby="duration, size, play_count, like_count, save_count, comment_count, report_count, created_at"
    >
      <m-table-column label="封面" width="142">
        <template slot-scope="scope">
          <img class="video-poster" :src="scope.row.poster" />
        </template>
      </m-table-column>
      <m-table-column prop="movie" label="所属影视" width="160">
        <template slot-scope="scope">
          <movie-popover :movie="scope.row.movie" />
        </template>
      </m-table-column>
      <m-table-column prop="type_zh" label="类型" width="80" />
      <m-table-column prop="title" label="标题" width="120" />
      <m-table-column prop="duration" label="时长" width="100" />
      <m-table-column prop="size" label="大小/M" width="80" />
      <m-table-column prop="wh" label="比例" width="100" />
      <m-table-column prop="coding" label="编码" width="80" />
      <m-table-column prop="play_count" label="播放数" width="80" />
      <m-table-column prop="like_count" label="点赞数" width="80" />
      <m-table-column prop="collection_count" label="收藏数" width="80" />
      <m-table-column prop="comment_count" label="评论数" width="80" />
      <m-table-column prop="report_count" label="举报数" width="80" />
      <m-table-column prop="created_at" label="创建时间" width="100" />
      <m-table-column
        prop="brief"
        label="简介"
        min-width="160"
        show-overflow-tooltip
      />
      <m-table-column prop="movie" label="作者" width="120">
        <template slot-scope="scope">
          <user-popover :user="scope.row.author" />
        </template>
      </m-table-column>

      <m-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <m-button type="success" @click="showPreviewModal(scope.row)"
            >播放</m-button
          >
          <m-button type="detail" :to="`/video/list/${scope.row.id}/data`" />
          <m-button type="delete" @click="showDeleteModal(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <!-- 删除 -->
    <delete-modal ref="deleteModal" type="video" @on-success="getData" />

    <!-- 状态 -->
    <status-modal ref="statusModal" @on-success="getData" />

    <!-- 视频预览 -->
    <video-preview ref="previewModal">
      <template v-slot:footer>
        <div class="audit-wrapper">
          <el-button type="primary" @click="showStatusModal()">审 核</el-button>
        </div>
      </template>
    </video-preview>

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import { getVideos } from "@/api/video";
import { videoTypes } from "@/config/basic";
import StatusModal from "@/components/Video/StatusModal";

export default {
  name: "VideoList",

  components: {
    StatusModal,
  },

  data() {
    return {
      ...this.$defaults(),

      form: {
        status: null,
        type: null,
        video_id: null,
      },

      statusList: [
        {
          label: "待审核",
          value: 0,
        },
        {
          label: "已通过",
          value: 1,
        },
        {
          label: "未通过",
          value: -1,
        },
      ],

      video: null,

      videoTypes,
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    // 获取视频列表
    getData(isReset) {
      this.$getData(getVideos, this, isReset);
    },

    // 视频预览
    showPreviewModal(row) {
      this.video = row;
      this.$refs["previewModal"].open(row);
    },

    // 设置状态
    showStatusModal() {
      this.$refs["statusModal"].open(this.video.id);
    },

    // 删除视频
    showDeleteModal(row) {
      this.$refs["deleteModal"].open(row.id);
    },
  },
};
</script>

<style scoped lang="scss">
.video-poster {
  width: 120px;
  height: 60px;
}
.audit-wrapper {
  padding-top: 15px;
  text-align: right;
}
</style>