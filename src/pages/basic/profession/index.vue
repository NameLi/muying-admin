<template>
  <container-layout :footer="false">
    <template v-slot:header>
      <m-button type="refresh" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
      <m-button type="sort" @click="showSortModal()" />
    </template>

    <el-table
      v-loading="loading"
      :data="list"
      stripe
      border
      :indent="20"
      row-key="id"
      height="100%"
    >
      <el-table-column
        prop="name"
        label="职务名称"
        header-align="center"
        align="left"
      />
      <el-table-column prop="name_en" label="英文名称" align="center" />
      <el-table-column prop="count" label="相关影人数" align="center" />
      <m-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span style="color: #f56c6c" v-if="scope.row.status === 1">隐藏</span>
          <span v-else>显示</span>
        </template>
      </m-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="130">
        <template slot-scope="scope">
          <m-button type="edit" @click="showModal(scope.row)" />
          <m-button type="delete" @click="showDeleteModal(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建/编辑 -->
    <profession-modal ref="modal" @on-success="getData" />

    <!-- 排序 -->
    <sort-modal ref="sortModal" @on-success="getData" />

    <!-- 删除 -->
    <delete-modal ref="deleteModal" @on-success="getData" />
  </container-layout>
</template>

<script>
import { getProfessions, deleteProfession } from "@/api/basic";
import ProfessionModal from "./components/ProfessionModal";
import SortModal from "./components/SortModal";

export default {
  name: "ProfessionList",
  components: {
    ProfessionModal,
    SortModal,
  },
  data() {
    return {
      ...this.$defaults(),
    };
  },
  mounted() {
    this.getData();
  },

  methods: {
    getData(isReset) {
      this.$getData(getProfessions, this, isReset);
    },

    // 新增/编辑
    showModal(row) {
      this.$refs["modal"].open(row);
      this.$refs["modal"].data(this.list);
    },

    // 排序
    showSortModal() {
      this.$refs["sortModal"].open();
    },

    // 删除
    showDeleteModal(row) {
      this.$refs["deleteModal"].open(deleteProfession, row.id);
    },
  },
};
</script>
