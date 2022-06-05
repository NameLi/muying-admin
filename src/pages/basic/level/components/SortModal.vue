<template>
  <el-dialog
    title="家长引导排序"
    width="80vw"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close()"
  >
    <div class="modal-container" v-loading="loading">
      <draggable
        tag="ul"
        class="group-list"
        v-model="list"
        v-bind="dragGroupOptions"
        @update="dragGroupUpdate($event)"
      >
        <li class="group-item" v-for="group in list" :key="group.id">
          <div class="group-move-handle group-item__title">
            <em class="group-sort">{{ group.country_sort }}.</em>
            <span>{{ group.name }}</span>
          </div>

          <draggable
            tag="ul"
            class="level-list"
            v-model="group.children"
            v-bind="dragOptions"
            @update="dragUpdate(group.children)"
          >
            <div
              class="level-item"
              v-for="item in group.children"
              :key="item.id"
            >
              <span class="name">{{ item.level }}</span>
              <span
                class="label"
                v-if="item.level_zh && item.level_zh !== item.level"
                >({{ item.level_zh }})</span
              >
              <em class="child-sort">{{ item.sort }}</em>
            </div>
          </draggable>
        </li>
      </draggable>
    </div>
  </el-dialog>
</template>

<script>
import draggable from "vuedraggable";
import dragOptions from "@/config/dragOptions";
import { modal } from "@/mixins/modal";
import {
  getSortLevels,
  updateLevelsCountrySort,
  updateLevelsSort,
} from "@/api/basic";

export default {
  name: "LevelSortModal",

  mixins: [modal],

  components: {
    draggable,
  },

  data() {
    return {
      dragGroupOptions: {
        ...dragOptions,
        handle: ".group-move-handle",
        ghostClass: "sortable-group-ghost",
        forceFallback: true,
        fallbackClass: "sortable-dragging",
      },
      dragOptions: {
        ...dragOptions,
      },
      hasUpdated: false,
      list: [],
    };
  },

  methods: {
    open() {
      this.visible = true;
      this.disabled = true;

      this.getSortLevels();
    },

    async getSortLevels() {
      this.loading = true;
      const { code, data } = await getSortLevels();
      this.loading = false;

      if (code === 200) {
        this.list = data;
      }
    },

    dragGroupUpdate(e) {
      this.updateGroupSort();
    },

    // 更新分组排序
    async updateGroupSort() {
      let sortIds = this.$Util.formatSortParams(this.list);

      this.loading = true;
      let { code } = await updateLevelsCountrySort({ sortIds });
      this.loading = false;

      if (code === 200) {
        this.hasUpdated = true;
        this.getSortLevels();
      }
    },

    // 拖拽排序
    dragUpdate(list) {
      this.updateLevelsSort(list);
    },

    // 提交排序
    async updateLevelsSort(list) {
      let sortIds = this.$Util.formatSortParams(list);

      this.loading = true;
      let { code } = await updateLevelsSort({ sortIds });
      this.loading = false;

      if (code === 200) {
        this.getSortLevels();
        this.hasUpdated = true;
      }
    },

    close() {
      if (this.hasUpdated) {
        this.$emit("on-success");
      }
      this.visible = false;
    },
  },
};
</script>

<style scoped lang="scss">
.sortable-dragging {
  opacity: 0.6;
  border-radius: 3px;
  background: #fff !important;
  box-shadow: 0 2px 13px 1px rgba(0, 0, 0, 0.15) !important;
}

.modal-container {
  user-select: none;
  min-height: 200px;
  .group-list {
    margin-top: -10px;
    .sortable-group-ghost {
      position: relative;
      .group-item__title,
      .level-list {
        visibility: hidden;
      }
      &::after {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        content: "";
        border-radius: 3px;
        border: 1px dashed $color-theme;
      }
    }
    .group-item {
      position: relative;
      margin-top: 12px;
    }

    .group-item__title {
      padding-left: 11px;
      font-size: 16px;
      height: 40px;
      line-height: 45px;
      color: #333;
      .group-sort {
        font-style: italic;
        margin-right: 8px;
        font-weight: bold;
        color: rgba($color-theme, 0.7);
      }
      &:hover {
        cursor: move;
        color: $color-theme;
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          border-radius: 3px;
          border: 1px dashed #999;
        }
      }
    }
  }
  .level-list {
    .sortable-ghost {
      &.level-item {
        color: #fff;
        background-color: #fff;
      }
      &::after {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        content: "";
        border-radius: 3px;
        border: 1px dashed $color-theme;
      }
    }

    .level-item {
      position: relative;
      display: inline-block;
      width: 130px;
      margin: 5px;
      background-color: #f5f5f5;
      height: 42px;
      line-height: 42px;
      text-indent: 8px;
      border-radius: 5px;
      transition: background-color 0.2s;
      user-select: none;
      white-space: nowrap;
      &:not(.sortable-ghost):hover {
        cursor: move;
        background-color: #e5e5e5;
      }
      .label {
        margin-left: 5px;
        font-size: 12px;
        color: #787b80;
      }
      .child-sort {
        z-index: 1;
        position: absolute;
        right: 0;
        top: 13px;
        padding-right: 4px;
        height: 16px;
        line-height: 16px;
        color: #fff;
        font-size: 12px;
        text-indent: 6px;
        border-radius: 10px 0 0 10px;
        background-color: rgba(0, 0, 0, 0.12);
      }
    }
  }
}
</style>