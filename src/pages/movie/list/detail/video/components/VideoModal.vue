<template>
  <el-dialog
    :title="isEdit ? '编辑视频' : '新增视频'"
    width="710px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="modal-container">
      <el-form label-width="75px" :model="form" :rules="rules" ref="form">
        <el-form-item label="分 类：" prop="type">
          <m-select
            v-model="form.type"
            :options="videoTypes"
            size="small"
            :clearable="false"
            style="width: 100%"
            placeholder="所属分类"
          />
        </el-form-item>

        <el-form-item label="标 题：" prop="title">
          <el-input
            v-model="form.title"
            placeholder="视频标题"
            show-word-limit
            maxlength="20"
          />
        </el-form-item>

        <el-form-item label="视 频：" prop="url">
          <!-- 视频编辑不可更换视频 -->
          <div class="preview-video" v-if="isEdit">
            <video controls class="video" preload="auto" ref="videoRef">
              <source :src="form.url" type="video/mp4" />
            </video>

            <div class="tool">
              <el-button type="primary" size="small" @click="getCurrentTime()">
                设置当前画面为封面
              </el-button>
            </div>
          </div>

          <!-- 新增时显示视频上传 -->
          <div class="upload-field" v-else>
            <el-input v-model="form.url" style="display: none" />
            <video-upload
              :id="id"
              category="movie"
              :type="form.type"
              @on-success="uploadSuccessHandle"
              @on-poster-change="posterChangeHandle"
            />
          </div>
        </el-form-item>

        <el-form-item label="封 面：" prop="poster">
          <div class="poster">
            <img :src="form.poster" />
          </div>
        </el-form-item>

        <el-form-item label="简 介：">
          <el-input
            type="textarea"
            v-model="form.brief"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 6 }"
            maxlength="200"
            placeholder="视频简介"
          />
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button type="submit" @click="submitForm()" :loading="submitLoading" />
    </div>
  </el-dialog>
</template>

<script>
import VideoUpload from "./VideoUpload";
import { modal } from "@/mixins/modal";
import { updateVideo } from "@/api/video";
import { videoTypes } from "@/config/basic";

const rules = {
  type: [{ required: true, message: "请选择视频所属分类", trigger: "change" }],
  title: [
    { required: true, message: "请填写视频标题", trigger: "blur" },
    { min: 2, max: 32, message: "长度在 2 到 32 个字符", trigger: "blur" },
  ],
  url: [{ required: true, message: "请上传视频", trigger: "blur" }],
  poster: [{ required: true, message: "请选择视频封面", trigger: "blur" }],
};

export default {
  name: "VideoModal",

  components: {
    VideoUpload,
  },

  mixins: [modal],

  data() {
    return {
      rules,
      form: {
        id: null,
        title: "",
        type: "",
        url: "",
        poster: "",
        brief: "",
      },
      videoTypes,
    };
  },

  methods: {
    getCurrentTime() {
      const video = this.$refs.videoRef;
      const currentTime = video.currentTime || 0;

      this.form.poster = this.form.url + "?vframe/jpg/offset/" + currentTime;
    },

    posterChangeHandle(posterUrl) {
      this.form.poster = posterUrl;
    },

    uploadSuccessHandle(video) {
      this.form.id = video.id;
      this.form.url = video.url;
    },

    async submit() {
      return await updateVideo(this.form.id, this.form);
    },
  },
};
</script>


<style scoped lang="scss">
.modal-container {
  padding: 10px 30px 0;

  .preview-video {
    height: 270px;
    .video {
      width: 100%;
      height: 230px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
    }
    .tool {
      margin-top: -6px;
      text-align: right;
    }
  }
  .upload-field {
    position: relative;
    height: 260px;
  }
  .poster {
    width: 538px;
    height: 230px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    > img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>