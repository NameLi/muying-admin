<template>
  <container-layout>
    <template v-slot:header>
      <m-button type="create" @click="showModal()" />
      <m-button type="refresh" @click="getData(true)" :loading="loading" />
    </template>

    <template v-slot:default>
      <m-table
        v-loading="loading"
        :data="list"
        :sort.sync="sort"
        @sort-change="getData(true)"
        sortby="year, rating"
      >
        <m-table-column label="封面" width="87">
          <template slot-scope="scope">
            <table-poster :src="scope.row.movie.poster" />
          </template>
        </m-table-column>
        <m-table-column prop="movie.title" label="中文名" min-width="160" />
        <m-table-column prop="movie.genres" label="类型" width="140" />
        <m-table-column prop="movie.year" label="年代" width="80" />
        <m-table-column prop="movie.rating" label="评分" width="100" />

        <m-table-column prop="actor" label="饰演者" min-width="120">
          <template slot-scope="scope">
            <actor-popover v-if="scope.row.actor_id" :actor="scope.row.actor" />
          </template>
        </m-table-column>

        <m-table-column
          prop="movie.brief"
          label="影视简介"
          min-width="220"
          show-overflow-tooltip
        />

        <m-table-column label="操作" width="130" fixed="right">
          <template slot-scope="scope">
            <m-button type="edit" @click="showModal(scope.row)" />
            <m-button type="delete" @click="showDeleteModal(scope.row)" />
          </template>
        </m-table-column>
      </m-table>

      <!-- 新增/编辑 -->
      <movie-modal ref="modal" @on-success="getData()" />

      <!-- 删除影视关联 -->
      <delete-modal ref="deleteModal" @on-success="getData()" />
    </template>

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import MovieModal from "./components/MovieModal";

import { getRoleMovies } from "@/api/role";
import { deleteUnion } from "@/api/union";

export default {
  name: "RoleMovies",

  components: {
    MovieModal,
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
    // 获取影视关联列表
    getData(isReset) {
      this.$getData(getRoleMovies, this, isReset, this.id);
    },

    // 创建/编辑影视关联
    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 删除影视关联
    showDeleteModal(row) {
      this.$refs["deleteModal"].open(deleteUnion, row.id);
    },
  },
};
</script>
