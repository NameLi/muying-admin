<template>
  <container-layout>
    <template v-slot:header>
      <m-select
        v-model="form.release_status"
        :options="release_status"
        placeholder="上映状态"
      />

      <m-select
        v-model="form.category"
        :options="categories"
        placeholder="选择分类"
      />

      <m-select
        v-if="form.category"
        v-model="form.genre"
        :options="genres"
        filterable
        use-slot
        placeholder="选择类型"
      />

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
        placeholder="选择年代"
      />

      <m-select
        v-model="form.status"
        :options="statusList"
        use-slot
        :porps="{ value: '', label: '', count: '' }"
        placeholder="选择影视状态"
      />

      <el-input
        size="medium"
        clearable
        v-model="form.keyword"
        @keyup.enter.native="getData(true)"
        placeholder="影视名称/ID"
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
        sortby="year, rating, vote_count, duration, seen_count, collect_count, comment_count, video_count"
      >
        <m-table-column label="封面" width="92">
          <template slot-scope="scope">
            <table-poster :src="scope.row.poster" :status="scope.row.status" />
          </template>
        </m-table-column>

        <m-table-column prop="title" label="中文名" min-width="160">
          <template slot-scope="scope">
            <div class="title">
              <span>{{ scope.row.title }}</span>

              <!-- 上映状态 -->
              <template v-if="scope.row.release_status">
                <div
                  v-if="scope.row.release_status === 1"
                  class="release-tag release-status is-coming"
                >
                  即将上映
                </div>

                <div
                  v-else-if="scope.row.release_status === 2"
                  class="release-tag release-status is-releasing"
                >
                  正在热映
                </div>

                <div class="release-tag release-date">
                  {{ scope.row.release_date }}
                </div>
              </template>
            </div>
          </template>
        </m-table-column>

        <m-table-column prop="category" label="分类" width="80" />
        <m-table-column prop="genres" label="类型" min-width="120" />
        <m-table-column prop="countries" label="国家/地区" width="120" />
        <m-table-column prop="year" label="年代" width="80" />
        <m-table-column prop="rating" label="评分" width="80" />
        <m-table-column prop="douban_rating" label="豆瓣评分" width="80" />
        <m-table-column prop="vote_count" label="评分人数" width="100" />
        <m-table-column prop="duration" label="时长" width="100" />
        <m-table-column prop="season_count" label="季数" width="80" />
        <m-table-column prop="episode_count" label="集数" width="80" />
        <m-table-column prop="seen_count" label="访问量" width="100" />
        <m-table-column prop="collection_count" label="收藏量" width="100" />
        <m-table-column prop="comment_count" label="评论数" width="100" />
        <m-table-column prop="video_count" label="视频数" width="100" />
        <m-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <m-button type="detail" @click="pathToDetail(scope.row)" />
            <m-button type="status" @click="showStatusModal(scope.row)" />
            <!-- <m-button
              :type="scope.row.release_status === 0 ? 'warning' : 'success'"
              @click="showReleaseModal(scope.row)"
              >上映</m-button
            > -->
            <m-button type="delete" @click="showDeleteModal(scope.row)" />
          </template>
        </m-table-column>
      </m-table>

      <!-- 新增影视 -->
      <movie-modal ref="createModal" @on-success="getData()" />

      <!-- 影视状态设置 -->
      <status-modal ref="statusModal" type="movie" @on-success="getData()" />

      <!-- 上映状态设置 -->
      <release-modal ref="releaseModal" @on-success="getData()" />

      <!-- 删除影视 -->
      <delete-modal ref="deleteModal" type="movie" @on-success="getData()" />
    </template>

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import MovieModal from "./components/MovieModal";
import ReleaseModal from "./components/ReleaseModal";

import {
  getMovies,
  updateMovieStatus,
  getMoviesStatusCount,
  getMoviesCountryCount,
  getMoviesYearCount,
} from "@/api/movie";
import { getDataGenres } from "@/api/data";
import { categories } from "@/config/basic";

export default {
  name: "MovieList",

  components: {
    MovieModal,
    ReleaseModal,
  },

  data() {
    return {
      ...this.$defaults(),
      form: {
        release_status: "",
        category: "",
        country: "",
        genre: "",
        year: "",
        keyword: "",
      },

      categories,

      release_status: [
        {
          label: "正在热映",
          value: 2,
        },
        {
          label: "即将上映",
          value: 1,
        },
      ],

      years: [],
      countries: [],
      genres: [],
      statusList: [],
    };
  },

  watch: {
    "form.category"(val) {
      val && this.getDataGenres();
    },
  },

  activated() {
    this.getData();

    this.getMoviesCountryCount();
    this.getMoviesYearCount();
    this.getMoviesStatusCount();
  },
  methods: {
    // 数据汇总
    showSyncModal() {
      this.$refs.syncModal.open();
    },

    pathToDetail(row) {
      this.$router.push({
        name: "MovieDetailData",
        params: { id: row.id },
      });
    },

    // 影视数据
    getData(isReset) {
      this.$getData(getMovies, this, isReset);
    },

    // 新增影视
    showCreateModal() {
      this.$refs["createModal"].open();
    },

    // 设置影视锁定
    showlockModal(row) {
      this.$refs["lockModal"].open(row);
    },

    // 影视状态
    showStatusModal(row) {
      this.$refs["statusModal"].open(updateMovieStatus, row);
    },

    // 上映日期
    showReleaseModal(row) {
      this.$refs["releaseModal"].open(row);
    },

    // 删除影视
    showDeleteModal(row) {
      this.$refs["deleteModal"].open(row.id);
    },

    // 影视类型数量统计
    async getDataGenres() {
      let params = {
        category: this.form.category,
      };
      const { code, data } = await getDataGenres(params);
      if (code === 200) {
        this.genres = data;
      }
    },

    // 影视国家数量统计
    async getMoviesCountryCount() {
      const { code, data } = await getMoviesCountryCount();
      if (code === 200) {
        this.countries = data;
      }
    },

    // 影视状态统计
    async getMoviesStatusCount() {
      const { code, data } = await getMoviesStatusCount();
      if (code === 200) {
        this.statusList = data;
      }
    },

    // 影视年份统计
    async getMoviesYearCount() {
      const { code, data } = await getMoviesYearCount();
      if (code === 200) {
        this.years = data;
      }
    },
  },
};
</script>

<style lang="scss">
.release-tag {
  position: absolute;
  left: 6px;
  top: 6px;
  padding: 0 6px;
  color: #fff;
  font-size: 12px;
  line-height: 18px;
  border-radius: 2px;
  background-color: #aaa;
  &.release-status {
    left: 6px;
    &.is-releasing {
      background-color: $color-danger;
    }
  }
  &.release-date {
    left: 72px;
    background-color: #67c23a;
  }
}
</style>