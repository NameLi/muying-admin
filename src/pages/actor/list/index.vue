<!-- 影人列表 -->

<template>
  <container-layout>
    <template v-slot:header>
      <m-select
        v-model="form.country"
        :options="countries"
        filterable
        use-slot
        placeholder="选择国家/地区"
      />

      <m-select
        v-model="form.year"
        :options="years"
        filterable
        use-slot
        placeholder="选择出生年代"
      />

      <m-select
        v-model="form.status"
        :options="statusList"
        use-slot
        placeholder="选择影人状态"
      />

      <el-input
        size="medium"
        v-model="form.keyword"
        placeholder="演员姓名"
        clearable
      />

      <m-button type="search" @click="getData(true)" :loading="loading" />

      <m-button type="create" @click="showCreateModal()" />
    </template>

    <template v-slot:default>
      <m-table
        v-loading="loading"
        :data="list"
        :sort.sync="sort"
        @sort-change="getData(true)"
        sortby="birthday, works_count, photo_count, collection_count"
      >
        <m-table-column label="封面" width="100">
          <template slot-scope="scope">
            <table-poster :src="scope.row.avatar" :status="scope.row.status" />
          </template>
        </m-table-column>

        <m-table-column prop="name" label="中文名" width="160" />
        <m-table-column prop="gender" label="性别" width="60" />
        <m-table-column prop="country.name" label="国籍" width="120" />
        <m-table-column prop="birthday" label="出生日期" width="120" />
        <m-table-column prop="professions" label="职务" width="160" />
        <m-table-column prop="collection_count" label="收藏数" width="100" />
        <m-table-column prop="works_count" label="作品数" width="100" />
        <m-table-column prop="photo_count" label="照片数" width="100" />
        <m-table-column
          align="left"
          prop="brief"
          label="简介"
          min-width="220"
          show-overflow-tooltip
        />
        <m-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <m-button type="detail" @click="pathToDetail(scope.row)" />
            <m-button type="status" @click="showStatusModal(scope.row)" />
            <m-button type="delete" @click="showDeleteModal(scope.row)" />
          </template>
        </m-table-column>
      </m-table>

      <!-- 创建影人ID信息 -->
      <actor-modal ref="createModal" @on-success="getData()" />

      <!-- 变更影人状态 -->
      <status-modal ref="statusModal" type="actor" @on-success="getData()" />

      <!-- 删除影人 -->
      <delete-modal ref="deleteModal" type="actor" @on-success="getData()" />
    </template>

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import {
  getActors,
  updateActorStatus,
  getActorsCountryCount,
  getActorsYearCount,
  getActorsStatusCount,
} from "@/api/actor";
import ActorModal from "./components/ActorModal";

export default {
  name: "ActorList",

  components: {
    ActorModal,
  },

  data() {
    return {
      ...this.$defaults(),
      form: {
        country: "",
        year: "",
        keyword: "",
        status: "",
      },
      years: [],
      countries: [],
      statusList: [],
    };
  },

  mounted() {
    this.getData(); // 影人列表

    this.getActorsCountryCount(); // 影人国家/地区统计列表
    this.getActorsYearCount(); // 影人出生年份统计列表
    this.getActorsStatusCount(); // 影人状态统计列表
  },

  methods: {
    // 跳转到影人详情页
    pathToDetail(row) {
      this.$router.push({
        name: "ActorDetailData",
        params: { id: row.id },
      });
    },

    // 获取影人列表
    getData(isReset) {
      this.$getData(getActors, this, isReset);
    },

    // 创建影人
    showCreateModal() {
      this.$refs["createModal"].open();
    },

    // 设置影人状态
    showStatusModal(row) {
      this.$refs["statusModal"].open(updateActorStatus, row);
    },

    // 删除影人
    showDeleteModal(row) {
      this.$refs["deleteModal"].open(row.id);
    },

    // 获取影人出生年份统计列表
    async getActorsYearCount() {
      const { code, data } = await getActorsYearCount();
      if (code === 200) {
        this.years = data;
      }
    },

    // 获取影人国家/地区统计列表
    async getActorsCountryCount() {
      const { code, data } = await getActorsCountryCount();
      if (code === 200) {
        this.countries = data;
      }
    },

    // 获取影人状态统计列表
    async getActorsStatusCount() {
      const { code, data } = await getActorsStatusCount();
      if (code === 200) {
        this.statusList = data;
      }
    },
  },
};
</script>
