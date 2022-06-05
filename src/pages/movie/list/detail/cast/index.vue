<template>
  <container-layout>
    <template slot="header">
      <m-select
        v-model="form.profession_id"
        size="medium"
        :options="castCountList"
        placeholder="选择类型"
        use-slot
        clearable
        @change="getData(true)"
      />
      <m-button type="search" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
      <m-button type="sort" @click="showSortModal()" />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
    >
      <m-table-column label="头像" width="100">
        <template slot-scope="scope">
          <table-poster
            v-if="scope.row.actor"
            :src="scope.row.actor.avatar"
            :is-starring="scope.row.starring"
          />
        </template>
      </m-table-column>
      <m-table-column prop="actor.name" label="中文名" width="120" />
      <m-table-column prop="profession.name" label="职务" width="120" />
      <m-table-column prop="act" label="饰演" width="120" />
      <m-table-column prop="actor.gender" label="性别" width="70" />
      <m-table-column prop="actor.country" label="国家" width="120" />
      <m-table-column prop="actor.birthday" label="生日" width="120" />
      <m-table-column
        prop="brief"
        label="简介"
        min-width="200"
        show-overflow-tooltip
      />
      <m-table-column
        prop="actor.collection_count"
        label="粉丝数"
        width="120"
      />
      <m-table-column prop="actor.works_count" label="作品数" width="120" />

      <m-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <m-button type="edit" @click="showModal(scope.row)" />
          <m-button type="delete" @click="showDeleteModal(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <!-- 演职人员设置 -->
    <cast-modal ref="modal" @on-success="getData" />

    <!-- 演职人员排序 -->
    <sort-modal
      ref="sortModal"
      :profession-list="castCountList"
      @on-success="getData"
    />

    <!-- 删除 -->
    <delete-modal ref="deleteModal" @on-success="getData()" />

    <template slot="footer">
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import CastModal from "./components/CastModal";
import SortModal from "./components/SortModal";
import { getMovieCast, getMovieCastCount, deleteMovieCast } from "@/api/movie";

export default {
  name: "MovieCast",

  components: {
    CastModal,
    SortModal,
  },

  inject: ["id"],

  data() {
    return {
      ...this.$defaults(),
      form: {
        profession_id: null,
      },
      castCountList: [],
    };
  },

  mounted() {
    this.getData();
    this.getMovieCastCount();
  },

  methods: {
    // 演员职务统计
    async getMovieCastCount() {
      const { code, data } = await getMovieCastCount(this.id);

      if (code === 200) {
        this.castCountList = data;
      }
    },

    // 获取演员表
    getData(isReset) {
      this.$getData(getMovieCast, this, isReset, this.id);
    },

    // 影人职务新增/编辑
    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 演职人员排序
    showSortModal(row) {
      this.$refs["sortModal"].open(row);
    },

    // 删除演职人员
    showDeleteModal(row) {
      this.$refs["deleteModal"].open(deleteMovieCast, this.id, row.id);
    },
  },
};
</script>