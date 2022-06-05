<template>
  <container-layout>
    <template v-slot:header>
      <m-button type="refresh" @click="getData(true)" />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
      sortby="collection_count"
    >
      <m-table-column label="封面" width="85">
        <template slot-scope="scope">
          <table-poster :src="scope.row.actor.avatar" />
        </template>
      </m-table-column>

      <m-table-column prop="actor.name" label="演员名称" min-width="160" />
      <m-table-column
        prop="actor.collection_count"
        label="关注数"
        width="100"
      />

      <m-table-column label="关联影视" min-width="180">
        <template slot-scope="scope">
          <movie-popover v-if="scope.row.movie_id" :movie="scope.row.movie" />
        </template>
      </m-table-column>

      <m-table-column
        prop="actor.brief"
        label="简介"
        min-width="220"
        show-overflow-tooltip
      />

      <m-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <m-button
            type="detail"
            :to="`/actor/list/${scope.row.actor_id}/info`"
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
import { getRoleActors } from "@/api/role";

export default {
  name: "RoleActors",

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
    // 获取角色关联影人列表
    getData(isReset) {
      this.$getData(getRoleActors, this, isReset, this.id);
    },
  },
};
</script>
