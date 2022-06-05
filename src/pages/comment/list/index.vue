<template>
  <container-layout>
    <template v-slot:header>
      <m-select
        v-model="form.type"
        :options="typeList"
        use-slot
        placeholder="选择类型"
      />
      <m-button type="search" @click="getData(true)" :loading="loading" />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
      sortby="like_count, report_count, created_at"
    >
      <m-table-column
        align="left"
        prop="content"
        label="内容"
        min-width="300"
        show-overflow-tooltip
      />
      <m-table-column prop="type_zh" label="类型" width="100" />
      <m-table-column label="作者" width="140">
        <template slot-scope="scope">
          <user-popover :user="scope.row.author" />
        </template>
      </m-table-column>
      <m-table-column prop="like_count" label="点赞量" width="100" />
      <m-table-column prop="report_count" label="举报量" width="100" />
      <m-table-column prop="created_at" label="评论时间" width="160" />
      <m-table-column label="操作" width="130" fixed="right">
        <template slot-scope="scope">
          <m-button type="detail" @click="showDetailModal(scope.row)" />
          <m-button type="delete" @click="showDeleteModal(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <!-- 删除评论 -->
    <delete-modal ref="deleteModal" type="comment" @on-success="getData" />

    <!-- 评论详情 -->
    <detail-modal ref="detailModal" />

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import { getComments } from "@/api/comment";
import DetailModal from "./components/DetailModal.vue";

export default {
  name: "Comments",

  components: {
    DetailModal,
  },

  data() {
    return {
      ...this.$defaults(),
      form: {
        type: "",
      },
      typeList: [
        {
          label: "电影",
          value: "movies",
        },
        {
          label: "影评",
          value: "reviews",
        },
        {
          label: "文章",
          value: "articles",
        },
        {
          label: "视频",
          value: "videos",
        },
        {
          label: "角色",
          value: "roles",
        },
      ],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    showDetailModal(row) {
      this.$refs["detailModal"].open(row.id);
    },

    showDeleteModal(row) {
      this.$refs["deleteModal"].open(row.id);
    },

    getData(isReset) {
      this.$getData(getComments, this, isReset, this.form);
    },
  },
};
</script>
