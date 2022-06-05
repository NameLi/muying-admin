<template>
  <el-dialog
    title="奖项类型"
    width="800px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="type-list">
      <div class="sub-header">
        <m-button type="create" size="small" @click="showModal()" />
        <m-button
          type="sort"
          size="small"
          :disabled="loading"
          @click="showSortModal()"
        />
      </div>

      <m-table
        :data="list"
        stripe
        height="calc(100vh - 300px)"
        row-key="id"
        size="mini"
        v-loading="loading"
      >
        <m-table-column prop="type" label="类别" align="left" />
        <m-table-column
          align="left"
          prop="type_en"
          label="类别_英文"
          min-width="110"
        />
        <m-table-column prop="is_actor" label="影人获奖">
          <template slot-scope="scope">
            {{ scope.row.is_actor === 1 ? "是" : "" }}
          </template>
        </m-table-column>
        <m-table-column label="操作" width="140">
          <template slot-scope="scope">
            <m-button type="edit" @click="showModal(scope.row)" />
            <m-button type="delete" @click="deleteType(scope.row)" />
          </template>
        </m-table-column>
      </m-table>

      <!-- 添加或编辑类型 -->
      <type-create ref="modal" @on-success="getAwardTypes" />

      <!-- 排序 -->
      <sort-modal ref="sortModal" @on-success="getAwardTypes" />
    </div>
  </el-dialog>
</template>

<script>
import { getAwardTypes, deleteAwardType } from "@/api/award";

import TypeCreate from "./TypeCreate";
import SortModal from "./SortModal";
import { modal } from "@/mixins/modal";

export default {
  name: "AwardTypeList",

  components: {
    TypeCreate,
    SortModal,
  },

  mixins: [modal],

  inject: ["id"],

  data() {
    return {
      loading: false,
      list: [],
      sortable: null, // 拖拽排序实例
    };
  },

  watch: {
    visible(val) {
      val && this.getAwardTypes();
    },
  },

  methods: {
    // 新增/编辑
    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 排序
    showSortModal() {
      this.$refs["sortModal"].open(this.list);
    },

    // 获取奖项类型
    async getAwardTypes() {
      this.loading = true;
      const { code, data } = await getAwardTypes(this.id);
      this.loading = false;

      if (code === 200) {
        this.list = data;
      }
    },

    // 删除奖项类型
    async deleteType(row) {
      try {
        await this.$confirm("确定要删除该类型吗?", "提示", {
          type: "warning",
        });

        const { code } = await deleteAwardType(this.id, row.id);

        if (code === 200) {
          this.getAwardTypes();
        }
      } catch (e) {}
    },
  },
};
</script>


<style scoped lang="scss">
::v-deep .el-dialog__body {
  padding: 10px 15px 20px;
}
.sub-header {
  padding-bottom: 10px;
  text-align: right;
}
</style>