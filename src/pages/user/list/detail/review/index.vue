<template>
  <container-layout>
    <template v-slot:header>
      <m-button type="refresh" @click="getData(true)" :loading="loading" />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
      sortby="created_at"
    >
      <m-table-column prop="title" label="标题" width="180" />
      <m-table-column
        prop="brief"
        label="内容"
        min-width="250"
        show-overflow-tooltip
      />
      <m-table-column prop="movie" label="相关影视" min-width="130">
        <template slot-scope="scope">
          <movie-popover :movie="scope.row.movie" />
        </template>
      </m-table-column>
      <m-table-column prop="rating" label="评分" width="70" />
      <m-table-column prop="vote_up_count" label="赞同数" width="80" />
      <m-table-column prop="vote_down_count" label="反对数" width="80" />
      <m-table-column prop="comment_count" label="评论数" width="80" />
      <m-table-column prop="created_at" label="发布时间" width="100" />
      <m-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <m-button type="detail" @click="showDetailModal(scope.row)" />
          <m-button type="delete" @click="showDeleteModal(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <!-- 删除影评 -->
    <delete-modal ref="deleteModal" type="review" @on-success="getData()" />

    <!-- 影评详情 -->
    <review-drawer ref="reviewContent" />

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>


<script>
import { getUserReviews } from "@/api/user";

export default {
  name: "UserDetailReviews",

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
    // 获取用户影评列表
    getData(isReset) {
      this.$getData(getUserReviews, this, isReset, this.id);
    },

    // 查看影评详情
    showDetailModal(row) {
      this.$refs["reviewContent"].open(row);
    },

    // 删除影评
    showDeleteModal(row) {
      this.$refs["deleteModal"].open(row.id);
    },
  },
};
</script>
