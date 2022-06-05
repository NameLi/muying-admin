<template>
  <div class="upload-wrapper" :style="{ height: height }">
    <div class="clear-image" v-if="url" @click="clearImage()">
      <i class="iconfont icon-close"></i>
    </div>

    <div
      class="upload"
      :style="{ 'position: static': url }"
      @click="chosenFile"
    >
      <div class="upload-preview" v-if="url">
        <el-image class="image" :style="{ 'max-height': height }" :src="url" />
        <div class="tip">修改图片</div>
      </div>
      <i v-else class="upload-icon" :class="icon"></i>
    </div>

    <div class="upload-progress" v-show="isUploading">
      <el-progress type="circle" :width="100" :percentage="uploadProgress" />
    </div>

    <input
      type="file"
      name="file"
      accept="image/*"
      ref="fileInput"
      class="upload-input"
      @change="handleFileChange"
    />

    <slot />
  </div>
</template>

<script>
import { getQiniuUpToken } from "@/api/api";
import * as qiniu from "qiniu-js";

export default {
  name: "ImageUpload",
  props: {
    // 图片关联的影视演员等的 id
    id: {
      type: Number,
    },
    category: {
      required: true,
      type: String,
    },
    type: {
      type: String,
      default: "",
    },
    subtype: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "el-icon-plus",
    },
    height: {
      type: String,
      default: "165px",
    },
    // 回显地址
    url: {
      type: String,
      default: "",
    },
    // 最大尺寸/MB
    maxSize: {
      type: Number,
      default: 20,
    },
    // 允许类型
    acceptType: {
      type: Array,
      default: () => ["image/png", "image/jpeg", "image/gif"],
    },
  },
  data() {
    return {
      imgSize: 0,
      isUploading: false,
      uploadProgress: 0,
    };
  },

  methods: {
    // 清除当前文件
    clearImage() {
      this.$emit("update:url", "");
    },

    // 绑定选择文件事件
    chosenFile() {
      let evt = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      this.$refs.fileInput.dispatchEvent(evt);
    },

    // 选择图片
    handleFileChange(evt) {
      if (!evt.target.files || !evt.target.files[0]) return;

      const file = evt.target.files[0];

      this.imgSize = file.size;

      let url = URL.createObjectURL(file);

      let img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(url); // 释放内存

        this.handleFileUpload(file);
      };

      img.src = url;

      this.$emit("update:url", url);
    },

    // 文件验证
    checkImg(file) {
      const fileType = file.type;
      const fileSize = file.size;

      // 限制文件大小为20M
      if (fileSize / 1024 / 1024 > this.maxSize) {
        this.$message.warning("图片不能超过20M!");
        return false;
      }

      if (this.acceptType.indexOf(fileType) === -1) {
        // 限制文件类型
        this.$message.warning("只能上传 png, jpeg, gif 格式图片!");
        return false;
      }

      return true;
    },

    // 文件上传
    async handleFileUpload(file) {
      if (!this.checkImg(file)) return;

      // 获取上传token
      let params = {
        category: this.category,
        type: this.type,
      };
      const { code, data } = await getQiniuUpToken(params);

      if (code === 200) {
        this.isUploading = true;

        const token = data;

        const key = null;

        // 额外参数
        const putExtra = {
          fname: "",
          params: {
            "x:union_id": this.id, // 所属父类id
            "x:category": this.category, // 文件分类： movie、actor、role、
            "x:type": this.type, // 文件类型： poster、office、cut、work 海报 剧照 截图 工作照
            "x:subtype": this.subtype, // 子类型：
          },
          mimeType: this.acceptType, // 允许文件类型
        };

        const config = {
          useCdnDomain: false, // 使用cdn加速
          disableStatisticsReport: true, // 是否禁用日志报告
          region: qiniu.region.z0, // 上传域名区域
        };

        const observable = qiniu.upload(file, key, token, putExtra, config);

        observable.subscribe({
          // 上传进度
          next: (res) => {
            this.uploadProgress = Math.floor(res.total.percent);

            this.$emit("on-progress", res);
          },

          // 上传失败
          error: (err) => {
            console.log(err);

            this.isUploading = false;
            this.$emit("on-error", err);
            this.$message.error(err.code + " 上传失败");

            this.$emit("update:url", "");
          },

          // 上传完成
          complete: (res) => {
            this.isUploading = false;

            this.$refs.fileInput.value = "";

            this.$emit("update:url", res.url);
            this.$emit("on-success", res);
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
  display: inline-block;
  width: 118px;
  height: 165px;
  background-color: #f6f6f6;
  &:hover {
    .clear-image {
      visibility: visible;
    }
  }
  .clear-image {
    visibility: hidden;
    z-index: 99;
    position: absolute;
    right: -6px;
    top: -6px;
    width: 16px;
    height: 16px;
    color: #fff;
    border-radius: 50%;
    background-color: $color-danger;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      cursor: pointer;
    }
    .icon-close {
      font-size: 12px;
    }
  }
  .upload {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .upload-progress {
    z-index: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(#fff, 0.85);
  }

  .upload-preview {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      cursor: pointer;
      .tip {
        visibility: visible;
        opacity: 1;
      }
    }
    .image {
      max-width: 118px;
      // max-height: 165px;
    }
    .tip {
      visibility: hidden;
      opacity: 0;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 28px;
      line-height: 28px;
      color: #fff;
      text-align: center;
      font-size: 12px;
      background: rgba(0, 0, 0, 0.6);
      transition: 0.2s ease-in-out;
    }
  }

  .upload-icon {
    font-size: 32px;
    color: rgba(#8c939d, 0.85);
    // width: 118px;
    // height: 160px;
    // line-height: 160px;
    text-align: center;
    // border: 1px dashed #d9d9d9;
    border-radius: 4px;
    transition: all 0.2s;
    &:hover {
      color: #409eff;
      border-color: currentColor;
      cursor: pointer;
    }
  }

  .upload-input {
    display: none;
  }
}
</style>