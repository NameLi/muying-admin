<!-- 制作/出品/发行公司 -->
<template>
  <container-layout height="calc(100vh - 117px)">
    <template v-slot:header>
      <m-button type="refresh" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
    </template>

    <m-table v-loading="loading" :data="list">
      <m-table-column prop="level.country.name" label="所属国家" width="120" />
      <m-table-column prop="level.level" label="引导等级" width="120" />
      <m-table-column prop="level.level_zh" label="引导等级中文" width="120" />
      <m-table-column prop="descript" label="引导详情" align="left" />
      <m-table-column label="操作" width="130">
        <template slot-scope="scope">
          <m-button type="edit" @click="showModal(scope.row)" />
          <m-button type="delete" @click="deleteSticky(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <!-- 新增/编辑 -->
    <level-modal ref="modal" @on-success="getData()" />

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import { getMovieLevels, deleteMovieLevel } from "@/api/movie";

import LevelModal from "./components/LevelModal";

export default {
  name: "MovieDetailInfoLevel",

  components: {
    LevelModal,
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
    // 获取引导等级列表
    getData(isReset) {
      this.$getData(getMovieLevels, this, isReset, this.id);
    },

    // 创建/编辑
    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 删除
    async deleteSticky(row) {
      try {
        await this.$confirm("确定要删除该记录吗?", "提示", {
          type: "warning",
        });

        const { code } = await deleteMovieLevel(this.id, row.id);

        if (code === 200) {
          this.getData();
        }
      } catch (e) {}
    },
  },
};
</script>