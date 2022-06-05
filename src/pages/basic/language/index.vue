<template>
  <container-layout>
    <template v-slot:header>
      <el-input
        size="medium"
        clearable
        v-model="form.keyword"
        @keyup.enter.native="getData(true)"
        placeholder="语言"
      />
      <m-button type="search" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
    </template>

    <m-table v-loading="loading" :data="list">
      <m-table-column prop="id" min-width="100" label="ID" />
      <m-table-column prop="name" min-width="100" label="中文简称" />
      <m-table-column prop="fullname" min-width="100" label="中文全称" />
      <m-table-column prop="country.name" min-width="100" label="所属国家" />
      <m-table-column prop="name_en" min-width="100" label="英文简称" />
      <m-table-column prop="fullname_en" min-width="100" label="英文全称" />
      <m-table-column prop="movie_count" min-width="100" label="影视数量" />
      <m-table-column
        prop="brief"
        label="简介"
        min-width="180"
        show-overflow-tooltip
      />

      <m-table-column fixed="right" label="操作" width="130">
        <template slot-scope="scope">
          <m-button type="edit" @click="showModal(scope.row)" />
          <m-button type="delete" @click="showDeleteModal(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>

    <!-- 新增/编辑 -->
    <language-modal ref="modal" @on-success="getData" />

    <!-- 删除 -->
    <delete-modal ref="deleteModal" @on-success="getData" />
  </container-layout>
</template>

<script>
import { getLanguages } from "@/api/basic";
import LanguageModal from "./components/LanguageModal";

export default {
  name: "LanguageList",
  components: {
    LanguageModal,
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
      this.$getData(getLanguages, this, isReset);
    },

    showModal(row) {
      this.$refs["modal"].open(row);
    },

    showDeleteModal(row) {
      this.$refs["deleteModal"].open(row);
    },
  },
};
</script>
