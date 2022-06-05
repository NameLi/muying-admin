<!-- 获奖信息 -->
<template>
  <div class="award-container" v-loading="loading">
    <div class="award-list" v-if="list.length">
      <div class="award-item" v-for="item in list" :key="item.id">
        <div class="award-item__title">
          第{{ item.session }}届 {{ item.award }} ({{ item.year }})
        </div>
        <div class="award-item__list">
          <div
            class="award-item__list-item"
            v-for="sub in item.children"
            :key="sub.id"
          >
            {{ sub.type }} {{ sub.win === 0 ? "(提名)" : "" }}
            <span class="actor" v-for="actor in sub.actors" :key="actor.id">
              {{ actor.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="no-data">暂无内容</div>
  </div>
</template>

<script>
import { getMovieAwards } from "@/api/movie";

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
    this.getMovieAwards();
  },

  methods: {
    async getMovieAwards() {
      this.loading = true;
      const { code, data } = await getMovieAwards(this.id);
      this.loading = false;

      if (code === 200) {
        this.list = data;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.award-container {
  min-height: calc(100vh - 120px);
  .no-data {
    color: #999;
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 120px);
  }
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
        .award-item__list-item {
          line-height: 24px;
          .actor {
            margin-left: 12px;
            color: $color-theme;
          }
        }
      }
    }
  }
}
</style>