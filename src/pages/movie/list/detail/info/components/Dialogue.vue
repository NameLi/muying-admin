<!-- 经典台词 -->
<template>
  <div class="wrapper" v-loading="loading">
    <div class="list" v-if="total">
      <div class="item" v-for="(row, index) in list" :key="row.id">
        <span class="number">{{ index + 1 }}</span>
        <div class="content-box">
          <p class="content" v-html="row.content"></p>
        </div>
        <label class="date">({{ row.created_at }})</label>

        <div class="tool-wrapper">
          <div class="tool">
            <i class="item-edit el-icon-edit" @click="showModal(row)"></i>
            <i class="item-delete el-icon-close" @click="deleteItem(row)"></i>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="no-data">暂无内容</div>

    <!-- 创建/编辑 -->
    <dialogue-modal ref="modal" @on-success="getMovieDialogues()" />
  </div>
</template>

<script>
import { getMovieDialogues, deleteMovieDialogue } from "@/api/movie";
import DialogueModal from "./components/DialogueModal";

export default {
  name: "MovieDetailInfoDialogue",

  components: {
    DialogueModal,
  },

  inject: ["id"],

  data() {
    return {
      loading: false,
      list: [],
      total: 0,
    };
  },

  mounted() {
    this.getMovieDialogues();
  },

  methods: {
    // 创建/编辑
    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 获取经典台词列表
    async getMovieDialogues() {
      this.loading = true;
      const { code, data, total } = await getMovieDialogues(this.id);
      this.loading = false;

      if (code === 200) {
        this.list = data;
        this.total = total;
      }
    },

    // 删除经典台词
    async deleteItem(item) {
      try {
        await this.$confirm("确定要删除该条目吗", "提示", { type: "warning" });

        const { code } = await deleteMovieDialogue(this.id, item.id);

        if (code === 200) {
          this.getMovieDialogues();
        }
      } catch (e) {}
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  min-height: 100%;
  .no-data {
    color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 120px);
  }
  .list {
    padding: 15px;
    color: #666;
    .item {
      margin-bottom: 15px;
      padding: 6px 10px;
      line-height: 22px;
      display: flex;
      position: relative;
      border-radius: 2px;
      &:hover {
        cursor: pointer;
        .content {
          opacity: 0.7;
        }
        .tool-wrapper {
          visibility: visible;
          opacity: 1;
        }
      }
      .number {
        z-index: 2;
        position: relative;
        padding: 0 8px;
        height: 24px;
        line-height: 24px;
        color: #fff;
        background-color: #20a0ff;
        border-radius: 2px;
        box-sizing: border-box;
        text-align: center;
      }
      .content-box {
        flex: 1;
        margin-left: 10px;
        transition: opacity 0.2s;
        text-align: justify;
        white-space: pre-line;
      }
      .date {
        margin-left: 10px;
        color: #909399;
        width: 90px;
        text-align: right;
      }

      .tool-wrapper {
        z-index: 1;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(#000, 0.1);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s;
        .tool {
          z-index: 1;
          position: absolute;
          right: 0;
          top: 0;
          > i {
            display: inline-block;
            margin: 6px 10px 0 0;
            width: 22px;
            height: 22px;
            line-height: 22px;
            border-radius: 50%;
            text-align: center;
            color: #fff;
            background-color: #20a0ff;
            font-size: 12px;
            &.item-edit {
              background-color: #e6a23c;
            }
            &.item-delete {
              background-color: #f56c6c;
            }
            &:hover {
              opacity: 0.85;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
