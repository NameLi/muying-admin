<template>
  <el-dialog
    title="奖项排序"
    width="660px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="award-list">
      <m-table
        :data="list"
        stripe
        height="calc(100vh - 300px)"
        row-key="id"
        size="mini"
        v-loading="loading"
      >
        <m-table-column prop="id" label="ID" />
        <m-table-column prop="sort" label="SORT" align="left" />
        <m-table-column prop="title" label="奖项名称" align="left" />
        <m-table-column prop="category" label="奖项类别" />
      </m-table>
    </div>
  </el-dialog>
</template>

<script>
import { getAwards, updateAwardsSort } from "@/api/award";

import { modal } from "@/mixins/modal";

export default {
  name: "AwardSortModal",

  mixins: [modal],

  data() {
    return {
      loading: false,
      list: [],
      sortable: null, // 拖拽排序实例
    };
  },

  watch: {
    visible(val) {
      val && this.getAwards();
    },
  },

  methods: {
    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 获取奖项类型
    async getAwards() {
      this.$nextTick(() => {
        this.drapEnd();
      });

      this.loading = true;
      const { code, data } = await getAwards({ per_page: 200 });
      this.loading = false;

      if (code === 200) {
        this.list = data;
      }
    },

    // 拖拽排序
    drapEnd() {
      const tbody = document.querySelector(
        ".award-list .el-table__body-wrapper tbody"
      );

      const _this = this;

      this.$sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.list.splice(oldIndex, 1)[0];
          _this.list.splice(newIndex, 0, currRow);
          _this.updateAwardsSort();
        },
      });
    },

    /**
     * @desc 更新奖项排序
     */
    async updateAwardsSort() {
      let sortIds = this.$Util.formatSortParams(this.list);

      this.loading = true;
      await updateAwardsSort({ sortIds });
      this.loading = false;
    },
  },
};
</script>


<style scoped lang="scss">
::v-deep .el-dialog__body {
  padding: 10px 15px 20px;
}
</style>