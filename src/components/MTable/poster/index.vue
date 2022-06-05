<template>
  <div class="poster-wrapper">
    <!-- 演员表中主演标签 -->
    <div class="poster-tag is-starring" v-if="isStarring === 1">主演</div>

    <!-- 状态标签 -->
    <div class="poster-tag" :class="statusClass" v-if="status">
      {{ statusZh }}
    </div>

    <!-- 海报/头像等图片 -->
    <el-image class="poster" :src="src" :alt="alt" />
  </div>
</template>

<script>
export default {
  name: "TablePoster",
  props: {
    isStarring: {
      type: Number,
      default: 0,
    },
    status: {
      default: 0,
    },
    src: {
      type: String,
      default: "",
    },
    alt: {
      type: String,
    },
    lazy: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    statusZh() {
      let statusZh = "";
      switch (this.status) {
        case -9:
          statusZh = "处理中";
          break;
        case -8:
          statusZh = "待完善";
          break;
        case -7:
          statusZh = "待审核";
          break;
        case -1:
          statusZh = "隐藏";
          break;
        case 1:
          statusZh = "锁定";
          break;
      }
      return statusZh;
    },
    statusClass() {
      let statusClass = "";
      switch (this.status) {
        case -9:
        case -8:
        case -7:
          statusClass = "is-danger";
          break;
        case -1:
          statusClass = "is-warning";
          break;
        case 1:
          statusClass = "is-success";
          break;
      }
      return statusClass;
    },
  },
};
</script>

<style lang="scss" scoped>
.poster-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  .poster {
    max-width: 70px;
    max-height: 100px;
    ::v-deep .el-image__error {
      height: 100px;
      width: 70px;
    }
  }
}
.poster-tag {
  z-index: 1;
  position: absolute;
  left: 4px;
  top: 4px;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 4px;
  border-radius: 2px;
  color: #fff;
  background-color: #67c23a;
  &.is-success {
    background-color: #67c23a;
  }
  &.is-warning {
    background-color: #e6a23c;
  }
  &.is-danger {
    background-color: #f56c6c;
  }
}
</style>