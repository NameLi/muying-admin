<template>
  <el-dialog
    title="照片墙"
    width="80vw"
    :visible.sync="visible"
    :append-to-body="true"
    class="modal-wrapper"
  >
    <div class="modal-container">
      <slot name="header"></slot>

      <div class="photo-container" v-loading="loading">
        <div class="list" v-if="photos.length">
          <div
            class="item"
            v-for="photo in photos"
            :key="photo.id"
            @click="checkedPhoto(photo)"
          >
            <!-- 图片内容区 -->
            <div
              :class="[
                { 'is-active': curPhoto && photo.id === curPhoto.id },
                'photo-inner',
              ]"
            >
              <div class="photo-radio">
                <i class="el-icon-success"></i>
              </div>
              <!-- 图片预览 -->
              <div class="preview-wrapper">
                <img class="preview" :src="photo.url" />
              </div>

              <div class="photo-info-list">
                <div class="photo-info">
                  {{ photo.width }}x{{ photo.height }}
                </div>
                <div class="photo-info">{{ photo.size }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="photo-none">暂无图片</div>
      </div>

      <div class="photo-footer">
        <el-button
          type="success"
          size="mini"
          v-show="curPhoto"
          @click="checkPhoto()"
          >确定选择该图片</el-button
        >

        <m-pagination
          v-if="pagination.total"
          :pagination.sync="pagination"
          @on-change="getPhotos()"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getPhotos } from "@/api/photo";

export default {
  name: "PhotoWall",
  props: {
    type: {
      required: true,
      validator(val) {
        return ["movie", "actor", "role"].includes(val);
      },
    },
  },
  data() {
    return {
      ...this.$defaults(),
      loading: false,
      id: null,
      visible: false,
      photos: [], // 当前用户选择的文件处理后列表
      curPhoto: null,
    };
  },

  methods: {
    open(id) {
      this.id = id;
      this.visible = true;

      this.getPhotos();
    },

    // 关闭模态框
    close() {
      this.visible = false;
    },

    async getPhotos() {
      let params = {
        ...this.pagination,
        category: this.type,
        union_id: this.id,
      };

      if (this.type === "movie") {
        params.type = "poster";
        params.subtype = "offical";
      }

      this.loading = true;
      const { code, data } = await getPhotos(params);
      this.loading = false;

      if (code === 200) {
        this.photos = data;
      }
    },

    // 选择图片
    checkedPhoto(photo) {
      this.curPhoto = photo;
    },

    checkPhoto() {
      let photo = this.curPhoto;

      // 去掉图片裁剪后缀
      photo.image = photo.url.replace(/@public/, "");

      this.$emit("on-change", this.curPhoto);
      this.visible = false;
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
    // min-height: 50vh;
    box-sizing: border-box;
    min-width: 710px;
    .photo-container {
      flex: 1;
      position: relative;
      min-height: 200px;
      .list {
        margin: 0 -5px;
        .item {
          position: relative;
          display: inline-block;
          vertical-align: top;
          width: 130px;
          margin: 8px 5px;
          background: rgba(0, 0, 0, 0.03);
          transition: all 0.2s;
          &:hover {
            cursor: pointer;
            color: #409eff;
            border-color: currentColor;
          }
          .photo-info-list {
            position: absolute;
            right: 0;
            bottom: 0;
            .photo-info {
              display: inline-block;
              color: #fff;
              margin: 4px;
              padding: 0 4px;
              border-radius: 2px;
              font-size: 12px;
              height: 18px;
              line-height: 18px;
              background: rgba(0, 0, 0, 0.45);
            }
          }

          // 图片内容
          .photo-inner {
            position: relative;
            &.is-active {
              .photo-radio {
                display: block;
              }
            }
            .photo-radio {
              display: none;
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              bottom: 0;
              z-index: 1;
              background-color: rgba(255, 255, 255, 0.2);
              font-weight: bold;
              text-align: right;
              box-shadow: 0 0 6px #aaa;
              i {
                font-size: 20px;
                margin: 5px;
                color: #67c23a;
              }
            }
            .preview-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              .preview {
                max-width: 100%;
                max-height: 100%;
              }
            }
          }
        }
      }
      .photo-none {
        height: 200px;
        line-height: 200px;
        text-align: center;
        color: #999;
      }
    }
    .photo-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-button {
        margin-right: 20px;
      }
    }
  }
}
</style>
