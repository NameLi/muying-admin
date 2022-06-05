<template>
  <container-layout>
    <template v-slot:header>
      <el-input
        size="medium"
        v-model="form.keyword"
        clearable
        @keyup.enter.native="getData(true)"
        placeholder="文章名称"
      />
      <m-button type="search" :loading="loading" @click="getData(true)" />
      <m-button type="create" @click="showCreateModal()" />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
      sortby="comment_count, save_count, words_count, like_count, read_count, created_at"
    >
      <m-table-column prop="cover" label="封面" width="80">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.cover"
            :src="scope.row.cover"
            fit="contain"
          />
        </template>
      </m-table-column>

      <m-table-column
        align="left"
        prop="title"
        label="标题"
        min-width="160"
        show-overflow-tooltip
      />
      <m-table-column label="作者" width="140">
        <template slot-scope="scope">
          <user-popover :user="scope.row.author" />
        </template>
      </m-table-column>
      <m-table-column prop="read_count" label="浏览量" width="120" />
      <m-table-column prop="like_count" label="点赞数" width="120" />
      <m-table-column prop="words_count" label="字数" width="80" />
      <m-table-column prop="collection_count" label="收藏量" width="100" />
      <m-table-column prop="comment_count" label="评论数" width="100" />
      <m-table-column prop="created_at" label="发布时间" width="100" />

      <m-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <m-button type="detail" @click="pathToDetail(scope.row)" />
          <m-button type="delete" @click="showDeleteModal(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <!-- 新增 -->
    <create-modal ref="createModal" />

    <!-- 删除 -->
    <delete-modal ref="deleteModal" type="article" @on-success="getData()" />

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import { getArticles } from "@/api/article";
import CreateModal from "./components/CreateModal";

export default {
  name: "ArticleList",

  components: {
    CreateModal,
  },

  data() {
    return {
      ...this.$defaults(),
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    // 文章详情
    pathToDetail(row) {
      this.$router.push({
        name: "ArticleDetailContent",
        params: { id: row.id },
      });
    },

    // 获取文章列表
    getData(isReset) {
      this.$getData(getArticles, this, isReset);
    },

    // 新增
    showCreateModal() {
      this.$refs["createModal"].open();
    },

    // 删除文章
    showDeleteModal(row) {
      this.$refs["deleteModal"].open(row.id);
    },
  },
};
</script>
