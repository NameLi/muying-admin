<template>
  <container-layout>
    <template v-slot:header>
      <m-button type="search" :loading="loading" @click="getData(true)" />
    </template>

    <template v-slot:default>
      <m-table v-loading="loading" :data="list">
        <m-table-column label="所属影视">
          <template slot-scope="scope">
            <movie-popover :movie="scope.row.movie" />
          </template>
        </m-table-column>

        <m-table-column prop="movie.rating" label="影视评分" width="100" />
        <m-table-column prop="rating" label="用户评分" width="100" />
        <m-table-column prop="rating_diff" label="评分差值" width="100" />
        <m-table-column prop="is_count" label="是否计分" width="100" />
        <m-table-column prop="created_at" label="评分时间" width="100" />
      </m-table>
    </template>

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import { getUserRatings } from "@/api/user";

export default {
  name: "UserDetailRatings",

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
    // 获取用户评分列表
    getData(isReset) {
      this.$getData(getUserRatings, this, isReset, this.id);
    },
  },
};
</script>
