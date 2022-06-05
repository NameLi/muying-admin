<template>
  <div class="form" v-loading="loading">
    <div class="history" @click="showHistory()">历史记录</div>

    <el-form :model="movie" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="状态：" prop="title">
        <el-radio-group v-model="movie.status">
          <el-radio
            v-for="status in statusList"
            :label="status.value"
            :key="status.value"
            >{{ status.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <!-- 上映相关 -->
      <el-form-item label="上映状态：">
        <el-radio-group v-model="movie.release_status">
          <el-radio :label="0">无</el-radio>
          <el-radio :label="1">即将上映</el-radio>
          <el-radio :label="2">正在热映</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="上映日期：" prop="release_date">
        <el-input
          v-model="movie.release_date"
          clearable
          placeholder="例：2021-12-01"
        />
      </el-form-item>

      <el-form-item label="中文名：" prop="title">
        <el-input v-model="movie.title" placeholder="请填写影视名称" />
      </el-form-item>

      <el-form-item label="海报：" prop="poster">
        <div class="poster-item">
          <!-- 删除海报 -->
          <div class="delete-poster" @click="movie.poster = ''">
            <i class="el-icon-close"></i>
          </div>

          <el-image
            v-if="movie.poster"
            style="height: 140px"
            fit="contain"
            :src="movie.poster"
            :preview-src-list="[movie.poster]"
          />

          <div class="poster-none" v-else>暂无海报</div>

          <div class="poster-edit" @click="showPhotoWall()">
            {{ movie.poster ? "更换海报" : "选择海报" }}
          </div>
        </div>

        <el-input v-model="movie.poster" style="display: none" />
      </el-form-item>

      <el-form-item label="背景色：">
        <div class="bgcolor">
          <div class="bgcolor-picker">
            <el-color-picker size="small" v-model="movie.bgcolor" />
          </div>
          <div class="bgcolor-input">
            <el-input
              v-model="movie.bgcolor"
              clearable
              placeholder="背景色 16进制 例：#ffffff"
            />
          </div>
        </div>
      </el-form-item>

      <el-form-item label="英文名：">
        <el-input v-model="movie.title_en" clearable placeholder="影视英文名" />
      </el-form-item>

      <el-form-item label="原名：">
        <el-input
          v-model="movie.title_original"
          clearable
          placeholder="影视原名"
        />
      </el-form-item>

      <el-form-item label="别名：">
        <tag-group
          size="larger"
          effect="plain"
          type="info"
          v-model="movie.akas"
          placeholder="添加别名"
        />
      </el-form-item>

      <div class="sub-form">
        <el-form-item label="影视分类：" prop="category">
          <el-radio-group
            v-model="movie.category"
            @change="categoryChangeHandle"
          >
            <el-radio label="电影">电影</el-radio>
            <el-radio label="动漫">动漫</el-radio>
            <el-radio label="电视剧">电视剧</el-radio>
            <el-radio label="纪录片">纪录片</el-radio>
            <el-radio label="综艺">综艺</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 与分类联动 -->
        <el-form-item label="已选类型：">
          <el-checkbox-group v-model="movie.genres">
            <el-checkbox
              v-for="genre in movie.genres"
              :key="genre"
              :label="genre"
            >
              {{ genre }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="所属类型：">
          <el-checkbox-group v-model="movie.genres" v-loading="genresLoading">
            <el-checkbox v-for="genre in genres" :key="genre" :label="genre">
              {{ genre }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>

      <!-- 三方影视数据 -->
      <div class="sub-form">
        <el-form-item label="豆瓣 ID：">
          <div class="thrid-movie">
            <el-input
              type="number"
              disabled
              v-model.number="movie.douban_id"
              style="width: 210px"
            />

            <template v-if="douban">
              <a
                :href="douban.url"
                target="_blank"
                class="span span-primary right"
                >查看链接</a
              >
            </template>
          </div>
        </el-form-item>

        <!-- IMDB -->
        <el-form-item label="IMDB ID：">
          <div class="thrid-movie">
            <el-input v-model="movie.imdb_id" style="width: 210px" />

            <template v-if="imdb">
              <a
                :href="imdb.url"
                target="_blank"
                class="span span-primary right"
                >查看链接</a
              >
            </template>
          </div>
        </el-form-item>
      </div>

      <div class="sub-form">
        <el-form-item label="年代：" prop="year">
          <el-input type="number" v-model.number="movie.year" />
        </el-form-item>

        <el-form-item label="首映时间：">
          <el-input v-model="movie.pubdate" />
        </el-form-item>

        <el-form-item label="片长">
          <el-input
            type="number"
            v-model="movie.duration"
            placeholder="上映版片长"
          />
        </el-form-item>

        <el-form-item label="片长：">
          <tag-group
            size="larger"
            effect="plain"
            type="info"
            v-model="movie.durations"
            placeholder="添加片长"
          />
        </el-form-item>
      </div>

      <el-form-item label="银幕：">
        <el-checkbox-group v-model="movie.versions">
          <el-checkbox
            v-for="version in versions"
            :key="version"
            :label="version"
          >
            {{ version }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="彩蛋个数：">
        <m-input-number v-model="movie.egg_hunt" placeholder="彩蛋个数" />
      </el-form-item>

      <el-form-item label="色彩：">
        <el-radio-group v-model="movie.color">
          <el-radio :label="0">彩色</el-radio>
          <el-radio :label="1">黑白</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 电视剧/动漫/纪录片等类型额外字段 -->
      <div class="sub-form">
        <el-form-item label="总季数：">
          <m-input-number v-model="movie.season_count" />
        </el-form-item>

        <el-form-item label="当前季：">
          <m-input-number v-model="movie.current_season" />
        </el-form-item>

        <el-form-item label="总集数：">
          <m-input-number v-model="movie.episode_count" />
        </el-form-item>

        <el-form-item label="当前集数：">
          <m-input-number v-model="movie.current_episode" />
        </el-form-item>

        <el-form-item label="是否完结：">
          <el-radio-group v-model="movie.the_end">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <div class="sub-form">
        <el-form-item label="国家/地区：">
          <div class="country">{{ movie.countries }}</div>
        </el-form-item>

        <el-form-item label="国家/地区：">
          <remote-select
            v-model="movie.country_ids"
            :options="movie.country_list"
            type="country"
            multiple
            placeholder="请选择国家"
          />
        </el-form-item>

        <el-form-item label="语言：">
          <remote-select
            v-model="movie.languages"
            type="language"
            multiple
            placeholder="请选择语言"
          />
        </el-form-item>
      </div>

      <el-form-item label="标签：">
        <tag-group v-model="movie.tags" placeholder="添加标签" />
      </el-form-item>

      <el-form-item label="简介：">
        <el-input
          type="textarea"
          v-model="movie.summary"
          :maxlength="1000"
          show-word-limit
          :autosize="{ minRows: 16, maxRows: 30 }"
          placeholder="影视简介"
        />
      </el-form-item>

      <el-form-item>
        <m-button
          class="submit"
          type="success"
          round
          size="medium"
          @click="updateMovie('form')"
          :loading="submitLoading"
          >保 存</m-button
        >
      </el-form-item>
    </el-form>

    <!-- 图库 -->
    <photo-wall
      ref="photoWallModal"
      type="movie"
      @on-change="photoChangeHandle"
    />

    <!-- 历史记录 -->
    <history-modal ref="historyModal" />
  </div>
</template>

<script>
import { getMovie, updateMovie, getMovieHistories } from "@/api/movie";
import { getGenresSimple } from "@/api/basic";
import STATUS from "@/config/status";

export default {
  name: "MovieDetailInfoBasic",

  inject: ["id"],

  data() {
    return {
      loading: false,
      submitLoading: false,
      rules: {
        title: [{ required: true, message: "请填写片名", trigger: "blur" }],
        poster: [{ max: 128, message: "请选择图片", trigger: "blur" }],
        year: [
          {
            required: true,
            type: "number",
            message: "请填写上映年份",
            trigger: "blur",
          },
        ],
      },
      type: "",
      movie: {
        poster: "",
        release_status: 0,
        release_date: "",
        akas: [],
        countries: [],
        genres: [],
        durations: [],
        languages: [],
        tags: [],
        pubdates: [],
        versions: [],
        thrid: {},
      },
      genresLoading: false,
      genres: [],
      photos: [], // 海报列表
      versions: ["2D", "3D", "iMax", "iMax3D"],
    };
  },

  computed: {
    statusList() {
      return STATUS["movie"];
    },

    isShowEpisode() {
      return !["电影"].includes(this.movie.category);
    },

    douban() {
      return this.movie.thrid.douban;
    },
    imdb() {
      return this.movie.thrid.imdb;
    },
  },

  mounted() {
    this.getMovie();
  },

  methods: {
    // 显示历史记录
    showHistory() {
      this.$refs["historyModal"].open(getMovieHistories);
    },

    // 显示照片墙，更换影视封面
    showPhotoWall() {
      this.$refs["photoWallModal"].open(this.id);
    },

    // 更换海报
    photoChangeHandle(photo) {
      this.movie.poster = photo.image;
    },

    // 获取影视详情
    async getMovie() {
      this.loading = true;
      const { code, data } = await getMovie(this.id);
      this.loading = false;

      if (code === 200) {
        this.movie = data;

        if (data.category) {
          this.getGenresSimple();
        }
      }
    },

    // 分类改变时，清空类型，并请求类型列表
    categoryChangeHandle() {
      // this.movie.genres = [];
      this.getGenresSimple();
    },

    // 获取影视类型
    async getGenresSimple() {
      if (!this.movie.category) return;

      let params = {
        category: this.movie.category,
      };

      this.genresLoading = true;
      const { code, data } = await getGenresSimple(params);
      this.genresLoading = false;

      if (code === 200) {
        this.genres = data;
      }
    },

    // 更新影视详情
    updateMovie(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.submitLoading = true;
          const { code } = await updateMovie(this.id, this.movie);
          this.submitLoading = false;

          if (code === 200) {
            this.getMovie();
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.form {
  display: inline-block;
  margin: 20px;
  width: 620px;
  .douban {
    position: fixed;
    right: 105px;
    top: 130px;
    padding: 2px 4px;
    color: $color-theme;
    &:hover {
      cursor: pointer;
      opacity: 0.85;
    }
  }
  .history {
    position: fixed;
    right: 35px;
    top: 130px;
    padding: 2px 4px;
    color: $color-theme;
    &:hover {
      cursor: pointer;
      opacity: 0.85;
    }
  }

  .poster-item {
    position: relative;
    width: 100px;
    height: 140px;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    .delete-poster {
      display: none;
      z-index: 9;
      position: absolute;
      top: -8px;
      right: -8px;
      width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background-color: #ccc;
      &:hover {
        background-color: red;
        cursor: pointer;
      }
    }
    .poster-none {
      color: #bbb;
    }
    > img {
      max-width: 100px;
      max-height: 140px;
    }
    &:hover {
      .delete-poster {
        display: block;
      }
      .poster-edit {
        opacity: 1;
        visibility: visible;
      }
    }
  }
  .poster-edit {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    background: rgba(#000, 0.65);
    transition: visibility 0.2s, opacity 0.2s;
  }
  .bgcolor {
    display: flex;
    .bgcolor-picker {
      ::v-deep .el-color-picker__trigger {
        width: 100px;
        border-color: #dcdfe6;
      }
    }
    .bgcolor-input {
      margin-left: 10px;
      flex: 1;
    }
  }
  .thrid-movie {
    display: flex;
    justify-content: space-between;
    ::v-deep .el-button + .el-button {
      margin-left: 0;
    }
  }

  .sub-form {
    margin-bottom: 10px;
    padding-top: 18px;
    padding-right: 20px;
    border-radius: 4px;
    border: 1px dashed #dcdfe6;
    background-color: #f7f7f7;
  }

  .country {
    color: #999;
  }
  .submit {
    z-index: 99;
    position: fixed;
    left: 950px;
    bottom: 68px;
  }
}
</style>