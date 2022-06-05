<template>
  <el-dialog
    title="影人排序"
    width="80vw"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :fullscreen="isFullscreen"
    @close="close()"
  >
    <!-- 自定义全屏按钮 -->
    <div slot="title" class="m-dialog-title">
      <span class="el-dialog__title">影人排序</span>
      <i
        v-if="!isFullscreen"
        class="iconfont icon-max"
        title="最大化"
        @click="isFullscreen = true"
      ></i>
      <i
        v-else
        class="iconfont icon-min"
        title="还原"
        @click="isFullscreen = false"
      ></i>
    </div>

    <el-form
      class="modal-container"
      label-width="95px"
      :model="form"
      ref="form"
    >
      <el-form-item label="演员职务：" prop="profession">
        <m-select
          style="width: 100%"
          size="small"
          v-model="form.profession_id"
          :options="professionList"
          placeholder="请选择演员职务"
          use-slot
          @change="getMovieCast"
        />
      </el-form-item>

      <el-form-item label="演员排序：">
        <ul
          class="cast-list"
          v-if="casts.length || loading"
          v-loading="loading"
        >
          <draggable v-model="casts" v-bind="dragOptions" @update="dragUpdate">
            <transition-group>
              <li class="cast-item" v-for="cast in casts" :key="cast.id">
                <em class="sort">{{ cast.sort }}</em>
                <img class="cast-avatar" :src="cast.actor.avatar" />
                <div class="cast-info">
                  <p class="cast-name">{{ cast.actor.name }}</p>
                </div>
              </li>
            </transition-group>
          </draggable>
        </ul>

        <div class="no-data" v-else>
          {{ form.profession ? "该职务下暂无影人" : "请选择影人职务" }}
        </div>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button
        type="submit"
        @click="submitForm()"
        :disabled="disabled"
        :loading="submitLoading"
      />
    </div>
  </el-dialog>
</template>

<script>
import { getMovieCast, updateMovieCastSort } from "@/api/movie";
import { modal } from "@/mixins/modal";
import draggable from "vuedraggable";
import dragOptions from "@/config/dragOptions";

export default {
  name: "SortModal",

  components: {
    draggable,
  },

  props: {
    // 该影片存在职务列表
    professionList: {
      type: Array,
      default: () => [],
    },
  },

  mixins: [modal],

  data() {
    return {
      dragOptions,

      isFullscreen: false,
      disabled: true,

      form: {
        profession_id: null,
      },

      casts: [],
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.disabled = true;
      } else {
        this.casts = [];
        this.isFullscreen = false;
      }
    },
  },

  methods: {
    // 根据职务查询影人
    async getMovieCast() {
      if (!this.form.profession_id) {
        this.casts = [];
        this.disabled = true;
        return;
      }

      let params = {
        ...this.form,
        page: 1,
        per_page: 999,
      };

      this.loading = true;
      const { code, data } = await getMovieCast(this.id, params);
      this.loading = false;

      if (code === 200) {
        this.disabled = true;
        this.casts = data;
      }
    },

    // 拖拽排序
    dragUpdate() {
      this.disabled = false;
    },

    submit() {
      let sortIds = this.$Util.formatSortParams(this.casts);
      return updateMovieCastSort(this.id, { sortIds });
    },
  },
};
</script>


<style scoped lang="scss">
.sortable-dragging {
  opacity: 0.6;
  background: #fff !important;
  box-shadow: 0 2px 13px 1px rgba(0, 0, 0, 0.15) !important;
}

.m-dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 40px;
  height: 46px;
  .iconfont {
    margin-top: 2px;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    font-size: 15px;
    color: #909399;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}

.modal-container {
  padding: 10px 30px 0;
}
.no-data {
  min-height: 160px;
  font-size: 12px;
  color: #999;
}
.cast-list {
  margin: 0 -5px;
  overflow: hidden;
  min-height: 160px;
  .sortable-ghost {
    &.cast-item {
      background-color: #f5f5f5;
      * {
        visibility: hidden;
      }
    }
    &::after {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      content: "";
      border-radius: 3px;
      border: 1px dashed $color-theme;
    }
  }

  .cast-item {
    position: relative;
    display: inline-block;
    margin: 5px;
    width: 80px;
    &:not(.sortable-ghost):hover {
      cursor: move;
      box-shadow: 0 0 6px #bbb;
    }
    .sort {
      position: absolute;
      left: 0;
      top: 0;
      color: #fff;
      padding: 0 8px 0 6px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      font-size: 10px;
      border-radius: 0 10px 10px 0;
      background-color: rgba(0, 0, 0, 0.35);
    }
    .cast-avatar {
      width: 80px;
      height: 116px;
      background: #eee;
      object-fit: cover;
    }
    .cast-info {
      font-size: 12px;
      p {
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 18px;
        color: #777;
      }
    }
  }
}
</style>