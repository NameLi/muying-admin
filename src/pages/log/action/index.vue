<template>
  <container-layout>
    <template v-slot:header>
      <m-select v-model="form.method" :options="methods" />
      <m-select v-model="form.table" :options="tables" />

      <el-date-picker
        size="medium"
        style="width: 260px; margin-right: 10px"
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      />

      <m-button type="search" :loading="loading" @click="getData(true)" />
      <el-button
        type="success"
        size="medium"
        icon="el-icon-refresh"
        :loading="loading"
        @click="getData(true)"
      />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
    >
      <m-table-column prop="id" label="ID" width="80" />
      <m-table-column prop="admin_id" label="admin_id" width="100" />
      <m-table-column prop="union_id" label="union_id" width="80" />
      <m-table-column prop="table" label="table" width="80" />
      <m-table-column prop="method" label="method" width="85">
        <template slot-scope="scope">
          <el-tag :type="scope.row.method | tagType">{{
            scope.row.method
          }}</el-tag>
        </template>
      </m-table-column>
      <m-table-column prop="uri" label="uri" align="left" min-width="100" />
      <m-table-column prop="ip" label="ip" width="100" />
      <m-table-column
        prop="description"
        label="description"
        min-width="100"
        align="left"
        show-overflow-tooltip
      />
      <m-table-column prop="created_at" label="操作时间" width="100" />

      <m-table-column fixed="right" label="操作" width="70">
        <template slot-scope="scope">
          <el-button type="primary" @click="showModal(scope.row)"
            >详情</el-button
          >
        </template>
      </m-table-column>
    </m-table>

    <!-- 详情 -->
    <action-modal ref="modal" />

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import { getActionLogs } from "@/api/log";
import ActionModal from "./components/ActionModal";

export default {
  name: "LogAction",
  
  components: { ActionModal },

  data() {
    return {
      ...this.$defaults(),
      date: "",
      form: {
        method: "",
        table: "",
        start_at: "",
        end_at: "",
      },
      methods: [
        {
          label: "post",
          value: "post",
        },
        {
          label: "patch",
          value: "patch",
        },
        {
          label: "delete",
          value: "delete",
        },
      ],
      tables: [],
    };
  },

  watch: {
    date(val) {
      if (val) {
        this.form.start_at = val[0];
        this.form.end_at = val[1];
      } else {
        this.form.start_at = "";
        this.form.end_at = "";
      }
    },
  },

  filters: {
    tagType(val) {
      let type = "";
      switch (val) {
        case "POST":
          type = "primary";
          break;
        case "PUT":
          type = "success";
          break;
        case "PATCH":
          type = "warning";
          break;
        case "DELETE":
          type = "danger";
          break;
      }
      return type;
    },
  },

  mounted() {
    this.tables = [
      "movie",
      "actor",
      "role",
      "user",
      "video",
      "photo",
      "article",
      "admin",
      "genre",
      "country",
      "level",
    ].map((v) => {
      return {
        value: v,
        label: v,
      };
    });
    this.getData();
  },

  methods: {
    getData(isReset) {
      this.$getData(getActionLogs, this, isReset);
    },

    showModal(row) {
      this.$refs["modal"].open(row);
    },
  },
};
</script>
