<template>
  <container-layout>
    <template v-slot:header>
      <el-input
        size="medium"
        clearable
        v-model="form.keyword"
        @keyup.enter.native="getData(true)"
        placeholder="公司名称"
      />

      <m-button type="search" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
    >
      <m-table-column prop="logo" width="140" label="LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logo" class="logo" height="60" />
        </template>
      </m-table-column>
      <m-table-column prop="name" min-width="100" label="中文简称" />
      <m-table-column prop="name_en" min-width="100" label="英文简称" />
      <m-table-column prop="begin_date" min-width="100" label="成立时间" />
      <m-table-column prop="end_date" min-width="100" label="消失时间" />
      <m-table-column prop="company.name" min-width="100" label="隶属公司" />
      <m-table-column
        prop="country.name"
        min-width="100"
        label="所属国家/地区"
      />
      <m-table-column
        prop="brief"
        label="简介"
        min-width="180"
        show-overflow-tooltip
      />

      <m-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <m-button type="edit" @click="showModal(scope.row)" />
          <m-button type="delete" @click="deleteCompany(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <!-- 新增/编辑 -->
    <company-modal ref="modal" @on-success="getData()" />

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import { getCompanies } from "@/api/basic";
import CompanyModal from "./components/CompanyModal";

export default {
  name: "CompanyList",

  components: {
    CompanyModal,
  },

  data() {
    return {
      ...this.$defaults(),

      form: {
        keyword: "",
      },
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData(isReset) {
      this.$getData(getCompanies, this, isReset);
    },

    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 删除菜单
    async deleteCompany(row) {
      try {
        await this.$confirm("确定要删除该条记录吗?", "提示", {
          type: "warning",
        });

        const { code } = await deleteCompany(row.id);

        if (code === 200) {
          this.getData();
        }
      } catch {}
    },
  },
};
</script>