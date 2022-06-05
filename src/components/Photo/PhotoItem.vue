<template>
  <div class="photo-item">
    <!-- photo -->
    <div class="photo">
      <!-- 图片 -->
      <img v-lazy="photo.url" />

      <!-- 已审核 -->
      <div class="audit-status" v-if="photo.status === 1"></div>

      <!-- 图片预览/审核/删除 -->
      <div class="photo-actions" v-if="!isBatch">
        <span class="action-item" @click="auditPhoto(photo)">
          <i class="el-icon-s-check"></i>
        </span>
        <span class="action-item" @click="deletePhoto(photo)">
          <i class="el-icon-delete"></i>
        </span>
        <span class="action-item" @click="previewPhoto(photo)">
          <i class="el-icon-zoom-in"></i>
        </span>
      </div>

      <!-- 图片统计 -->
      <div class="photo-count">
        <span v-if="photo.like_count">{{ photo.like_count }}赞</span>
        <span v-if="photo.collection_count"
          >{{ photo.collection_count }}收藏</span
        >
      </div>

      <!-- 图片信息 -->
      <div class="photo-info">
        <span>{{ photo.width }}x{{ photo.height }}</span>
        <span>{{ photo.size }}MB</span>
      </div>
    </div>

    <!-- 图片标签 -->
    <div class="photo-tag">
      <span class="tag">{{ photo.category_zh }}</span>
      <span class="tag">{{ photo.type_zh }}</span>
      <span class="tag" v-if="photo.subtype_zh">{{ photo.subtype_zh }}</span>
    </div>

    <!-- tool -->
    <!-- 批量处理 -->
    <div class="checkbox-wrapper" v-if="isBatch">
      <el-checkbox fill="#F56C6C" v-model="photo.isChecked" />
    </div>

    <!-- 图片简介 -->
    <div class="brief" v-if="photo.brief">{{ photo.brief }}</div>
  </div>
</template>


<script>
export default {
  name: "PhotoItem",

  props: {
    photo: {
      type: Object,
    },
    isBatch: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    author() {
      return this.photo?.author;
    },
    srcList() {
      return [this.photo?.url];
    },
  },

  methods: {
    // 图片预览
    previewPhoto(photo) {
      const largerUrl = this.photo.url.replace(/public/, "larger");
      this.$emit("on-preview", largerUrl);
    },

    // 删除照片
    deletePhoto(photo) {
      this.$emit("on-delete", photo);
    },

    // 审核图片
    auditPhoto(photo) {
      this.$emit("on-audit", photo);
    },
  },
};
</script>

<style scoped lang="scss">
.photo-item {
  position: relative;
  display: inline-block;
  margin: 8px;
  margin-bottom: 12px;
  background: #fff;
  .photo-info {
    display: flex;
    align-items: flex-end;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 50px;
    background-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0,
      rgba(0, 0, 0, 0.3) 100%
    );
    color: #fff;
    font-size: 12px;
    span {
      line-height: 24px;
      margin-left: 6px;
    }
  }

  .photo-count {
    position: absolute;
    left: 0;
    top: 0;
    padding: 4px 10px;
    color: #fff;
    width: 100%;
    height: 30px;
    font-size: 12px;
    box-sizing: border-box;
    background-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 0) 0,
      rgba(0, 0, 0, 0.3) 100%
    );
    span {
      margin-right: 6px;
    }
  }

  // 批量选择
  .checkbox-wrapper {
    z-index: 9;
    position: absolute;
    top: 0;
    left: 0;
    ::v-deep .el-checkbox__inner {
      width: 22px;
      height: 22px;
      &::after {
        left: 7px;
        top: 1px;
        width: 5px;
        height: 12px;
        border-width: 2px;
      }
    }
  }

  .tool-wrapper {
    visibility: hidden;
    opacity: 0;
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.55);
    display: flex;
    justify-content: flex-end;
    transition: opacity 0.25s, background-color 0.25s;
    .tool-item {
      display: inline-block;
      margin: 0 5px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 18px;
      color: #fff;
      transition: color 0.2s;
      &:hover {
        color: #f56c6c;
        cursor: pointer;
      }
    }
  }
  &:hover {
    .tool-wrapper {
      visibility: visible;
      opacity: 1;
    }
  }
  .photo {
    position: relative;
    transition: opacity 0.25s;
    height: 200px;
    &:hover {
      opacity: 0.85;
      cursor: pointer;
      .photo-actions {
        opacity: 1;
      }
    }
    > img {
      height: 200px;
      border-radius: 6px;
    }
    .audit-status {
      z-index: 1;
      position: absolute;
      left: -1px;
      top: -1px;
      border: 10px solid transparent;
      border-left-color: #67c23a;
      border-top-color: #67c23a;
    }
    .photo-actions {
      z-index: 3;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .action-item {
        text-align: center;
        width: 32px;
        height: 32px;
        line-height: 32px;
        &:hover {
          color: #f56c6c;
          cursor: pointer;
        }
      }
    }
  }
}

.photo-tag {
  display: flex;
  margin: 4px -4px 4px 0;
  .tag {
    color: #fff;
    margin-right: 4px;
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 12px;
    background: #999;
  }
}
</style>
