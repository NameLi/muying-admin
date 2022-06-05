<template>
  <container-layout :zIndex="9" :footer="false">
    <template v-slot:header>
      <m-select
        v-model="form.win"
        :options="typeList"
        @change="getData()"
        placeholder="请选择获奖类型"
      />
      <m-button type="search" @click="getData()" :loading="loading" />
      <m-button type="create" @click="showModal()" />
    </template>

    <m-table v-loading="loading" :data="list" :span-method="spanMethod">
      <m-table-column prop="type_id" label="奖项名称" min-width="100">
        <template slot-scope="scope" v-if="scope.row.type">
          {{ scope.row.type.type }}
        </template>
      </m-table-column>
      <m-table-column prop="movie_id" label="获奖影片">
        <template slot-scope="scope">
          <movie-popover :movie="scope.row.movie" />
        </template>
      </m-table-column>
      <m-table-column prop="actor_id" label="获奖影人">
        <template slot-scope="scope">
          <actor-popover :actor="scope.row.actor" />
        </template>
      </m-table-column>
      <m-table-column prop="win" label="提名/最佳">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.win === 1">获奖</el-tag>
          <el-tag v-else>提名</el-tag>
        </template>
      </m-table-column>
      <m-table-column label="操作" width="120">
        <template slot-scope="scope">
          <m-button type="edit" @click="showModal(scope.row)" />
          <m-button type="delete" @click="deleteDetail(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <session-detail-modal ref="modal" @on-success="getData()" />
  </container-layout>
</template>

<script>
import SessionDetailModal from "./components/DetailModal";
import { getAwardSessionDetails, deleteAwardSessionDetail } from "@/api/award";

export default {
  name: "AwardSessionDetail",

  components: {
    SessionDetailModal,
  },

  inject: ["id"],

  data() {
    return {
      loading: false,
      session_id: Number(this.$route.params.session_id),
      typeList: [
        {
          label: "获奖",
          value: 1,
        },
        {
          label: "提名",
          value: 0,
        },
      ],
      form: {
        win: null,
      },
      list: [],
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    // 获取本届获奖影人影片
    async getData() {
      this.loading = true;
      const { code, data } = await getAwardSessionDetails(
        this.id,
        this.session_id,
        this.form
      );
      this.loading = false;

      if (code === 200) {
        this.$tableScrollReset();
        this.list = data;
      }
    },

    // 新增/编辑影人影片
    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 表格同类型数据合并
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // 当 当前行与上一行内容相同时 返回0 0 意味消除
        if (
          rowIndex > 0 &&
          row.type_id === this.list[rowIndex - 1]["type_id"]
        ) {
          return {
            rowspan: 0,
            colspan: 0,
          };
        } else {
          let rows = 1;
          for (let i = rowIndex; i < this.list.length - 1; i++) {
            if (row["type_id"] === this.list[i + 1]["type_id"]) {
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

    // 删除获奖影人影片
    async deleteDetail(row) {
      try {
        await this.$confirm("确定要删除该条记录吗?", "提示", {
          type: "warning",
        });

        const { code } = await deleteAwardSessionDetail(
          this.id,
          this.session_id,
          row.id
        );

        if (code === 200) {
          this.getData();
        }
      } catch (e) {}
    },
  },
};
</script>