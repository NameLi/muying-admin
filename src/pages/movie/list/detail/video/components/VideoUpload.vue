<template>
  <div class="upload-wrapper">
    <div class="upload-container">
      <!-- 上传进度条 -->
      <div class="progress" v-if="uploadPercent">
        <div class="thumb" :style="`width: ${uploadPercent}%`">
          <span class="tool-tip">{{ uploadPercent }}%</span>
        </div>
      </div>

      <!-- 视频预览 -->
      <div class="video-wrapper" v-if="url">
        <video controls class="video" preload="auto" ref="videoRef">
          <source :src="url" type="video/mp4" />
        </video>
      </div>

      <!-- 选择视频 -->
      <div v-else class="choose-btn">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-video-camera"
          @click="chosenFileHandle"
          >选择视频</el-button
        >
        <p>视频大小不超过500MB，时长不超过15分钟</p>
        <p>当前只支持 mp4、mov 格式视频</p>
      </div>

      <!-- 文件选择器 -->
      <input
        type="file"
        name="file"
        accept="video/*"
        ref="fileInput"
        class="upload-input"
        @change="fileChangeHandle"
      />
    </div>

    <div class="tool">
      <el-button
        v-if="isUploadSuccess"
        type="primary"
        size="small"
        @click="getCurrentTime()"
        >设置当前画面为封面</el-button
      >

      <!-- 上传与取消按钮组 -->
      <template v-if="file">
        <el-button
          type="primary"
          v-if="!isUploading"
          size="small"
          @click="startUpload()"
          >开始上传</el-button
        >
        <el-button type="warning" v-else size="small" @click="cancleUpload()"
          >取消上传</el-button
        >
      </template>
    </div>
  </div>
</template>

<script>
import { getQiniuUpToken } from "@/api/api";
import * as qiniu from "qiniu-js";

export default {
  name: "VideoUpload",
  props: {
    id: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    // 最大尺寸/MB
    maxSize: {
      type: Number,
      default: 500,
    },
    maxMinute: {
      // 最大时长/分钟
      type: Number,
      default: 15,
    },
    acceptType: {
      type: Array,
      default: () => ["video/mp4", "video/omg"],
    },
  },

  watch: {
    uploadPercent(val) {
      if (this.uploadPercent >= 100) {
        this.file = null;
        this.isUploading = false;
        this.uploadPercent = 0;
      }
    },
  },

  data() {
    return {
      videoSize: 0,
      isUploading: false,
      isUploadSuccess: false,
      uploadPercent: 0,
      url: "",
      file: null, // 当前待上传文件
      subscription: null, // 七牛上传实例，取消上传时使用
    };
  },

  methods: {
    // 获取当前播放时间
    getCurrentTime() {
      const video = this.$refs.videoRef;
      const currentTime = video.currentTime;

      let coverUrl = this.url + "?vframe/jpg/offset/" + currentTime;

      this.$emit("on-poster-change", coverUrl);
    },

    // 文件上传事件
    chosenFileHandle() {
      this.file = null;

      let evt = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      this.$refs.fileInput.dispatchEvent(evt);
    },

    // 获取本地视频文件
    fileChangeHandle(evt) {
      if (!evt.target.files || !evt.target.files[0]) return;
      const file = evt.target.files[0];

      if (file.size > this.maxSize * 1024 * 1024) {
        this.$message.warning(`视频大小不超过${this.maxSize}MB`);
        return;
      }

      if (this.acceptType.indexOf(file.type) === -1) {
        this.$message.warning(`只能上传 mp4、mov 格式视频!`);
        return;
      }

      let fileUrl = URL.createObjectURL(file);

      this.url = fileUrl;

      this.$nextTick(() => {
        const video = this.$refs.videoRef;

        video.preload = "metadata";

        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);

          if (video.duration < 1) {
            this.$message.warning("Invalid Video! video is less than 1 second");
            return;
          }

          if (video.duration > this.maxMinute * 60) {
            this.$message.warning(`视频时长不能超过${this.maxMinute}分钟`);
          } else {
            this.file = file;
          }
        };
      });
    },

    // 开始上传
    startUpload() {
      this.isUploadSuccess = false;
      this.handleFileUpload();
    },

    // 取消上传
    cancleUpload() {
      this.subscription.unsubscribe();
      this.isUploading = false;
      this.uploadPercent = 0;
    },

    // 上传视频
    async handleFileUpload() {
      let file = this.file;

      const { code, data } = await getQiniuUpToken({ category: "video" });

      if (code === 200) {
        this.isUploading = true;

        const token = data;

        const key = null;

        const putExtra = {
          fname: "",
          params: {
            "x:union_id": this.id, // 所属父类id
            "x:category": this.category, // 文件分类： movie、actor、role、
            "x:type": this.type, // 类型：trailer 预告片
          },
          mimeType: ["video/mp4", "video/omg"],
        };

        const config = {
          useCdnDomain: false, // 使用cdn加速
          disableStatisticsReport: true, // 是否禁用日志报告
          region: qiniu.region.z0, // 选择上传域名区域
        };

        const observable = qiniu.upload(file, key, token, putExtra, config);

        this.subscription = observable.subscribe({
          next: (res) => {
            // 上传进度
            this.uploadPercent = Math.floor(res.total.percent);
          },

          error: (err) => {
            this.isUploading = false;
            this.$message.error(err.code + " 文件上传失败");
            this.uploadPercent = 0;
          },

          complete: (res) => {
            if (res.code === 200) {
              this.$message.success("上传成功");

              this.url = res.data.url;
              this.isUploadSuccess = true;

              this.$emit("on-success", res.data);

              this.$refs.fileInput.value = "";
            } else {
              this.$message.error(res.message);
            }

            this.isUploading = false;
          },
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.upload-wrapper {
  position: relative;
  width: 100%;

  .upload-container {
    width: 100%;
    height: 230px;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    .progress {
      z-index: 1;
      position: absolute;
      left: 0;
      right: 0;
      top: -2px;
      height: 2px;
      font-size: 16px;
      border-radius: 5px;
      .thumb {
        background: #409eff;
        height: 100%;
        position: relative;
        &::after {
          position: absolute;
          bottom: -4px;
          right: -5px;
          width: 10px;
          height: 10px;
          content: "";
          background: #fff;
          border-radius: 50%;
          border: 2px solid #409eff;
          box-sizing: border-box;
        }
        .tool-tip {
          position: absolute;
          right: -23px;
          bottom: 14px;
          display: inline-block;
          padding: 2px 6px;
          min-width: 34px;
          text-align: center;
          line-height: 20px;
          color: #fff;
          font-size: 12px;
          border-radius: 4px;
          background: #409eff;
          letter-spacing: 1px;
          &::after {
            position: absolute;
            bottom: -12px;
            left: 0;
            right: 0;
            width: 1px;
            margin: 0 auto;
            content: "";
            border-width: 6px;
            border-style: solid;
            border-color: #409eff transparent transparent transparent;
          }
        }
      }
    }

    .video-wrapper {
      height: 100%;
      .video {
        width: 100%;
        height: 100%;
      }
    }
    .choose-btn {
      position: absolute;
      left: 50%;
      top: 55%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      flex-direction: column;
      > p {
        padding-top: 10px;
        text-align: center;
        font-size: 12px;
        color: #777;
        height: 24px;
        line-height: 24px;
      }
    }

    .upload-input {
      display: none;
    }
  }

  .tool {
    padding: 5px 0;
    text-align: right;
  }
}
</style>