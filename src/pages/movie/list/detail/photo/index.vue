<template>
  <photo-page category="movie" :option="option">
    <!-- 照片分类 -->
    <template slot="header">
      <el-cascader
        style="width: 150px; margin-right: 10px"
        v-model="photoTypes"
        :loading="countLoading"
        :options="photoTypeList"
        :props="{ expandTrigger: 'hover' }"
        size="medium"
        clearable
        placeholder="照片类型"
      >
        <template slot-scope="{ data }">
          <span>{{ data.label }}</span>
          <span style="float: right"> ({{ data.count }}) </span>
        </template>
      </el-cascader>
    </template>

    <template slot="header-create">
      <m-button type="create" @click="showPhotoUploadModal()" />
    </template>

    <!-- 图片上传管理 -->
    <photo-upload-modal
      ref="uploadModal"
      :id="id"
      :photo-type="photoType"
      category="movie"
    >
      <template slot="header">
        <div class="photo-header">
          <el-cascader
            style="width: 182px"
            v-model="photoType"
            :options="moviePhotoTypes"
            :props="{ expandTrigger: 'hover' }"
            placeholder="请选择图片分类"
          />
        </div>
      </template>
    </photo-upload-modal>
  </photo-page>
</template>

<script>
import { getMoviePhotosCount } from "@/api/movie";
import { moviePhotoTypes } from "@/config/basic";

export default {
  name: "MovieDetailPhotos",

  inject: ["id"],

  data() {
    return {
      photoTypes: [],

      countLoading: false,

      moviePhotoTypes,

      photoType: [],
      photoTypeList: [],
    };
  },

  computed: {
    option() {
      let type = null;
      let subtype = null;
      let types = this.photoTypes;

      if (types.length === 2) {
        type = types[0];
        subtype = types[1];
      } else if (types.length === 1) {
        type = types[0];
      }

      return {
        type,
        subtype,
      };
    },
  },

  mounted() {
    this.getMoviePhotosCount();
  },

  methods: {
    // 图片上传
    showPhotoUploadModal() {
      this.$refs.uploadModal.open();
    },

    // 影视相册分类统计
    async getMoviePhotosCount() {
      this.countLoading = true;
      const { code, data } = await getMoviePhotosCount(this.id);
      this.countLoading = false;

      if (code === 200) {
        this.photoTypeList = data;
      }
    },
  },
};
</script>