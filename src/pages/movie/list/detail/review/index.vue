<template>
  <container-layout>
    <template v-slot:header>
      <m-select v-model="form.status" :options="status" placeholder="状态" />
      <m-button type="search" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
      sortby="rating, like_count, comment_count, created_at"
    >
      <m-table-column label="状态" width="70">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === -1" type="danger">{{
            scope.row.status_zh
          }}</el-tag>
          <el-tag v-else-if="scope.row.status === 0" type="success">{{
            scope.row.status_zh
          }}</el-tag>
          <el-tag
            v-else-if="scope.row.status === 8 || scope.row.status === 9"
            type="warning"
            >{{ scope.row.status_zh }}</el-tag
          >
        </template>
      </m-table-column>

      <m-table-column label="头像" width="71">
        <template slot-scope="scope">
          <img
            v-if="scope.row.author"
            class="avatar"
            width="50"
            height="50"
            :src="scope.row.author.avatar"
          />
        </template>
      </m-table-column>
      <m-table-column prop="author.username" label="用户名" width="120" />
      <m-table-column prop="rating" label="评分" width="70" />
      <m-table-column prop="title" label="标题" width="180" align="left" />
      <m-table-column
        prop="brief"
        label="内容"
        min-width="260"
        align="left"
        :line-clamp="3"
        show-overflow-tooltip
      />
      <m-table-column prop="vote_up_count" label="赞同数" width="100" />
      <m-table-column prop="vote_down_count" label="反对数" width="100" />
      <m-table-column prop="comment_count" label="评论数" width="100" />
      <m-table-column prop="created_at" label="发布时间" width="100" />
      <m-table-column label="操作" width="240" fixed="right">
        <template slot-scope="scope">
          <m-button type="success" @click="showDetailModal(scope.row)"
            >详情</m-button
          >
          <m-button type="primary" :to="`reviews/${scope.row.id}/comments`">
            评论
          </m-button>
          <m-button type="edit" @click="showModal(scope.row)" />
          <m-button type="delete" @click="showDeleteModal(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <!-- 新增/编辑 -->
    <review-modal ref="modal" @on-success="getData" />

    <!-- 详情 -->
    <review-drawer ref="reviewContent" />

    <!-- 删除 -->
    <delete-modal ref="deleteModal" type="review" @on-success="getData" />

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>

    <!-- 详情 -->
    <router-view />
  </container-layout>
</template>

<script>
import { getMovieReviews } from "@/api/movie";
import ReviewModal from "./components/ReviewModal";

export default {
  name: "MovieDetailReviews",
  components: {
    ReviewModal,
  },

  inject: ["id"],

  data() {
    return {
      ...this.$defaults(),
      form: {
        status: null,
      },

      status: [
        {
          label: "不显示",
          value: -1,
        },
        {
          label: "未审核",
          value: 0,
        },
        {
          label: "正常",
          value: 1,
        },
        {
          label: "加精",
          value: 8,
        },
        {
          label: "置顶",
          value: 9,
        },
      ],
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData(isReset) {
      this.$getData(getMovieReviews, this, isReset, this.id);
    },

    showDetailModal(row) {
      this.$refs["reviewContent"].open(row);
    },

    showModal(row) {
      this.$refs["modal"].open(row);
    },

    showDeleteModal(row) {
      this.$refs["deleteModal"].open({ id: row.id });
    },
  },
};
</script>
