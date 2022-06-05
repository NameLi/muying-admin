<template>
  <container-layout>
    <template v-slot:header>
      <div class="search-wrapper">
        <m-button type="create" @click="showModal()" />
        <m-button type="refresh" @click="getData()" />
      </div>
    </template>

    <template v-slot:default>
      <m-table
        v-loading="loading"
        :data="list"
        :sort.sync="sort"
        @sort-change="getData(true)"
        sortby="year,rating"
      >
        <m-table-column label="封面" width="87">
          <template slot-scope="scope">
            <table-poster v-if="scope.row.movie" :src="scope.row.movie.poster" />
          </template>
        </m-table-column>
        <m-table-column prop="movie.title" label="中文名" min-width="160" />
        <m-table-column prop="movie.genres" label="类型" width="140" />
        <m-table-column prop="movie.year" label="年代" width="80" />
        <m-table-column prop="movie.rating" label="评分" width="100" />

        <m-table-column prop="mark" label="关联备注" min-width="220" />

        <m-table-column label="操作" width="130" fixed="right">
          <template slot-scope="scope">
            <m-button type="edit" @click="showModal(scope.row)" />
            <m-button type="delete" @click="showDeleteModal(scope.row)" />
          </template>
        </m-table-column>
      </m-table>

      <!-- 增加与编辑 -->
      <movie-modal ref="movieModal" @on-success="getData()" />

      <!-- 删除 -->
      <delete-modal ref="deleteModal" @on-success="getData()" />
    </template>

    <template v-slot:footer>
      <m-pagination layout="total" :pagination.sync="pagination" />
    </template>
  </container-layout>
</template>

<script>
import { getSerialMovies, deleteSerialMovie } from "@/api/serial";
import MovieModal from "./components/MovieModal";

export default {
  name: "SerialMovie",
  components: { MovieModal },

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
      this.$getData(getSerialMovies, this, isReset, this.id);
    },

    showModal(row) {
      this.$refs["movieModal"].open(row);
    },

    showDeleteModal(row) {
      this.$refs["deleteModal"].open(deleteSerialMovie, this.id, row.id);
    },
  },
};
</script>
