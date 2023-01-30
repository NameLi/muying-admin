<template>
  <el-dialog
    title="图片上传"
    :visible.sync="visible"
    :append-to-body="true"
    width="80vw"
    class="modal-wrapper"
    :close-on-click-modal="false"
    :before-close="beforeClose"
  >
    <div class="modal-container">
      <slot name="header"></slot>

      <div class="photo-container">
        <div class="list" v-if="photos.length">
          <div class="item" v-for="item in photos" :key="item.id">
            <!-- 文件删除 上传中或上传成功时禁止删除 -->
            <div class="tool" v-if="item.status !== 1 && item.status !== 2">
              <i class="el-icon-delete" @click="deletePhoto(item)"></i>
            </div>

            <!-- 上传进度 -->
            <div class="progress-wrapper" v-if="item.status === 1">
              <div class="progress">
                <div class="thumb" :style="`width: ${item.progress}%`">
                  <span>{{ item.progress }}%</span>
                </div>
              </div>
            </div>

            <!-- 文件状态 -->
            <div class="status-list" v-if="item.status > 1">
              <div v-if="item.status === 2" class="status-item success">
                <i class="el-icon-success"></i>
                <p>上传成功</p>
              </div>
              <div v-if="item.status === 3" class="status-item error">
                <i
                  class="el-icon-refresh"
                  title="重新上传"
                  @click="handleReupload(item)"
                ></i>
                <p>上传失败</p>
              </div>
              <div v-if="item.status === 41" class="status-item warning">
                <i class="el-icon-warning"></i>
                <p>图片大小超出20M</p>
              </div>
              <div v-if="item.status === 42" class="status-item warning">
                <i class="el-icon-warning"></i>
                <p>图片格式不支持</p>
              </div>
            </div>

            <!-- 图片内容区 -->
            <div :class="[{ 'is-opacity': item.status > 1 }, 'photo-inner']">
              <!-- 图片预览 -->
              <div class="preview-wrapper">
                <img class="preview" :src="item.url" />
              </div>

              <!-- 图片描述 -->
              <textarea
                v-model="item.desc"
                class="desc"
                maxlength="200"
                placeholder="添加图片描述"
              />
            </div>
          </div>

          <div
            v-if="photos.length < limit"
            class="item item-add"
            @click="chosenFileHandle"
          >
            <i class="el-icon-plus"></i>
          </div>
        </div>

        <div class="choose-btn" v-else>
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-picture"
            @click="chosenFileHandle"
            >选择图片</el-button
          >
          <p>按住"Ctrl"键可多选，最多不超过{{ limit }}张，单张大小不超过20M</p>
          <p>当前只支持 png、jpg、gif、webp 格式图片</p>
        </div>
      </div>

      <!-- 文件上传操作按钮 -->
      <div class="tool-wrapper">
        <div class="tool" v-if="photos.length">
          <el-button
            v-if="!isUploading"
            type="primary"
            size="medium"
            icon="el-icon-picture"
            @click="startUploadFile()"
            >开始上传</el-button
          >

          <el-button
            v-else
            size="medium"
            icon="el-icon-close"
            @click="cancleFileUpload()"
            >取消上传</el-button
          >

          <el-button
            v-if="photos.length < limit"
            size="medium"
            icon="el-icon-folder-add"
            @click="chosenFileHandle"
            >继续添加</el-button
          >

          <div class="photo-count">
            <span class="count"
              >已选择<label>{{ waitingCount }}</label
              >张照片</span
            >
            <span class="count" v-if="successCount"
              >上传成功<label class="success">{{ successCount }}</label
              >张照片</span
            >
            <span class="count" v-if="errorCount"
              >上传失败<label class="error">{{ errorCount }}</label
              >张照片</span
            >
          </div>
        </div>
      </div>

      <!-- 文件选择器 -->
      <input
        type="file"
        name="file"
        multiple
        accept="image/png,image/jpg,image/jpeg,image/gif,image/bmp"
        ref="fileInput"
        class="upload-input"
        @change="fileChangeHandle"
      />
    </div>
  </el-dialog>
</template>

<script>
import { getQiniuUpToken } from "@/api/api";
import * as qiniu from "qiniu-js";

