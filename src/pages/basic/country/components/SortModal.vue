<template>
  <el-dialog
    title="国家排序"
    width="80vw"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close()"
  >
    <div class="country-list" v-loading="loading">
      <draggable v-model="list" v-bind="dragOptions" @update="dragUpdate">
        <div class="country-item" v-for="(item, index) in list" :key="item.id">
          <div class="country-item-content">
            <em>
              {{ index + 1 }}
              <span style="color: #f56c6c" v-if="index + 1 !== item.sort"
                >({{ item.sort }})</span
              >
            </em>

            <span class="name">{{ item.name }}</span>
            <span class="count">({{ item.count }})</span>
          </div>
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
import { getSimpleCountries, updateCountriesSort } from "@/api/basic";

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

      this.getSimpleCountries();
    },

    async getSimpleCountries() {
      this.loading = true;
      const { code, data } = await getSimpleCountries();
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
      const { code } = await updateCountriesSort({ sortIds });
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

.country-list {
  min-height: 100px;
  .country-item {
    vertical-align: top;
    position: relative;
    display: inline-block;
    width: 130px;
    margin: 5px;
    background-color: #f5f5f5;
    height: 42px;
    border-radius: 5px;
    transition: background-color 0.2s;
    user-select: none;
    white-space: nowrap;
    &:hover {
      cursor: move;
      background-color: #e5e5e5;
    }
    .country-item-content {
      display: flex;
      align-items: center;
      padding: 0 8px;
      height: 42px;
      line-height: 1.2;
      em {
        position: absolute;
        right: 4px;
        top: 0;
        height: 20px;
        line-height: 16px;
        color: #ccc;
        font-size: 12px;
      }
      .name {
        flex: 1;
        white-space: normal;
      }
      .count {
        flex-shrink: 0;
        margin-left: 5px;
        font-size: 12px;
        color: #787b80;
      }
    }
  }
}
</style>