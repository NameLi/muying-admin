<template>
  <container-layout>
    <template v-slot:header>
      <m-select
        v-model="form.status"
        :options="statusList"
        :clearable="false"
        placeholder="状态"
      />

      <m-select v-model="form.type" :options="typeList" placeholder="类型" />

      <m-button type="search" @click="getData(true)" :loading="loading" />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
    >
      <m-table-column
        prop="content"
        label="内容"
        align="left"
        min-width="300"
        show-overflow-tooltip
      />
      <m-table-column prop="rating" label="评分" width="80" />
      <m-table-column prop="like_count" label="点赞" width="80" />
      <m-table-column prop="created_at" label="评论时间" width="100" />
      <m-table-column label="类型" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.type | formatType }}</span>
        </template>
      </m-table-column>

      <m-table-column label="状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0" class="primary">正常</span>
          <span v-else-if="scope.row.status === 1" class="warning"
            >举报隐藏</span
          >
          <span v-else-if="scope.row.status === 8" class="danger"
            >用户删除</span
          >
          <span v-else-if="scope.row.status === 9" class="danger"
            >系统删除</span
          >
          <span v-else class="danger">未知</span>
        </template>
      </m-table-column>

      <m-table-column label="操作" width="70" fixed="right">
        <template slot-scope="scope">
          <m-button type="delete" @click="showDeleteModal(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <!-- 删除 -->
    <delete-modal ref="deleteModal" type="comment" @on-success="getData()" />

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import { getUserComments } from "@/api/user";

const typeList = [
  {
    label: "全部",
    value: "",
  },
  {
    label: "影视",
    value: "movie",
  },
  {
    label: "视频",
    value: "video",
  },
  {
    label: "影评",
    value: "review",
  },
  {
    label: "文章",
    value: "article",
  },
  {
    label: "角色",
    value: "role",
  },
  {
    label: "照片",
    value: "photo",
  },
];

export default {
  name: "UserDetailComments",

  inject: ["id"],

  data() {
    return {
      ...this.$defaults(),

      form: {
        type: "",
        status: 0,
      },

      typeList,

      statusList: [
        {
          label: "正常",
          value: 0,
        },
        {
          label: "删除",
          value: 1,
        },
      ],
    };
  },

  filters: {
    formatType(type) {
      return typeList.find((item) => item.value === type)?.label;
    },
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData(isReset) {
      this.$getData(getUserComments, this, isReset, this.id);
    },

    showDeleteModal(row) {
      this.$refs["deleteModal"].open(null, row.id);
    },
  },
};
</script>
