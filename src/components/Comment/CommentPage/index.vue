<template>
  <container-layout :z-index="zIndex">
    <template v-slot:header>
      <m-select
        v-model="form.status"
        :options="statusList"
        use-slot
        :porps="{ value: '', label: '' }"
        placeholder="评论状态"
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
      <m-table-column label="作者" width="140">
        <template slot-scope="scope">
          <user-popover :user="scope.row.author" />
        </template>
      </m-table-column>
      <m-table-column
        align="left"
        prop="content"
        label="内容"
        min-width="300"
        show-overflow-tooltip
      />
      <m-table-column prop="like_count" label="点赞量" width="100" />
      <m-table-column prop="report_count" label="举报量" width="100" />
      <m-table-column prop="created_at" label="评论时间" width="160" />
      <m-table-column label="操作" width="130" fixed="right">
        <template slot-scope="scope">
          <m-button type="detail" @click="showDetailModal(scope.row)" />
          <m-button
            v-if="scope.row.is_delete"
            type="warning"
            @click="showDeleteModal(scope.row)"
            >恢复</m-button
          >
          <m-button v-else type="delete" @click="showDeleteModal(scope.row)" />
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
import { getTypeComments } from "@/api/comment";
import DetailModal from "../components/DetailModal.vue";

export default {
  name: "CommentPage",

  components: {
    DetailModal,
  },

  props: {
    zIndex: {
      type: Number,
      default: 0,
    },
    id: {
      type: Number,
      required: true,
    },
    type: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      ...this.$defaults(),
      statusList: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "正常",
          value: 0,
        },
        {
          label: "删除",
          value: -1,
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
      this.$refs["deleteModal"].open(null, row.id);
    },

    getData(isReset) {
      this.$getData(getTypeComments, this, isReset, this.type, this.id);
    },
  },
};
</script>
