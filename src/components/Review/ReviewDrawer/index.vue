<template>
  <el-drawer :visible.sync="visible" size="680px" :with-header="false">
    <div class="wrapper">
      <h4 class="title">{{ review.title }}</h4>
      <div class="info">
        <span></span>
        <time>{{ review.created_at }}</time>
      </div>
      <div class="info">
        <div>
          <span class="is-original" v-if="review.is_original === 1">原创</span>
          <span v-if="review.is_spoiler === 1">这篇影评可能有剧透</span>
          <span class="copyright-warning" v-if="review.copyright === 1"
            >禁止商业转载</span
          >
          <span class="copyright-danger" v-else-if="review.copyright === 2"
            >禁止所有转载</span
          >
        </div>
        <div>
          <span><i class="el-icon-view"></i>{{ review.read_count }}</span>
          <span
            ><i class="el-icon-star-off"></i>{{ review.collection_count }}</span
          >
        </div>
      </div>
      <div class="content" v-loading="loading" v-html="review.content"></div>
    </div>
  </el-drawer>
</template>

<script>
import { getReview } from "@/api/review";

export default {
  name: "ReviewDrawer",

  data() {
    return {
      loading: false,
      visible: false,
      review: {},
    };
  },

  computed: {
    copyright() {
      return this.review.copyright === 1
        ? "禁止商业转载"
        : this.review.copyright === 2
        ? "禁止所有转载"
        : "";
    },
  },

  methods: {
    open(row) {
      this.review = row;
      this.visible = true;
      this.getReview();
    },

    close() {
      this.review = {};
      this.visible = false;
    },

    async getReview() {
      this.loading = true;
      const { code, data } = await getReview(this.review.id);
      this.loading = false;

      if (code === 200) {
        this.review = data;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  padding: 20px 30px;
  height: 100vh;
  overflow-y: scroll;
  box-sizing: border-box;
  .title {
    padding: 0 0 20px 0;
    line-height: 24px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  .info {
    display: flex;
    justify-content: space-between;
    color: #999;
    text-align: right;
    padding: 10px 0;
    .is-original {
      font-weight: bold;
      color: $color-theme;
    }
    .copyright-warning {
      color: $color-warning;
    }
    .copyright-danger {
      color: $color-danger;
    }
    span {
      margin-right: 15px;
      &:nth-last-child(1) {
        margin-right: 0;
      }
      > i {
        margin-right: 5px;
      }
    }
  }
  .content {
    min-height: 70vh;
    line-height: 24px;
    text-align: justify;
    ::v-deep img {
      display: inherit;
      margin: 10px auto;
    }
  }
}
</style>