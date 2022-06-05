<template>
  <el-dialog
    title="类型排序"
    width="750px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close()"
  >
    <div class="genre-list">
      <draggable v-model="list" v-bind="dragOptions" @update="dragUpdate">
        <div class="genre-item" v-for="(item, index) in list" :key="item.id">
          <em>
            {{ index + 1 }}
            <span style="color: #f56c6c" v-if="index + 1 !== item.sort"
              >({{ item.sort }})</span
            >
          </em>

          <span class="name">{{ item.name }}</span>
          <span class="count">({{ item.count }})</span>
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
import { updateGenresSort } from "@/api/basic";

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
    open(list) {
      this.list = Object.assign(list);
      this.visible = true;
      this.disabled = true;
    },

    // 拖拽排序
    dragUpdate() {
      this.disabled = false;
    },

    // 提交排序
    async submit() {
      let sortIds = this.$Util.formatSortParams(this.list);

      this.submitLoading = true;
      const { code } = await updateGenresSort({ sortIds });
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

.genre-list {
  .genre-item {
    position: relative;
    display: inline-block;
    width: 110px;
    margin: 5px;
    background-color: #f5f5f5;
    height: 48px;
    line-height: 48px;
    text-indent: 10px;
    border-radius: 5px;
    transition: background-color 0.2s;
    user-select: none;
    white-space: nowrap;
    &:hover {
      cursor: move;
      background-color: #e5e5e5;
    }
    > em {
      position: absolute;
      right: 4px;
      top: 0;
      height: 20px;
      line-height: 20px;
      color: #aaa;
      font-size: 12px;
    }
    > i {
      position: absolute;
      left: -2px;
      top: 0;
      height: 20px;
      line-height: 20px;
      color: #f56c6c;
      font-size: 12px;
      font-style: normal;
    }
    .count {
      margin-left: 5px;
      font-size: 12px;
      color: #787b80;
    }
  }
}
</style>