<template>
  <el-dialog
    title="视频预览"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close"
  >
    <video-player ref="video" :poster="video.poster" :sources="video.sources" />

    <slot name="footer"></slot>
  </el-dialog>
</template>

<script>
/**
 * video-preview
 * @module components/Video/VideoPreview
 * @desc 视频预览，video数据通过 open 方法传入
 * @param {object} video - 视频信息
 * @param {array} video.sources - 视频地址列表
 * @param {url} video.poster - 视频封面图片
 *
 * @example
 * <video-preview ref="previewModal" />
 */

export default {
  name: "VideoPreview",
  data() {
    return {
      visible: false,
      video: {},
    };
  },
  methods: {
    open(video) {
      this.visible = true;
      this.video = video;
    },

    close() {
      this.$refs.video.destroy();
      this.visible = false;
    },
  },
};
</script>