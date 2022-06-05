<template>
  <container-layout>
    <template v-slot:header>
      <el-input
        size="medium"
        clearable
        v-model="form.keyword"
        @keyup.enter.native="getData(true)"
        placeholder="国家/地区"
      />
      <m-button type="search" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
      <m-button type="sort" @click="showSortModal()" />
    </template>

    <m-table v-loading="loading" :data="list">
      <m-table-column prop="flag" width="121" label="国旗/区旗">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.flag"
            style="width: 100px; height: 86px"
            fit="contain"
          />
        </template>
      </m-table-column>
      <m-table-column prop="id" min-width="100" label="ID" />
      <m-table-column prop="name" min-width="100" label="中文简称" />
      <m-table-column prop="continent" width="80" label="大洲" sortable />
      <m-table-column prop="long_code" width="80" label="国家代码" />
      <m-table-column prop="fullname" min-width="100" label="中文全称" />
      <m-table-column prop="name_en" min-width="100" label="英文简称" />
      <m-table-column prop="fullname_en" min-width="110" label="英文全称" />
      <m-table-column prop="begin_date" min-width="100" label="成立时间" />
      <m-table-column prop="end_date" min-width="100" label="消失时间" />
      <m-table-column
        align="left"
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
    <country-modal ref="modal" @on-success="getData()" />

    <!-- 删除 -->
    <delete-modal ref="deleteModal" @on-success="getData()" />

    <!-- 国家排序 -->
    <sort-modal ref="sortModal" @on-success="getData()" />
  </container-layout>
</template>

<script>
import { getCountries, deleteCountry } from "@/api/basic";
import CountryModal from "./components/CountryModal";
import SortModal from "./components/SortModal";

export default {
  name: "CountryList",
  components: {
    CountryModal,
    SortModal,
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
      this.$getData(getCountries, this, isReset);
    },

    showModal(row) {
      this.$refs["modal"].open(row);
    },

    showSortModal() {
      this.$refs["sortModal"].open();
    },

    showDeleteModal(row) {
      this.$refs["deleteModal"].open(deleteCountry, row.id);
    },
  },
};
</script>
