<template>
  <container-layout>
    <template v-slot:header>
      <el-input
        clearable
        size="medium"
        v-model="form.keyword"
        @keyup.enter.native="getData(true)"
        placeholder="角色名称"
      />
      <m-button type="search" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
      <m-button type="sort" @click="showSortModal()" />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
    >
      <m-table-column label="角色封面" width="100">
        <template slot-scope="scope">
          <table-poster :src="scope.row.role.avatar" />
        </template>
      </m-table-column>

      <m-table-column prop="role.name" label="角色名称" width="120" />

      <m-table-column label="饰演者" min-width="130">
        <template slot-scope="scope">
          <actor-popover :actor="scope.row.actor" />
        </template>
      </m-table-column>

      <m-table-column
        header-align="center"
        prop="brief"
        label="简介"
        min-width="200"
        show-overflow-tooltip
      />
      <m-table-column label="操作" fixed="right" width="130">
        <template slot-scope="scope">
          <m-button type="edit" @click="showModal(scope.row)" />
          <m-button type="delete" @click="showDeleteModal(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <!-- 新增/编辑 -->
    <role-modal ref="modal" @on-success="getData" />

    <!-- 排序 -->
    <sort-modal ref="sortModal" @on-success="getData" />

    <!-- 删除 -->
    <delete-modal ref="deleteModal" @on-success="getData()" />

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import RoleModal from "./components/RoleModal";
import SortModal from "./components/SortModal";

import { getMovieRoles } from "@/api/movie";
import { deleteUnion } from "@/api/union";

export default {
  name: "MovieRoles",

  components: {
    RoleModal,
    SortModal,
  },

  inject: ["id"],

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
      this.$getData(getMovieRoles, this, isReset, this.id);
    },

    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 角色排序
    showSortModal() {
      this.$refs["sortModal"].open();
    },

    // 删除角色关联
    showDeleteModal(row) {
      this.$refs["deleteModal"].open(deleteUnion, row.id);
    },
  },
};
</script>