let _id = 1; // 文件对象自增赋值id
let isUploadingCount = 0; // 当前正在上传文件数量，用于判断当前是否有文件处于上传状态

const WAITING_STATUS = 0; // 待上传
const UPLOADING_STATUS = 1; // 上传中
const SUCCESS_STATUS = 2; // 上传成功
const ERROR_STATUS = 3; // 上传失败

export default {
  name: "PhotoUploadModal",

  props: {
    // 图片关联的影视演员等的 id
    id: {
      required: true,
      type: Number,
    },

    // 图片类型,数组为有二级分类的subtype
    photoType: [String, Array],

    // 单次限制上传图片数量
    limit: {
      type: Number,
      default: 10,
    },

    category: {
      required: true,
      type: String,
      validator(val) {
        return ["movie", "actor", "role"].includes(val);
      },
    },

    // 单张图片限制文件大小
    maxSize: {
      type: Number,
      default: 20,
    },
  },

  data() {
    return {
      visible: false,
      upToken: "", // 七牛上传 token
      acceptType: [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/gif",
        "image/bmp",
      ],
      photos: [], // 当前用户选择的文件处理后列表
      isUploading: false, // 是否正在上传
      type: "", // 图片分类
      subtype: "", // 图片子类型分类
    };
  },

  filters: {
    message(type) {
      let msg;
      switch (type) {
        case 41:
          msg = "上传失败，请重试";
          break;
        case 42:
          msg = "图片大小超出20M";
          break;
        case 43:
          msg = "图片格式不支持";
          break;
        default:
          msg = "";
      }
      return msg;
    },
  },

  computed: {
    waitingCount() {
      return this.photos.filter((item) => item.status === WAITING_STATUS)
        ?.length;
    },
    uploadingCount() {
      return this.photos.filter((item) => item.status === UPLOADING_STATUS)
        ?.length;
    },
    successCount() {
      return this.photos.filter((item) => item.status === SUCCESS_STATUS)
        ?.length;
    },
    errorCount() {
      return this.photos.filter((item) => item.status === ERROR_STATUS)?.length;
    },
  },

  methods: {
    open() {
      this.visible = true;
    },

    // 关闭模态框
    close() {
      this.data = this.$options.data();
      this.visible = false;
    },

    async beforeClose() {
      if (isUploadingCount > 0) {
        this.$message.warning("还有文件正在上传中，请等待上传完成或取消上传");
        return;
      }

      if (this.photos.length && this.photos.find((p) => p.status !== 2)) {
        try {
          await this.$confirm("还有文件未操作, 确定要离开吗?", "提示", {
            type: "warning",
          });
        } catch (e) {
          return;
        }
      }

      // 清空photos
      this.photos.length = 0;

      this.visible = false;
      this.$emit("on-close");
    },

    // 选择文件
    chosenFileHandle() {
      this.setPhotoType();

      if (this.category === "movie" && !this.type) {
        this.$message.warning("请选择图片分类");
        return;
      }

      let evt = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      this.$refs.fileInput.dispatchEvent(evt);
    },

    // 验证文件类型是否选择
    setPhotoType() {
      if (Array.isArray(this.photoType) && this.photoType.length === 2) {
        let types = this.photoType;
        this.type = types[0];
        this.subtype = types[1];
      }

      if (typeof this.photoType === "string" && this.photoType) {
        this.type = this.photoType;
      }
    },

    // 文件选择change
    fileChangeHandle(evt) {
      if (!evt.target.files || !evt.target.files[0]) return;

      const files = evt.target.files;

      for (let i = 0; i < files.length; i++) {
        let file = files[i];

        if (this.isFileExist(file)) continue; // 文件已存在
        if (!this.validateFileType(file)) continue; // 文件格式不支持

        if (this.isExceedLimit()) break; // 是否超出

        let url = URL.createObjectURL(file);

        let img = new Image();
        img.src = url;

        img.onload = () => {
          URL.revokeObjectURL(url); // 释放当前创建的url
        };

        let photo = {
          id: ++_id, // 图片自增id
          file: files[i], // 图片文件
          url, // 图片本地预览
          status: 0, // 0 待上传  1上传中 2上传成功 3上传失败 42图片超出限制 43图片格式不支持
          progress: 0, // 上传进度
          brief: "", // 图片描述
          subscription: null, // 七牛上传实例，取消上传时使用
        };

        photo = this.validateFileSize(photo); // 检查文件大小

        this.photos.push(photo);
      }

      this.$refs.fileInput.value = ""; // 清空当前 input 中 value，不然删除文件时，无法再次选中该文件
    },

    // 检查文件是否已存在于列表中，以文件名作为判断条件（QQ空间应该也是如此实现）
    isFileExist(file) {
      for (let item of this.photos) {
        if (item.file.name === file.name) {
          return true;
        }
      }
      return false;
    },

    // 检查是否超出文件个数限制
    isExceedLimit() {
      if (this.photos.length >= this.limit) {
        this.$message.warning(`单次文件选择不能超过${this.limit}个`);
        return true;
      } else {
        return false;
      }
    },

    // 删除图片
    deletePhoto(photo) {
      let index = this.photos.findIndex((item) => item.id === photo.id);
      this.photos.splice(index, 1);
    },

    // 检查文件类型是否支持
    validateFileType(file) {
      const fileType = file.type;

      if (this.acceptType.indexOf(fileType) === -1) {
        // 限制文件类型
        this.$message.warning("文件格式不支持");
        return false;
      }

      return true;
    },

    // 检查文件大小
    validateFileSize(photo) {
      const fileSize = photo.file.size;

      // 限制文件大小为20M
      if (fileSize / 1024 / 1024 > this.maxSize) {
        photo.status = 42;
      }

      return photo;
    },

    // 开始上传
    startUploadFile() {
      // 是否有文件待上传
      if (this.isFullUpload()) {
        return;
      }

      this.getQiniuUpToken();
    },

    // 重新上传
    handleReupload(photo) {
      this.handleFileUpload(photo);
    },

    // 获取七牛上传 token
    async getQiniuUpToken() {
      let params = {
        category: this.category,
        type: "photo",
      };

      if (!this.upToken) {
        const { code, data } = await getQiniuUpToken(params);
        if (code === 200) {
          this.upToken = data;
        } else {
          this.upToken = "";
          return;
        }
      }

      this.isUploading = true;

      isUploadingCount = 0;

      for (let photo of this.photos) {
        if (photo.status !== 0) continue;
        isUploadingCount++;
        this.handleFileUpload(photo);
      }
    },

    // 图片上传七牛
    handleFileUpload(photo) {
      const token = this.upToken;
      const file = photo.file;

      // 开始上传
      photo.status = 1;

      const key = null;

      const putExtra = {
        fname: "",
        params: {
          "x:union_id": this.id, // 所属父类id
          "x:category": this.category, // 文件分类： movie、actor、role、
          "x:type": this.type, // 文件类型： poster、stage、cut、other 海报 剧照 截图 其它
          "x:subtype": this.subtype, // 子类型：
        },
        mimeType: ["image/png", "image/jpeg", "image/gif"],
      };

      const config = {
        useCdnDomain: false, // 使用cdn加速
        disableStatisticsReport: true, // 是否禁用日志报告
        region: qiniu.region.z0, // 选择上传域名区域
      };

      const observable = qiniu.upload(file, key, token, putExtra, config);

      photo.subscription = observable.subscribe({
        // 上传进度
        next: (res) => {
          photo.progress = Math.floor(res.total.percent);
        },

        error: (err) => {
          photo.status = 3;
          this.$message.error(err.code + " 上传失败");

          isUploadingCount--;

          if (isUploadingCount === 0) {
            this.isUploading = false;
          }
        },

        complete: (res) => {
          if (res.code === 400) {
            photo.status = 3;
            this.$message.error(res.code + " " + res.message);

            isUploadingCount--;

            if (isUploadingCount === 0) {
              this.isUploading = false;
            }

            return;
          }

          isUploadingCount--;
          photo.status = 2;

          if (isUploadingCount === 0) {
            this.isUploading = false;
          }
        },
      });
    },

    // 取消上传
    cancleFileUpload() {
      for (let item of this.photos) {
        if (item.subscription && item.status === 1) {
          item.subscription.unsubscribe();
          item.status = 0;
          item.progress = 0;
          item.subscription = null;
        }
      }
      this.isUploading = false;
    },

    // 是否全部上传成功
    isFullUpload() {
      let isFullUploadSuccess = true;
      for (let item of this.photos) {
        if (item.status !== 2) {
          isFullUploadSuccess = false;
        }
      }

      return isFullUploadSuccess;
    },
  },
};
</script>


