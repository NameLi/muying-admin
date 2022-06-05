<template>
  <div class="container" v-loading="loading">
    <div class="award-list" v-if="list.length">
      <div class="award-item" v-for="item in list" :key="item.year">
        <div class="award-item__title">{{ item.year }}年</div>
        <div class="award-item__list">
          <div
            class="award-item__list-item"
            v-for="sub in item.children"
            :key="sub.id"
          >
            <span>第{{ sub.session }}届 {{ sub.award }}</span>
            {{ sub.type }} {{ sub.win === 0 ? "(提名)" : "" }}
            <span v-if="sub.movie">{{ sub.movie.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="data-none" v-else>暂无奖项</div>
  </div>
</template>

<script>
import { getActorAwards } from "@/api/actor";

export default {
  name: "MovieDetailInfoAward",

  inject: ["id"],

  data() {
    return {
      loading: false,
      list: [],
    };
  },

  mounted() {
    this.getActorAwards();
  },

  methods: {
    // 获取影人奖项
    async getActorAwards() {
      this.loading = true;
      const { code, data } = await getActorAwards(this.id);
      this.loading = false;

      if (code === 200) {
        this.list = data;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  min-height: calc(100vh - 140px);
  .award-list {
    margin: 20px;
    .award-item {
      padding-bottom: 20px;
      .award-item__title {
        font-weight: bold;
        height: 26px;
        line-height: 26px;
      }
      .award-item__list {
        text-indent: 14px;
        .award-item__list-item {
          line-height: 24px;
          > span {
            margin: 0 6px;
            color: $color-theme;
          }
        }
      }
    }
  }
  .data-none {
    height: calc(100vh - 120px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
  }
}
</style>