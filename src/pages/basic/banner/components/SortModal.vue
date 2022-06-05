<template>
  <el-dialog
    title="Banner排序"
    width="80vw"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close()"
  >
    <div class="banner-list" v-loading="loading">
      <draggable v-model="list" v-bind="dragOptions" @update="dragUpdate">
        <div class="banner-item" v-for="(item, index) in list" :key="item.id">
          <em>
            {{ index + 1 }}
            <span style="color: #f56c6c" v-if="index + 1 !== item.sort"
              >({{ item.sort }})</span
            >
          </em>

          <div class="banner">
            <img class="image" :src="item.banner" alt="" />
          </div>

          <div class="title">{{ item.title }}</div>
        </div>
      </draggable>
    </div>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button
        type="submit"
        @click="submit()"
        :disabled="disabled"
        :loading="submitLoading"
      />
    </div>
  </el-dialog>
</template>

<script>
import draggable from "vuedraggable";
import dragOptions from "@/config/dragOptions";
import { modal } from "@/mixins/modal";
import { getBanners, updateBannersSort } from "@/api/basic";

export default {
  name: "SortModal",

  mixins: [modal],

  components: {
    draggable,
  },

  data() {
    return {
      dragOptions,
      disabled: true,
      list: [],
    };
  },

  methods: {
    open() {
      this.visible = true;
      this.disabled = true;

      this.getBanners();
    },

    async getBanners() {
      this.loading = true;
      const { code, data } = await getBanners();
      this.loading = false;

      if (code === 200) {
        this.list = data;
      }
    },

    // 拖拽排序
    dragUpdate() {
      this.disabled = false;
    },

    // 提交排序
    async submit() {
      let sortIds = this.$Util.formatSortParams(this.list);

      this.submitLoading = true;
      const { code } = await updateBannersSort({ sortIds });
      this.submitLoading = false;

      if (code === 200) {
        this.$emit("on-success");
        this.visible = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.sortable-dragging {
  opacity: 0.6;
  background: #fff !important;
  box-shadow: 0 2px 13px 1px rgba(0, 0, 0, 0.15) !important;
}

.banner-list {
  min-height: 160px;
  .banner-item {
    vertical-align: top;
    position: relative;
    display: inline-block;
    margin: 5px;
    width: 260px;
    &:hover {
      cursor: move;
      box-shadow: 0 0 6px #aaa;
    }
    > em {
      position: absolute;
      right: 4px;
      top: 0;
      height: 20px;
      line-height: 20px;
      color: #fff;
      font-size: 12px;
    }
    .banner {
      width: 260px;
      height: 140px;
      border-radius: 5px;
      overflow: hidden;
      background-color: #f5f5f5;
      .image {
        width: 260px;
        height: 140px;
        object-fit: contain;
      }
    }
    .title {
      margin-top: 5px;
      font-size: 14px;
      color: #333;
    }
  }
}
</style>