<style scoped lang="scss">
.modal-wrapper {
  ::v-deep .el-dialog {
    min-width: 740px;
    .el-dialog__body {
      overflow: auto;
    }
  }
  .modal-container {
    display: flex;
    flex-direction: column;
    min-height: 50vh;
    box-sizing: border-box;
    min-width: 710px;
    .photo-container {
      flex: 1;
      position: relative;
      .list {
        .item {
          position: relative;
          display: inline-block;
          vertical-align: top;
          width: 130px;
          height: 180px;
          margin: 8px 5px;
          border: 1px dashed #d9d9d9;
          background: rgba(0, 0, 0, 0.03);
          border-radius: 2px;
          transition: all 0.2s;
          &:hover {
            color: #409eff;
            border-color: currentColor;
            .el-icon-plus {
              color: #409eff !important;
            }
            .tool {
              visibility: visible;
              opacity: 1;
            }
          }
          &.item-add {
            line-height: 180px;
            text-align: center;
            cursor: pointer;
            .el-icon-plus {
              font-size: 32px;
              color: #8c939d;
            }
          }

          // 文件状态
          .status-list {
            z-index: 1;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.3);
            .status-item {
              text-align: center;
              > i {
                font-size: 32px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                line-height: 40px;
                text-align: center;
                transition: 0.2s ease-in-out;
              }
              > p {
                font-size: 14px;
                font-weight: bold;
              }

              &.success {
                color: #67c23a;
                cursor: not-allowed;
              }
              &.error {
                color: #f56c6c;
                > i {
                  &:hover {
                    transform: rotate(180deg);
                    cursor: pointer;
                  }
                }
              }
              &.warning {
                color: #e6a23c;
              }
            }
          }

          // 上传进度
          .progress-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            background: rgba(0, 0, 0, 0.04);
            .progress {
              width: 100%;
              height: 22px;
              background: rgba(127, 127, 127, 0.85);
              .thumb {
                display: inline-block;
                height: 22px;
                background: #555;
                line-height: 22px;
                background: rgba(63, 191, 63, 0.9);
                text-align: right;
                transition: width 0.2s ease-out;
                white-space: nowrap;
                overflow: hidden;
                > span {
                  padding-right: 5px;
                  color: #efefef;
                  font-size: 12px;
                }
              }
            }
          }

          .tool {
            visibility: hidden;
            opacity: 0;
            z-index: 2;
            position: absolute;
            left: 0;
            width: 100%;
            top: 0;
            padding: 0 8px;
            height: 30px;
            line-height: 30px;
            background: rgba(0, 0, 0, 0.5);
            text-align: right;
            box-sizing: border-box;
            > i {
              font-size: 18px;
              color: #fff;
              &:hover {
                cursor: pointer;
                color: #f56c6c;
              }
            }
          }

          // 图片内容
          .photo-inner {
            &.is-opacity {
              opacity: 0.3;
            }
            .preview-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 140px;

              .preview {
                max-width: 100%;
                max-height: 100%;
              }
            }
            .desc {
              margin-top: 2px;
              padding: 2px 5px;
              border: 0;
              width: 100%;
              box-sizing: border-box;
              outline: none;
              font-size: 14px;
              color: #777;
              background: transparent;
              &::-webkit-input-placeholder {
                color: #9c9c9c;
                text-align: center;
                font-size: 12px;
              }
            }
          }
        }
      }

      .choose-btn {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        flex-direction: column;
        > p {
          padding-top: 10px;
          text-align: center;
          font-size: 12px;
          color: #777;
        }
      }
    }
    .tool-wrapper {
      display: flex;
      margin: 0 -15px;
      background: #f3f3f3;
      .tool {
        padding: 8px 15px;
        .photo-count {
          display: inline-block;
          margin-left: 20px;
          font-size: 14px;
          color: #666;
          .count {
            margin-right: 15px;
            label {
              padding: 0 3px;
              &.success {
                color: #67c23a;
              }
              &.error {
                color: #f56c6c;
              }
            }
          }
        }
      }
    }
    .upload-input {
      display: none;
    }
  }
}
</style>
