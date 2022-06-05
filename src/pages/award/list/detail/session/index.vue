<template>
  <container-layout>
    <template v-slot:header>
      <el-input
        v-model="form.session"
        @keyup.enter.native="getData(true)"
        size="medium"
        clearable
        placeholder="届"
      />
      <m-button type="search" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
      <el-button
        type="warning"
        size="medium"
        icon="el-icon-tickets"
        @click="showTempModal()"
        >模 板</el-button
      >
    </template>

    <template v-slot:default>
      <m-table
        v-loading="loading"
        :data="list"
        :sort.sync="sort"
        @sort-change="getData(true)"
        sortby="session"
      >
        <m-table-column label="封面" width="100">
          <template slot-scope="scope">
            <table-poster :src="scope.row.poster" />
          </template>
        </m-table-column>

        <m-table-column prop="session" label="届" width="120" />
        <m-table-column prop="year" label="年份" width="120" />
        <m-table-column prop="award_date" label="颁奖日期" width="120" />
        <m-table-column prop="award_place" label="颁奖地点" width="170" />
        <m-table-column prop="award_count" label="奖项数量" width="120" />
        <m-table-column
          prop="brief"
          label="简介"
          min-width="200"
          show-overflow-tooltip
        />

        <m-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <m-button
              type="detail"
              :to="`/award/list/${id}/session/${scope.row.id}`"
            />
            <m-button type="edit" @click="showModal(scope.row)" />
            <m-button type="delete" @click="deleteSession(scope.row)" />
          </template>
        </m-table-column>
      </m-table>

      <!-- 类型模板 -->
      <type-list ref="tempModal" />

      <!-- 新增/编辑 -->
      <session-modal ref="modal" @on-success="getData" />

      <!-- 详情 -->
      <router-view />
    </template>

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import SessionModal from "./components/SessionModal";
import TypeList from "./components/TypeList"; // 奖项类型模板

import { getAwardSessions, deleteAwardSession } from "@/api/award";

export default {
  name: "AwardSession",

  components: {
    TypeList,
    SessionModal,
  },

  inject: ["id"],
  
  data() {
    return {
      ...this.$defaults(),
      form: {
        session: "",
      },
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    // 获取奖项届
    getData(isReset) {
      this.$getData(getAwardSessions, this, isReset, this.id);
    },

    // 创建/编辑
    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 类型模板
    showTempModal(row) {
      this.$refs["tempModal"].open(row);
    },

    // 删除届
    async deleteSession(session) {
      try {
        await this.$confirm("确定要删除该届吗?", "提示", {
          type: "warning",
        });

        const { code } = await deleteAwardSession(this.id, session.id);

        if (code === 200) {
          this.getData();
        }
      } catch (e) {}
    },
  },
};
</script>