<template>
  <container-layout>
    <template v-slot:header>
      <m-button type="refresh" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
      <m-button type="sort" @click="showSortModal()" />
    </template>

    <m-table v-loading="loading" :data="list" :span-method="spanMethod">
      <m-table-column
        prop="country.name"
        label="所属国家"
        width="120"
      />
      <m-table-column
        prop="level"
        label="家长引导"
        width="120"
      />
      <m-table-column
        prop="level_zh"
        label="家长引导中文"
        width="120"
      />
      <m-table-column prop="descript" label="引导模板" align="left" />
      <m-table-column prop="status" label="类型状态" width="100">
        <template slot-scope="scope">
          <span style="color: #f56c6c" v-if="scope.row.status === 1">隐藏</span>
          <span v-else>显示</span>
        </template>
      </m-table-column>
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
    <level-modal ref="modal" @on-success="getData()" />

    <!-- 排序 -->
    <sort-modal ref="sortModal" @on-success="getData()" />

    <!-- 删除 -->
    <delete-modal ref="deleteModal" @on-success="getData()" />
  </container-layout>
</template>

<script>
import { getLevels, deleteLevel } from "@/api/basic";
import LevelModal from "./components/LevelModal";
import SortModal from "./components/SortModal";

export default {
  name: "LevelList",
  components: {
    LevelModal,
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
      this.$getData(getLevels, this, isReset);
    },

    showModal(row) {
      this.$refs["modal"].open(row);
    },

    showSortModal() {
      this.$refs["sortModal"].open();
    },

    showDeleteModal(row) {
      this.$refs["deleteModal"].open(deleteLevel, row.id);
    },

    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // 当 当前行与上一行内容相同时 返回0 0 意味消除
        if (
          rowIndex > 0 &&
          row.country_id === this.list[rowIndex - 1]["country_id"]
        ) {
          return {
            rowspan: 0,
            colspan: 0,
          };
        } else {
          let rows = 1;
          for (let i = rowIndex; i < this.list.length - 1; i++) {
            if (row["country_id"] === this.list[i + 1]["country_id"]) {
              rows++;
            }
          }
          // 返回相同内容的行数
          return {
            rowspan: rows,
            colspan: 1,
          };
        }
      }
    },
  },
};
</script>
