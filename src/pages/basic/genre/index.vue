<template>
  <container-layout>
    <template v-slot:header>
      <m-select
        v-model="form.category"
        :options="categories"
        :clearable="false"
        placeholder="选择分类"
        @change="getData()"
      />

      <m-button type="refresh" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
      <m-button type="sort" @click="showSortModal()" :disabled="loading" />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
    >
      <m-table-column prop="id" label="ID" />
      <m-table-column prop="name" label="类型名称" />
      <m-table-column prop="name_en" label="英文名称" />
      <m-table-column prop="count" label="相关影视数" />
      <m-table-column prop="status" label="类型状态">
        <template slot-scope="scope">
          <span style="color: #f56c6c" v-if="scope.row.status === 1">隐藏</span>
          <span v-else></span>
        </template>
      </m-table-column>
      <m-table-column label="操作" width="130">
        <template slot-scope="scope">
          <m-button type="edit" @click="showModal(scope.row)" />
          <m-button type="delete" @click="showDeleteModal(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <!-- 排序 -->
    <sort-modal ref="sortModal" :list="list" @on-success="getData()" />

    <!-- 新增/编辑 -->
    <genre-modal
      ref="genreModal"
      :category="form.category"
      @on-success="getData()"
    />

    <!-- 删除 -->
    <delete-modal ref="deleteModal" @on-success="getData" />

    <template v-slot:footer>
      <m-pagination
        layout="total"
        :pagination.sync="pagination"
        @on-change="getData()"
      />
    </template>
  </container-layout>
</template>

<script>
import { getGenres, deleteGenre } from "@/api/basic";
import SortModal from "./components/SortModal";
import GenreModal from "./components/GenreModal";
import { categories } from "@/config/basic";

export default {
  name: "GenreList",

  components: {
    SortModal,
    GenreModal,
  },

  data() {
    return {
      ...this.$defaults(),

      categories,
      form: {
        category: "电影",
      },
    };
  },
  mounted() {
    this.getData();
  },

  methods: {
    getData(isReset) {
      this.$getData(getGenres, this, isReset);
    },

    showSortModal() {
      this.$refs["sortModal"].open(this.list);
    },

    showModal(row) {
      this.$refs["genreModal"].open(row);
    },

    showDeleteModal(row) {
      this.$refs["deleteModal"].open(deleteGenre, row.id);
    },
  },
};
</script>
