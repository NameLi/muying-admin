<!-- 影人作品 -->

<template>
  <container-layout>
    <template v-slot:header>
      <m-button type="refresh" :loading="loading" @click="getData()" />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
      sortby="movie.year, movie.rating, movie.vote_count"
    >
      <m-table-column label="封面" width="85">
        <template slot-scope="scope">
          <table-poster
            :src="scope.row.movie.poster"
            :is-starring="scope.row.starring"
          />
        </template>
      </m-table-column>

      <m-table-column prop="movie.title" label="中文名" min-width="160" />
      <m-table-column prop="movie.genres" label="类型" width="140" />
      <m-table-column prop="movie.countries" label="国家" width="100" />
      <m-table-column prop="movie.year" label="年代" width="80" />
      <m-table-column prop="movie.rating" label="评分" width="100" />
      <m-table-column prop="movie.vote_count" label="人数" width="100" />
      <m-table-column prop="profession.name" label="职务" width="100" />

      <m-table-column label="饰演" min-width="180">
        <template slot-scope="scope">
          <role-popover
            v-for="role in scope.row.roles"
            :key="role.id"
            :role="role"
          />
        </template>
      </m-table-column>

      <m-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <m-button
            type="detail"
            :to="{
              name: 'MovieDetailInfo',
              params: { id: scope.row.movie_id },
            }"
          />
        </template>
      </m-table-column>
    </m-table>

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import { getActorWorks } from "@/api/actor";

export default {
  name: "ActorWorks",

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
    // 获取影人作品
    getData(isReset) {
      this.$getData(getActorWorks, this, isReset, this.id);
    },
  },
};
</script>
