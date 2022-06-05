<!-- 影人角色 -->

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
    >
      <m-table-column label="角色封面" width="87">
        <template slot-scope="scope">
          <table-poster :src="scope.row.role.avatar" />
        </template>
      </m-table-column>

      <m-table-column prop="name" label="角色名" min-width="160">
        <template slot-scope="scope">
          <span class="role-name">{{ scope.row.role.name }}</span>
        </template>
      </m-table-column>

      <m-table-column label="关联影视" min-width="180">
        <template slot-scope="scope">
          <movie-popover
            v-for="movie in scope.row.movies"
            :key="movie.id"
            :movie="movie"
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
import { getActorRoles } from "@/api/actor";

export default {
  name: "ActorRoles",

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
    // 获取影人饰演角色
    getData(isReset) {
      this.$getData(getActorRoles, this, isReset, this.id);
    },
  },
};
</script>
