<!-- 制作/出品/发行公司 -->
<template>
  <container-layout height="calc(100vh - 117px)">
    <template v-slot:header>
      <m-select
        v-model="form.type"
        :options="typeList"
        placeholder="选择类型"
        @change="getData(true)"
      />
      <m-button type="search" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
    </template>

    <m-table v-loading="loading" :data="list">
      <m-table-column prop="company.name" label="公司名称" />
      <m-table-column prop="company.name_en" label="公司英文名称" />
      <m-table-column prop="type.name" label="公司类型" />
      <m-table-column label="操作" width="120">
        <template slot-scope="scope">
          <m-button type="edit" @click="showModal(scope.row)" />
          <m-button type="delete" @click="deleteSticky(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <!-- 新增/编辑 -->
    <company-modal ref="modal" :type-list="typeList" @on-success="getData()" />

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import { getMovieCompanies, deleteMovieCompany } from "@/api/movie";

import CompanyModal from "./components/CompanyModal";

export default {
  name: "MovieDetailInfoCompany",

  components: {
    CompanyModal,
  },

  inject: ["id"],

  data() {
    return {
      ...this.$defaults(),
      typeList: [
        {
          label: "制作公司",
          value: 1,
        },
        {
          label: "出品公司",
          value: 2,
        },
        {
          label: "发行公司",
          value: 3,
        },
        {
          label: "联合出品",
          value: 4,
        },
        {
          label: "联合发行",
          value: 5,
        },
        {
          label: "其它",
          value: 9,
        },
      ],

      form: {
        type: null,
      },
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData(isReset) {
      this.$getData(getMovieCompanies, this, isReset, this.id);
    },

    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 删除关联
    async deleteSticky(row) {
      try {
        await this.$confirm("确定要删除该公司吗?", "提示", {
          type: "warning",
        });

        const { code } = await deleteMovieCompany(this.id, row.id);

        if (code === 200) {
          this.getData();
        }
      } catch (e) {}
    },
  },
};
</script>