<template>
  <container-layout>
    <template v-slot:header>
      <m-button type="search" :loading="loading" @click="getData(true)" />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
    >
      <m-table-column prop="id" label="ID" width="80" />
      <m-table-column prop="type" label="日志级别" width="100" />
      <m-table-column prop="union_id" label="union_id" width="100" />
      <m-table-column prop="table" label="数据表名" width="120" />
      <m-table-column prop="method" label="请求方法" width="120" />
      <m-table-column prop="uri" label="uri" />
      <m-table-column prop="params" label="params" width="100" />
      <m-table-column prop="ip" label="IP" width="100" />
      <m-table-column prop="description" label="description" width="100" />
      <m-table-column prop="created_at" label="操作时间" width="100" />
    </m-table>

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import { getSystemLogs } from "@/api/log";

export default {
  name: "LogSystem",
  data() {
    return {
      ...this.$defaults(),
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData(isReset) {
      this.$getData(getSystemLogs, this, isReset);
    },
  },
};
</script>
