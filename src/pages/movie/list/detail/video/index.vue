<template>
  <container-layout>
    <template v-slot:header>
      <m-select
        v-model="form.type"
        :options="videoTypes"
        @change="getData(true)"
        placeholder="所属分类"
      />

      <m-button type="search" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
    </template>

    <template v-slot:default>
      <m-table
        v-loading="loading"
        :data="list"
        :sort.sync="sort"
        @sort-change="getData(true)"
        sortby="duration, size, play_count, like_count, save_count, report_count, created_at"
      >
        <m-table-column label="视频封面" width="175">
          <template slot-scope="scope">
            <img width="120" height="60" :src="scope.row.poster" />
          </template>
        </m-table-column>

        <m-table-column prop="title" label="标题" min-width="200" />
        <m-table-column prop="type_zh" label="类型" width="100" />
        <m-table-column prop="duration" label="时长/s" width="100" />
        <m-table-column prop="size" label="大小/MB" width="100" />
        <m-table-column prop="play_count" label="播放量" width="80" />
        <m-table-column prop="like_count" label="点赞数" width="80" />
        <m-table-column prop="collection_count" label="收藏数" width="80" />
        <m-table-column prop="report_count" label="举报数" width="80" />
        <m-table-column prop="created_at" label="上传时间" width="90" />
        <m-table-column label="上传者" width="100">
          <template slot-scope="scope">
            <user-popover :user="scope.row.author" />
          </template>
        </m-table-column>
        <m-table-column label="状态" width="120" fixed="right">
          <template slot-scope="scope">
            <el-tag type="warning" size="small" v-if="scope.row.status === 0"
              >待审核</el-tag
            >
            <el-tag type="danger" size="small" v-else-if="scope.row.status < 0"
              >未通过</el-tag
            >
            <el-tag type="primary" size="small" v-else>已审核</el-tag>
          </template>
        </m-table-column>
        <m-table-column label="操作" width="230" fixed="right">
          <template slot-scope="scope">
            <m-button type="primary" @click="showDetailDrawer(scope.row)"
              >详情</m-button
            >
            <m-button type="success" @click="showPreviewModal(scope.row)"
              >播放</m-button
            >
            <m-button type="edit" @click="showModal(scope.row)" />
            <m-button type="delete" @click="showDeleteModal(scope.row)" />
          </template>
        </m-table-column>
      </m-table>

      <!-- 视频预览 -->
      <video-preview ref="previewModal">
        <template v-slot:footer>
          <div class="audit-wrapper">
            <el-button type="primary" @click="showStatusModal()"
              >审 核</el-button
            >
          </div>
        </template>
      </video-preview>

      <!-- 新增与编辑 -->
      <video-modal ref="modal" @on-success="getData()" />

      <!-- 详情 -->
      <detail-drawer ref="detailDrawer" @on-success="getData()" />

      <!-- 审核 -->
      <status-modal ref="statusModal" @on-success="getData()" />

      <!-- 删除 -->
      <delete-modal ref="deleteModal" type="video" @on-success="getData()" />
    </template>

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import VideoModal from "./components/VideoModal";
import DetailDrawer from "./components/DetailDrawer";
import StatusModal from "@/components/Video/StatusModal";

import { videoTypes } from "@/config/basic";
import { getMovieVideos } from "@/api/movie";

export default {
  name: "MovieDetailVideos",

  components: {
    VideoModal,
    DetailDrawer,
    StatusModal,
  },

  inject: ["id"],

  data() {
    return {
      ...this.$defaults(),
      form: {
        type: "",
      },
      videoTypes,
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    // 获取视频列表
    getData(isReset) {
      this.$getData(getMovieVideos, this, isReset, this.id);
    },

    // 显示详情
    showDetailDrawer(row) {
      this.$refs.detailDrawer.open(row);
    },

    // 显示编辑
    showModal(row) {
      if (row) {
        row = {
          id: row.id,
          type: row.type,
          title: row.title,
          poster: row.poster,
          url: row.original_url,
          content: row.content,
        };
      }

      this.$refs["modal"].open(row);
    },

    // 变更状态
    showStatusModal() {
      this.$refs["statusModal"].open(this.video.id);
    },

    // 删除
    showDeleteModal(row) {
      this.$refs["deleteModal"].open(null, row.id);
    },

    // 视频预览
    showPreviewModal(row) {
      this.video = row;
      this.$refs["previewModal"].open(row);
    },
  },
};
</script>

<style scoped lang="scss">
.audit-wrapper {
  padding-top: 15px;
  text-align: right;
}
</style>
