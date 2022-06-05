<template>
  <div class="camera">
    <div class="camera-photo">
      <img id="image" ref="img" :src="img" />
    </div>
  </div>
</template>

<script>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";

export default {
  name: "CropImage",
  props: {
    img: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      cropper: null,
      imgUrl: "",
    };
  },

  watch: {
    img(val) {
      if (val === "" && this.cropper) {
        this.cropper.destroy();
      }

      if (!this.cropper) {
        this.initCropper();
      } else {
        if (val) {
          this.cropper.replace(val);
        }
      }
    },
  },

  mounted() {
    this.initCropper();
  },

  methods: {
    // 初始化裁剪
    initCropper() {
      this.$nextTick(() => {
        this.cropper = new Cropper(this.$refs.img, {
          aspectRatio: 1 / 1,
          viewMode: 1,
          guides: true, // 裁剪框的虚线(九宫格)
          autoCropArea: 1,
          zoomable: true,
          zoomOnTouch: true,
          initialAspectRatio: 0.9,
          // dragMode: 'move',
          // cropBoxMovable: false,
          minCropBoxWidth: 200,
        });
      });
    },

    // 裁剪图片
    clipImage() {
      this.$nextTick(() => {
        let canvas = this.cropper.getCroppedCanvas({
          maxWidth: 300,
          maxHeight: 300,
        });

        canvas.toBlob((blob) => {
          this.$emit("on-change", blob);
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.camera {
  background: #f5f5f5;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .camera-photo {
    height: 300px;
    width: 300px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
    #image {
      max-width: 100%;
    }
  }
}
</style>