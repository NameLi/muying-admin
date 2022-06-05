<template>
  <el-dialog
    title="历史记录"
    width="700px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    @close="close()"
  >
    <div class="history-list">
      <m-table v-loading="loading" :data="list">
        <m-table-column prop="admin.nickname" label="操作人" width="100" />

        <m-table-column prop="created_at" label="操作时间" width="100" />
        <m-table-column prop="description" label="编辑描述" />

        <m-table-column label="操作" width="70">
          <template slot-scope="scope">
            <m-button type="text" @click="showModal(scope.row)">详情</m-button>
          </template>
        </m-table-column>
      </m-table>
    </div>

    <div class="pagination">
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </div>

    <history-detail-modal ref="historyModal" />
  </el-dialog>
</template>

<script>
import { modal } from "@/mixins/modal";
import HistoryDetailModal from "../DetailModal/index.vue";

export default {
  name: "HistoryModal",

  components: {
    HistoryDetailModal,
  },

  inject: ["id"],

  mixins: [modal],

  data() {
    return {
      ...this.$defaults(),
    };
  },

  watch: {
    visible(val) {
      val && this.getData();
    },
  },

  methods: {
    open(request) {
      this.request = request;
      this.visible = true;
    },

    // 影视变更历史记录
    getData() {
      this.$getData(this.request, this, false, this.id);
    },

    // 记录详情
    showModal(row) {
      this.$refs["historyModal"].open(row);
    },

    // 关闭模态框
    close() {
      this.visible = false;
    },
  },
};
</script>

<style scoped lang="scss">
.history-list {
  height: calc(100vh - 20vh - 160px);
}
.pagination {
  padding-top: 10px;
  text-align: right;
}
</style>