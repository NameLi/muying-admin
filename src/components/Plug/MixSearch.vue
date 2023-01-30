<template>
  <el-dialog
    title="插入影视/影人/角色"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    width="560px"
    @close="close"
  >
    <div class="search-content">
      <el-input
        v-model="keyword"
        @input="keywordChange"
        ref="input"
        clearable
        placeholder="请输入影视/影人/角色名称"
      />

      <ul class="type-list">
        <li
          v-for="item in typeList"
          :key="item.type"
          class="type-item"
          :class="{ 'is-active': type === item.type }"
          @click="typeChangeHandle(item.type)"
        >
          {{ item.label }}
        </li>
      </ul>

      <div class="search-result">
        <ul
          v-loading="loading"
          class="result-list"
          v-infinite-scroll="infiniteScrollHandle"
          :infinite-scroll-disabled="disabled"
        >
          <li class="result-item" v-for="item in list" :key="item.id">
            <div class="item-poster">
              <img v-if="type === 'movie'" :src="item.poster" />
              <img v-else :src="item.avatar" />
            </div>

            <div class="item-info">
              <div class="info-title">
                {{ type === "movie" ? item.title : item.name }}
              </div>
              <template v-if="type === 'movie'">
                <div class="info-desc">
                  {{ item.year }} / {{ item.rating }} /
                  {{ item.genres.join(",") }}
                </div>
              </template>
              <template v-else-if="type === 'actor'">
                <div class="info-desc">
                  {{ item.birthday }} {{ item.country }}
                </div>
              </template>
              <template v-else-if="type === 'role'">
                <div class="info-desc"></div>
              </template>
            </div>

            <div class="cover" @click="clickHandle(item)">
              <i class="el-icon-plus"></i>
            </div>
          </li>
        </ul>
      </div>

      <!-- <div v-else class="no-more">
        <div class="">未找到相关结果</div>
      </div> -->
    </div>
  </el-dialog>
</template>

<script>
import { getMixSearch } from "@/api/api";

export default {
  name: "MixSearch",

  data() {
    return {
      visible: false,
      type: "movie",
      keyword: "",
      loading: false,
      typeList: [
        {
          type: "movie",
          label: "影视",
        },
        {
          type: "actor",
          label: "影人",
        },
        {
          type: "role",
          label: "角色",
        },
      ],
      list: [],
      page: 1,
      per_page: 20,
      noMore: false,
      timer: null,
    };
  },

  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
  },

  methods: {
    // 父级调用打开模态框
    open() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },

    // 关闭模态框
    close() {
      this.keyword = "";
      this.list = [];
      this.page = 1;
      this.noMore = false;
      this.visible = false;
    },

    typeChangeHandle(type) {
      this.type = type;
      this.keywordChange();
    },

    keywordChange() {
      this.noMore = false;
      this.page = 1;
      this.list = [];
      this.onSearch();
    },

    infiniteScrollHandle() {
      this.onSearch();
    },

    onSearch() {
      this.timer && clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.getMixSearch();
      }, 200);
    },

    async getMixSearch() {
      if (this.keyword === "") return;

      let params = {
        keyword: this.keyword,
        type: this.type,
        page: this.page,
        per_page: this.per_page,
      };

      this.loading = true;
      const { code, data } = await getMixSearch(params);
      this.loading = false;

      if (code === 200) {
        this.list = this.list.concat(data);
        this.page++;

        if (data.length < this.per_page) {
          this.noMore = true;
        }
      }
    },

    // 拼接html并给父组件接收
    clickHandle(row) {
      let html;

      html += ``;

      switch (this.type) {
        // 影视
        case "movie":
          html = `
            <p class="card-input">
              <br data-text="is-card">
            </p>
            <div class="subject-card-item" contenteditable="false">
              <i class="subject-card-delete el-icon-close"></i>
              <div class="subject-card-poster">
                <img
                  class="subject-card-poster-img"
                  src="${row.poster}"
                />
              </div>
              <div class="subject-card-info">
                <div class="subject-card-info-title"><a href="">${row.title}</a></div>
                <div class="subject-card-info-list">
                  <div class="subject-card-info-rating">评分：${row.rating}</div>
                  <div class="subject-card-info-item">${row.year} / ${row.countries} / ${row.genres}</div>
                </div>
              </div>
            </div>
            <p class="card-input">
              <br data-text="is-card">
            </p>
          `;
          break;

        // 影人
        case "actor":
          html = `
      
          `;
          break;

        // 角色
        case "role":
          html = `
      
          `;
          break;
      }
      this.$emit("on-check", html);
      this.visible = false;
    },
  },
};
</script>


<style scoped lang="scss">
.search-content {
  padding: 0 20px;
  .type-list {
    margin-top: 12px;
    height: 24px;
    .type-item {
      display: inline-block;
      margin-right: 5px;
      padding: 0 10px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      border-radius: 2px;
      color: #9b9b9b;
      cursor: pointer;
      transition: color 0.2s, background-color 0.2s;
      &.is-active {
        color: #666;
        background-color: #f5f5f5;
      }
    }
  }
  .search-result {
    .result-list {
      margin-top: 14px;
      height: calc(100vh - 15vh - 200px);
      overflow: auto;
      .result-item {
        position: relative;
        height: 60px;
        display: flex;
        align-items: center;
        .item-poster {
          width: 36px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          overflow: hidden;
          font-size: 0;
          img {
            display: inline-block;
            max-width: 36px;
            max-height: 50px;
          }
        }
        .item-info {
          margin-left: 8px;
          .item-title {
            height: 30px;
            line-height: 22px;
          }
          .info-desc {
            color: #999;
            height: 30px;
            line-height: 32px;
          }
        }
        .cover {
          visibility: hidden;
          z-index: 2;
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          background-color: rgba($color-theme, 0.05);
          line-height: 60px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          > i {
            margin-right: 10px;
            font-size: 16px;
            color: #ccc;
            width: 24px;
            height: 24px;
            line-height: 24px;
            font-weight: bold;
            text-align: center;
            border-radius: 50%;
            border: 1px dashed currentColor;
            &:hover {
              color: $color-theme;
            }
          }
        }
        &:hover {
          cursor: pointer;
          .cover {
            visibility: visible;
          }
        }
      }
    }
  }
}
</style>