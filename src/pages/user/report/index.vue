<template>
  <container-layout>
    <template slot="header">
      <m-select
        v-model="form.status"
        :options="statusList"
        placeholder="处理状态"
      />

      <m-select
        v-model="form.type"
        :options="typeList"
        placeholder="选择资源类型"
      />

      <m-button type="search" @click="getData(true)" :loading="loading" />
    </template>

    <m-table v-loading="loading" :data="list">
      <m-table-column prop="movie" label="举报者" width="120">
        <template slot-scope="scope">
          <user-popover :user="scope.row.author" />
        </template>
      </m-table-column>
      <m-table-column prop="type" label="资源类型" width="120" />
      <m-table-column prop="union_id" label="资源ID" width="120" />
      <m-table-column prop="reason_zh" label="举报原因" width="120" />
      <m-table-column prop="created_at" label="举报时间" width="120" />
      <m-table-column prop="admin" label="处理人" width="140">
        <template slot-scope="scope">
          <user-popover :user="scope.row.admin" />
        </template>
      </m-table-column>
      <m-table-column label="处理结果" width="140">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.result === 1"
            >未发现内容违规</el-tag
          >
          <el-tag type="danger" v-else-if="scope.row.result === 2"
            >已删除违规内容</el-tag
          >
        </template>
      </m-table-column>
      <m-table-column prop="handle_at" label="处理时间" width="140" />
      <m-table-column
        prop="mark"
        label="处理备注"
        show-overflow-tooltip
        min-width="160"
      />
      <m-table-column label="操作" width="80" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="warning"
            v-if="scope.row.status === 0"
            @click="showHandleModal(scope.row)"
            >处理</el-button
          >
          <el-button type="success" disabled v-else>已处理</el-button>
        </template>
      </m-table-column>
    </m-table>

    <!-- 举报处理 -->
    <handle-modal ref="handleModal" @on-success="getData()" />

    <template slot="footer">
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import HandleModal from "./components/HandleModal";
import { getReports } from "@/api/user";

export default {
  name: "Report",

  components: {
    HandleModal,
  },

  data() {
    return {
      ...this.$defaults(),
      statusList: [
        {
          label: "未处理",
          value: 0,
        },
        {
          label: "已处理",
          value: 1,
        },
      ],
      typeList: [
        {
          label: "影视",
          value: "movies",
        },
        {
          label: "影人",
          value: "actors",
        },
        {
          label: "角色",
          value: "roles",
        },
        {
          label: "视频",
          value: "videos",
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
          label: "评论",
          value: "comments",
        },
        {
          label: "用户",
          value: "users",
        },
      ],
      form: {
        status: 0,
        type: "",
      },
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData(isReset) {
      this.$getData(getReports, this, isReset);
    },

    // 举报处理
    showHandleModal(row) {
      this.$refs.handleModal.open(row);
    },
  },
};
</script>