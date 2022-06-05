<template>
  <container-layout>
    <!-- 头部搜索栏 START -->
    <template slot="header">
      <div @keyup.enter="getPhotos(true)" v-if="!isBatch">
        <!-- 自定义内容区 -->

        <slot name="header" />

        <m-select
          v-model="form.status"
          :options="statusList"
          placeholder="选择图片状态"
        />

        <m-button type="search" @click="getPhotos(true)" :loading="loading" />

        <slot name="header-create" />

        <el-button type="warning" size="medium" @click="isBatch = true"
          >批量设置</el-button
        >
      </div>

      <!-- 批量设置 -->
      <div v-else>
        <el-button
          type="success"
          plain
          size="medium"
          @click="showBatchAuditModal()"
          >批量审核</el-button
        >

        <el-button
          type="danger"
          plain
          size="medium"
          @click="showBatchDeleteModal()"
          >批量删除</el-button
        >

        <el-button size="medium" plain @click="isBatch = false">取消</el-button>
      </div>
    </template>
    <!-- 头部搜索栏 END -->

    <!-- 图片列表区域 START -->
    <div class="list" ref="list" v-loading="loading">
      <ul class="photo-list" v-if="photos.length">
        <photo-item
          v-for="item in photos"
          :key="item.id"
          :photo="item"
          :is-batch="isBatch"
          @on-preview="showPreviewModal"
          @on-delete="showDeleteModal"
          @on-audit="showStatusModal"
        />
      </ul>

      <div v-else>
        <p class="no-data">暂无数据</p>
      </div>
    </div>

    <!-- 图片列表区域 END -->

    <slot />

    <!-- 图片预览 -->
    <el-image-viewer
      v-if="showPreview"
      :on-close="
        () => {
          showPreview = false;
        }
      "
      :url-list="previewList"
    />

    <!-- 图片删除 -->
    <delete-modal ref="deleteModal" type="photo" @on-success="getPhotos()" />

    <!-- 图片审核 -->
    <photo-status-modal
      ref="statusModal"
      type="photo"
      @on-change="getPhotos()"
    />

    <!-- 页脚分页信息 -->
    <template slot="footer">
      <m-pagination :pagination.sync="pagination" @on-change="getPhotos()" />
    </template>
  </container-layout>
</template>

<script>
import ElImageViewer from "element-ui/packages/image/src/image-viewer";

import PhotoItem from "../PhotoItem";
import PhotoStatusModal from "../PhotoStatusModal";

import { getPhotos, getTypePhotos } from "@/api/photo";

import { batchDeletePhotos } from "@/api/photo";

export default {
  name: "PhotoPage",

  components: {
    PhotoItem,
    PhotoStatusModal,
    ElImageViewer,
  },

  props: {
    category: {
      required: true,
      type: String,
    },
    option: {
      type: Object,
    },
    getPhoto: {
      type: Function,
    },
  },

  data() {
    return {
      ...this.$defaults(),

      id: null,

      isShowImageUpload: false,
      countLoading: false,

      isBatch: false,

      form: {
        status: null,
        type: [],
      },

      photos: [],

      photoType: [],
      photoTypeList: [],

      statusList: [
        {
          label: "未审核",
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

      typeList: [],

      showPreview: false, // 图片预览
      previewList: [],
    };
  },

  mounted() {
    this.id = this.$route.params.id || null;
    this.getPhotos();
  },

  methods: {
    // 获取影视相册列表
    async getPhotos(reset = false) {
      if (reset) {
        this.pagination.page = 1;
      }

      this.$refs.list.scrollTop = 0;

      let params = {
        category: this.category,
        ...this.option,
        ...this.form,
        ...this.pagination,
      };

      this.loading = true;
      const { code, data, total } = this.id
        ? await getTypePhotos(this.category + "s", this.id, params)
        : await getPhotos(params);
      this.loading = false;

      if (code === 200) {
        for (let item of data) {
          item.size = (item.size / 1024 / 1024).toFixed(2);
          item.isChecked = false;
        }

        this.photos = data;
        this.pagination.total = total;
      }
    },

    // 图片上传
    showPhotoUploadModal() {
      this.$refs.uploadModal.open();
    },

    // 图片预览
    showPreviewModal(photo) {
      this.previewList = [photo];
      this.showPreview = true;
    },

    // 显示删除图片 modal
    showDeleteModal(row) {
      this.$refs["deleteModal"].open(row.id);
    },

    // 批量删除 modal
    showBatchDeleteModal() {
      let photos = this.photos.filter((item) => item.isChecked);
      let photoIds = photos.map((item) => item.id);

      if (photoIds.length === 0) {
        this.$message.warning("请选择需删除的图片");
        return;
      }

      this.$refs["deleteModal"].open(batchDeletePhotos, photoIds);
    },

    // 显示图片审核 modal
    showStatusModal(photo) {
      this.$refs["statusModal"].open(photo);
    },

    // 显示审核原因 modal
    showBatchAuditModal() {
      let photos = this.photos.filter((item) => item.isChecked);

      if (photos.length === 0) {
        this.$message.warning("请选择需要审核的图片");
        return;
      }

      this.$refs["statusModal"].open(photos);
    },
  },
};
</script>

<style scoped lang="scss">
.list {
  height: calc(100vh - 170px);
  padding: 10px;
  overflow: auto;
  .no-data {
    height: calc(100vh - 200px);
    line-height: calc(100vh - 200px);
    text-align: center;
    font-size: 14px;
    color: #999;
  }
}
</style>