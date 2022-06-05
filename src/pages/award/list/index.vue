<template>
  <container-layout>
    <template v-slot:header>
      <el-input
        size="medium"
        v-model="form.keyword"
        @keyup.enter.native="getData(true)"
        placeholder="奖项名称"
      />
      <m-button type="search" @click="getData(true)" :loading="loading" />
      <m-button
        type="warning"
        size="medium"
        icon="el-icon-sort"
        @click="showSortModal()"
        >排 序</m-button
      >
      <m-button type="create" @click="showModal()" />
    </template>

    <template v-slot:default>
      <m-table v-loading="loading" :data="list">
        <m-table-column label="封面" width="92">
          <template slot-scope="scope">
            <table-poster :src="scope.row.poster" />
          </template>
        </m-table-column>

        <m-table-column prop="title" label="奖项名称" min-width="160" />
        <m-table-column prop="categories" label="分类" width="100" />
        <m-table-column prop="name" label="名称" min-width="120" />
        <m-table-column prop="country.name" label="国家/地区" width="120" />
        <m-table-column prop="year" label="年代" width="80" />
        <m-table-column prop="comment_count" label="评论数" width="100" />
        <m-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <m-button type="detail" @click="pathToDetail(scope.row)" />
            <m-button type="edit" @click="showModal(scope.row)" />
            <m-button type="delete" @click="showDeleteModal(scope.row)" />
          </template>
        </m-table-column>
      </m-table>

      <!-- 奖项设置 -->
      <award-modal ref="modal" @on-success="getData" />

      <!-- 奖项排序 -->
      <sort-modal ref="sortModal" @on-success="getData" />

      <!-- 删除奖项 -->
      <delete-modal ref="deleteModal" @on-success="getData" />
    </template>

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import AwardModal from "./components/AwardModal";
import SortModal from "./components/SortModal";
import { getAwards, deleteAward } from "@/api/award";

export default {
  name: "AwardList",

  components: {
    AwardModal,
    SortModal,
  },

  data() {
    return {
      ...this.$defaults(),

      form: {
        keyword: "",
      },
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    // 奖项详情路由
    pathToDetail(row) {
      this.$router.push({
        name: "AwardDetailSession",
        params: { id: row.id },
      });
    },

    // 获取奖项数据
    getData(isReset) {
      this.$getData(getAwards, this, isReset);
    },

    // 奖项创建/编辑
    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 奖项排序
    showSortModal() {
      this.$refs["sortModal"].open();
    },

    // 删除奖项
    showDeleteModal(row) {
      this.$refs["deleteModal"].open(deleteAward, row.id);
    },
  },
};
</script>
