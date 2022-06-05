<template>
  <photo-page category="actor">
    <template slot="header">
      <m-select
        v-model="photoType"
        :options="actorPhotoTypes"
        :clearable="false"
        placeholder="选择照片类型"
      />
    </template>

    <template slot="header-create">
      <m-button type="create" @click="showPhotoUploadModal()" />
    </template>

    <!-- 图片上传管理 -->
    <photo-upload-modal
      ref="uploadModal"
      :id="id"
      :photo-type="photoType"
      category="actor"
    >
      <template slot="header">
        <div class="photo-header">
          <m-select
            v-model="photoType"
            :options="actorPhotoTypes"
            :clearable="false"
            placeholder="选择照片类型"
          />
        </div>
      </template>
    </photo-upload-modal>
  </photo-page>
</template>

<script>
import { actorPhotoTypes } from "@/config/basic";

export default {
  name: "actorDetailPhotos",

  inject: ["id"],

  data() {
    return {
      photoType: "",
      actorPhotoTypes,
    };
  },

  methods: {
    // 图片上传
    showPhotoUploadModal() {
      this.$refs.uploadModal.open();
    },
  },
};
</script>