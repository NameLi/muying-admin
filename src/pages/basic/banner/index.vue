<template>
  <container-layout>
    <template v-slot:header>
      <m-button type="search" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
      <m-button type="sort" @click="showSortModal()" />
    </template>

    <m-table v-loading="loading" :data="list">
      <m-table-column prop="banner" width="121" label="横幅图">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.banner"
            style="width: 100px; height: 86px"
            fit="contain"
          />
        </template>
      </m-table-column>
      <m-table-column prop="title" min-width="100" label="标题" />
      <m-table-column prop="link_type" width="80" label="外链">
        <template slot-scope="scope">
          {{ scope.row.link_type ? "有" : "" }}
        </template>
      </m-table-column>
      <m-table-column prop="platform" width="80" label="平台">
        <template slot-scope="scope">
          <span v-if="scope.row.platform === 1">移动端</span>
          <span v-else-if="scope.row.platform === 2">网页端</span>
        </template>
      </m-table-column>
      <m-table-column prop="created_at" min-width="100" label="创建时间" />
      <m-table-column
        prop="mark"
        label="备注"
        min-width="200"
        show-overflow-tooltip
      />

      <m-table-column fixed="right" label="操作" width="210">
        <template slot-scope="scope">
          <m-button
            :type="scope.row.status === 1 ? 'success' : 'warning'"
            @click="updateBannerStatus(scope.row)"
            >{{ scope.row.status === 1 ? "已显示" : "已隐藏" }}</m-button
          >

          <m-button type="edit" @click="showModal(scope.row)" />
          <m-button type="delete" @click="showDeleteModal(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>

    <!-- 新增/编辑 -->
    <banner-modal ref="modal" @on-success="getData()" />

    <!-- 删除 -->
    <delete-modal ref="deleteModal" @on-success="getData()" />

    <!-- 排序 -->
    <sort-modal ref="sortModal" @on-success="getData()" />
  </container-layout>
</template>

<script>
import { getBanners, updateBannerStatus, deleteBanner } from "@/api/basic";
import BannerModal from "./components/BannerModal";
import SortModal from "./components/SortModal";

export default {
  name: "BannerList",
  components: {
    BannerModal,
    SortModal,
  },
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
      this.$getData(getBanners, this, isReset);
    },

    showModal(row) {
      this.$refs["modal"].open(row);
    },

    showSortModal() {
      this.$refs["sortModal"].open();
    },

    // 更新是否显示
    updateBannerStatus(row) {
      let message =
        row.status === 0 ? "确定要显示该Banner吗？" : "确定要隐藏该Banner吗？";

      this.$confirm(message, "提示", {
        type: "warning",
      })
        .then(async () => {
          let params = {
            status: row.status === 0 ? 1 : 0,
          };
          const { code } = await updateBannerStatus(row.id, params);

          if (code === 200) {
            this.getData();
          }
        })
        .catch(() => {});
    },

    showDeleteModal(row) {
      this.$refs["deleteModal"].open(deleteBanner, row.id);
    },
  },
};
</script>
