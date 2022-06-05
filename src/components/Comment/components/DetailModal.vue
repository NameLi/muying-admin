<template>
  <el-dialog
    title="评论详情"
    width="460px"
    :visible.sync="visible"
    append-to-body
    @close="close"
  >
    <div class="modal-content" v-loading="loading">
      <div class="content" v-html="comment.content"></div>
      <div class="author" v-if="author">
        <span class="username">作者：{{ author.username }}</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { modal } from "@/mixins/modal";
import { getComment } from "@/api/comment";

export default {
  name: "DetailModal",

  mixins: [modal],

  props: {},

  data() {
    return {
      loading: false,
      comment: {},
    };
  },

  computed: {
    author() {
      return this.comment?.author;
    },
  },

  methods: {
    open(id) {
      this.visible = true;
      this.getComment(id);
    },

    async getComment(id) {
      this.loading = true;
      const { code, data } = await getComment(id);
      this.loading = false;

      if (code === 200) {
        this.comment = data;
      }
    },
    close() {
      this.visible = false;
      this.comment = {};
    },
  },
};
</script>


<style scoped lang="scss">
.modal-content {
  min-height: 60px;
  .content {
    padding: 10px;
    text-align: justify;
    background-color: #f5f5f5;
  }
  .author {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 40px;
    .username {
      margin-left: 8px;
    }
  }
}
</style>