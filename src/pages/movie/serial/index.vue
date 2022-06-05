<template>
  <container-layout>
    <template v-slot:header>
      <el-input
        size="medium"
        clearable
        v-model="form.keyword"
        @keyup.enter.native="getData(true)"
        placeholder="系列名称"
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
      <m-table-column prop="poster" width="100" label="封面">
        <template slot-scope="scope">
          <table-poster :src="scope.row.poster" />
        </template>
      </m-table-column>
      <m-table-column prop="name" min-width="100" label="中文名称" />
      <m-table-column prop="name_en" min-width="100" label="英文名称" />
      <m-table-column prop="count" min-width="100" label="影视数" />
      <m-table-column
        prop="brief"
        label="简介"
        show-overflow-tooltip
        min-width="180"
      />

      <m-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <m-button type="detail" @click="pathToDetail(scope.row)" />
          <m-button type="edit" @click="showModal(scope.row)" />
          <m-button type="delete" @click="showDeleteModal(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>

    <!-- 新增/编辑 -->
    <serial-modal ref="modal" @on-success="getData()" />

    <!-- 删除 -->
    <delete-modal ref="deleteModal" @on-success="getData()" />
  </container-layout>
</template>

<script>
import { getSerials, deleteSerial } from "@/api/serial";
import SerialModal from "./components/SerialModal";

export default {
  name: "SerialList",
  components: {
    SerialModal,
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
    pathToDetail(row) {
      this.$router.push({
        name: "MovieSerialDetailMovie",
        params: { id: row.id },
      });
    },

    getData(isReset) {
      this.$getData(getSerials, this, isReset);
    },

    // 新增/编辑
    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 删除
    showDeleteModal(row) {
      this.$refs["deleteModal"].open(deleteSerial, row.id);
    },
  },
};
</script>
