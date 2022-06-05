<template>
  <div class="form">
    <div class="history" @click="showHistory()">历史记录</div>

    <el-form
      v-loading="loading"
      ref="form"
      :model="actor"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="状态：" prop="title">
        <el-radio-group v-model="actor.status">
          <el-radio
            v-for="status in statusList"
            :label="status.value"
            :key="status.value"
            >{{ status.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item label="中文名：" prop="name">
        <el-input v-model="actor.name" />
      </el-form-item>

      <el-form-item label="封面图片：" prop="avatar">
        <div class="poster-item">
          <el-image
            v-if="actor.avatar"
            style="height: 140px"
            fit="contain"
            :src="actor.avatar"
            :preview-src-list="[actor.avatar]"
          />

          <div class="poster-none" v-else>暂无海报</div>

          <div class="poster-edit" @click="showPhotoWall()">
            {{ actor.avatar ? "更换海报" : "选择海报" }}
          </div>
        </div>

        <el-input v-model="actor.avatar" style="display: none" />
      </el-form-item>

      <el-form-item label="英文名：" prop="name_en">
        <el-input v-model="actor.name_en" />
      </el-form-item>

      <el-form-item label="中文别名：">
        <tag-group
          size="larger"
          effect="plain"
          type="info"
          v-model="actor.name_more"
          placeholder="添加别名"
        />
      </el-form-item>

      <el-form-item label="英文别名：">
        <tag-group
          size="larger"
          effect="plain"
          type="info"
          v-model="actor.name_en_more"
          placeholder="添加别名"
        />
      </el-form-item>

      <!-- 三方影视数据 -->
      <div class="sub-form">
        <el-form-item label="豆瓣 ID：">
          <div class="thrid-actor">
            <el-input
              type="number"
              disabled
              v-model.number="actor.douban_id"
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
          <div class="thrid-actor">
            <el-input v-model="actor.imdb_id" style="width: 210px" />

            <template v-if="imdb">
              <a
                :href="imdb.url"
                target="_blank"
                class="span span-primary right"
                >查看链接</a
              >
            </template>

            <template v-else-if="actor.name_en">
              <a
                :href="`https://www.imdb.com/find?s=nm&q=${actor.name_en}&ref_=nv_sr_sm`"
                target="_blank"
                class="span span-warning right"
                >去IMDB搜索</a
              >
            </template>
          </div>
        </el-form-item>
      </div>

      <el-form-item label="职业：">
        <el-tag
          style="margin-right: 10px"
          type="plain"
          v-for="(item, index) in actor.professions"
          :key="index"
          >{{ item }}</el-tag
        >
      </el-form-item>

      <el-form-item label="性别：">
        <el-radio-group v-model="actor.gender">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
          <el-radio label="未知"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="出生日期：">
        <el-date-picker
          style="width: 100%"
          type="date"
          v-model="actor.birthday"
          placeholder="出生日期"
        />
      </el-form-item>

      <el-form-item label="逝世日期：">
        <el-date-picker
          style="width: 100%"
          type="date"
          v-model="actor.deathday"
          placeholder="去世日期"
        />
      </el-form-item>

      <el-form-item label="国家/地区：" prop="country_id">
        <remote-select
          v-model="actor.country_id"
          :options="country"
          type="country"
          placeholder="请选择国家"
        />
      </el-form-item>

      <el-form-item label="出生地址：">
        <el-input v-model="actor.born_place" />
      </el-form-item>

      <el-form-item label="星座：">
        <el-input v-model="actor.constellation" disabled />
      </el-form-item>

      <el-form-item label="简介：" prop="brief">
        <div v-html="actor.brief" v-if="actor.brief"></div>
        <div v-else>无</div>
      </el-form-item>

      <el-form-item>
        <el-button
          class="submit"
          type="success"
          round
          size="medium"
          :loading="submitLoading"
          @click="updateActor()"
          >保 存</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 封面选取 -->
    <photo-wall
      ref="photoWallModal"
      type="actor"
      @on-change="photoChangeHandle"
    />

    <!-- 历史记录 -->
    <history-modal ref="historyModal" />
  </div>
</template>

<script>
import { getActor, updateActor, getActorHistories } from "@/api/actor";
import STATUS from "@/config/status";

export default {
  name: "ActorDetailInfoBasic",

  inject: ["id"],

  data() {
    return {
      loading: false,

      rules: {
        name: [{ required: true, message: "请填写影人姓名", trigger: "blur" }],
      },

      actor: {
        avatar: "",
        country: "",
        country_id: null,
        roles: [],
        name_more: [],
        name_en_more: [],
        thrid: {},
      },
      country: [],
      submitLoading: false,
    };
  },

  computed: {
    statusList() {
      return STATUS["movie"];
    },
    douban() {
      return this.actor.thrid.douban;
    },
    imdb() {
      return this.actor.thrid.imdb;
    },
  },

  mounted() {
    this.getActor();
  },

  methods: {
    // 显示历史记录
    showHistory() {
      this.$refs["historyModal"].open(getActorHistories);
    },

    // 显示照片墙，更换影视封面
    showPhotoWall() {
      this.$refs["photoWallModal"].open(this.id);
    },

    // 更换海报
    photoChangeHandle(photo) {
      this.actor.avatar = photo.url;
    },

    // 获取影人信息
    async getActor() {
      this.loading = true;
      const { code, data } = await getActor(this.id);
      this.loading = false;

      if (code === 200) {
        this.actor = data;
        if (data.country) {
          this.country = [data.country];
        }
      }
    },

    // 更新影人
    updateActor() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.submitLoading = true;
          const { code } = await updateActor(this.id, this.actor);
          this.submitLoading = false;

          if (code === 200) {
            this.getActor();
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
  .sub-form {
    margin-bottom: 10px;
    padding-top: 18px;
    padding-right: 20px;
    border-radius: 4px;
    border: 1px dashed #dcdfe6;
    background-color: #f7f7f7;
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
    > img {
      max-width: 100px;
      max-height: 140px;
    }
    .poster-none {
      color: #bbb;
    }
    &:hover {
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
  .thrid-actor {
    display: flex;
    justify-content: space-between;
    ::v-deep .el-button + .el-button {
      margin-left: 0;
    }
  }

  .submit {
    z-index: 99;
    position: fixed;
    left: 950px;
    bottom: 68px;
  }
}
</style>