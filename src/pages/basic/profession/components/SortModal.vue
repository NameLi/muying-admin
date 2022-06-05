<template>
  <el-dialog
    title="影人职务排序"
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
        @update="dragUpdate(list)"
      >
        <li class="group-item" v-for="group in list" :key="group.id">
          <div class="group-move-handle group-item__title">
            <em class="group-sort">{{ group.sort }}.</em>
            <span>{{ group.name }}</span>
            <span class="name_en">{{ group.name_en }}</span>
          </div>

          <draggable
            tag="ul"
            class="children"
            v-model="group.children"
            v-bind="dragOptions"
            @update="dragUpdate(group.children)"
          >
            <div class="child" v-for="item in group.children" :key="item.id">
              <div class="value">{{ item.name }}</div>
              <div class="label">{{ item.name_en }}</div>
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
import { getProfessions, updateProfessionsSort } from "@/api/basic";

export default {
  name: "ProfessionSortModal",

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

      this.getProfessions();
    },

    async getProfessions() {
      this.loading = true;
      const { code, data } = await getProfessions();
      this.loading = false;

      if (code === 200) {
        this.list = data;
      }
    },

    dragUpdate(list) {
      this.updateSort(list);
    },

    // 更新排序
    async updateSort(list) {
      let sortIds = this.$Util.formatSortParams(list);

      this.loading = true;
      let { code } = await updateProfessionsSort({ sortIds });
      this.loading = false;

      if (code === 200) {
        this.hasUpdated = true;
        this.getProfessions();
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
  min-height: 160px;
  .group-list {
    margin-top: -10px;
    .sortable-group-ghost {
      position: relative;
      .group-item__title,
      .children {
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
      color: #555;
      .group-sort {
        font-style: italic;
        margin-right: 8px;
        font-weight: bold;
        color: rgba($color-theme, 0.7);
      }
      .name_en {
        margin-left: 4px;
        font-size: 12px;
        color: #666;
      }
      &:hover {
        cursor: move;
        color: $color-theme;
        .name_en {
          color: $color-theme;
        }
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
  .children {
    .sortable-ghost {
      &.child {
        background-color: #fff;
        * {
          visibility: hidden;
        }
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

    .child {
      position: relative;
      display: inline-block;
      width: 160px;
      margin: 5px;
      background-color: #f5f5f5;
      height: 42px;
      text-indent: 8px;
      border-radius: 5px;
      transition: background-color 0.2s;
      user-select: none;
      white-space: nowrap;
      &:not(.sortable-ghost):hover {
        cursor: move;
        background-color: #e5e5e5;
      }
      .value {
        margin-top: 6px;
      }
      .label {
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