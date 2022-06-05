<!-- 上映日期 -->
<template>
  <container-layout height="calc(100vh - 117px)">
    <template v-slot:header>
      <m-button type="refresh" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
    </template>

    <m-table v-loading="loading" :data="list">
      <m-table-column prop="pubdate" label="上映日期" />
      <m-table-column prop="country" label="上映国家" />
      <m-table-column label="首映/重映">
        <template slot-scope="scope">
          <span v-if="scope.row.premiere === 1">首映</span>
          <span v-else-if="scope.row.premiere === 2">重映</span>
        </template>
      </m-table-column>
      <m-table-column prop="remark" label="备注信息" />
      <m-table-column label="操作" width="130">
        <template slot-scope="scope">
          <m-button type="edit" @click="showModal(scope.row)" />
          <m-button type="delete" @click="deleteSticky(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <!-- 新增/编辑 -->
    <pubdate-modal ref="modal" @on-success="getData" />

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import { getMoviePubdates, deleteMoviePubdate } from "@/api/movie";

import PubdateModal from "./components/PubdateModal";

export default {
  name: "MovieDetailInfoPubdate",

  components: {
    PubdateModal,
  },

  inject: ["id"],

  data() {
    return {
      ...this.$defaults(),
      form: {
        type: null,
      },
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    // 获取上映日期列表
    getData(isReset) {
      this.$getData(getMoviePubdates, this, isReset, this.id);
    },

    // 创建/编辑
    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 删除关联
    async deleteSticky(row) {
      try {
        await this.$confirm("确定要删除该记录吗?", "提示", {
          type: "warning",
        });

        const { code } = await deleteMoviePubdate(row.id);

        if (code === 200) {
          this.getData();
        }
      } catch (e) {}
    },
  },
};
</script>