<template>
  <container-layout>
    <template v-slot:header>
      <el-input
        size="medium"
        v-model="form.keyword"
        placeholder="角色名称"
        clearable
        @keyup.enter.native="getData(true)"
      />
      <m-button type="search" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
      sortby="photo_count, comment_count"
    >
      <m-table-column label="封面" width="100">
        <template slot-scope="scope">
          <table-poster :status="scope.row.status" :src="scope.row.avatar" />
        </template>
      </m-table-column>

      <m-table-column prop="name" label="角色名" width="160" align="left" />
      <m-table-column prop="akas" label="别名" min-width="160" />
      <m-table-column prop="type_zh" label="类型" width="100" />
      <m-table-column prop="movie_count" label="影视数" width="100" />
      <m-table-column prop="actor_count" label="影人数" width="100" />
      <m-table-column prop="comment_count" label="评论数" width="100" />
      <m-table-column prop="photo_count" label="照片数" width="110" />

      <m-table-column
        align="left"
        prop="brief"
        label="简介"
        min-width="220"
        show-overflow-tooltip
      />

      <m-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <m-button type="detail" @click="pathToDetail(scope.row)" />
          <m-button type="status" @click="showStatusModal(scope.row)" />
          <m-button type="delete" @click="showDeleteModal(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <!-- 创建/编辑角色 -->
    <role-modal ref="modal" @on-success="getData()" />

    <!-- 删除角色 -->
    <delete-modal ref="deleteModal" type="role" @on-success="getData()" />

    <!-- 角色状态 -->
    <status-modal ref="statusModal" type="role" @on-success="getData()" />

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import RoleModal from "./components/RoleModal";
import { getRoles, updateRoleStatus } from "@/api/role";

export default {
  name: "RoleList",

  components: {
    RoleModal,
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
    // 角色详情
    pathToDetail(row) {
      this.$router.push({
        name: "RoleDetailData",
        params: { id: row.id },
      });
    },

    // 获取角色信息列表
    getData(isReset) {
      this.$getData(getRoles, this, isReset);
    },

    // 新增/编辑角色
    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 设置角色状态
    showStatusModal(row) {
      this.$refs["statusModal"].open(updateRoleStatus, row);
    },

    // 删除角色
    showDeleteModal(row) {
      this.$refs["deleteModal"].open(row.id);
    },
  },
};
</script>
