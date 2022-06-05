<template>
  <el-dialog
    title="奖项类型"
    width="600px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    @close="close"
  >
    <div class="type-create">
      <el-form label-width="120px" :model="form" :rules="rules" ref="form">
        <el-form-item label="所属类型：" prop="type_id">
          <el-select
            :loading="loading"
            v-model="form.type_id"
            placeholder="请选择类型"
            style="width: 100%"
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.type"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="获奖影片：">
          <remote-select
            type="movie"
            v-model="form.movie_id"
            :options="movieOptions"
          />
        </el-form-item>

        <el-form-item label="获奖影人：">
          <remote-select
            type="actor"
            v-model="form.actor_id"
            :options="actorOptions"
          />
        </el-form-item>

        <el-form-item label="提名/获奖：" prop="win">
          <el-radio-group v-model="form.win">
            <el-radio :label="1">获奖</el-radio>
            <el-radio :label="0">提名</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注：">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            v-model="form.brief"
            placeholder="获奖简介"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button type="submit" @click="submitForm()" :loading="submitLoading" />
    </div>
  </el-dialog>
</template>

<script>
import {
  getAwardTypes,
  createAwardSessionDetail,
  updateAwardSessionDetail,
} from "@/api/award";

import { modal } from "@/mixins/modal";

export default {
  name: "SessionDetailModal",

  mixins: [modal],

  data() {
    return {
      loading: false,
      typeList: [],
      rules: {
        type_id: [{ required: true, message: "请选择类型", trigger: "change" }],
        win: [{ required: true, message: "请选择获奖类型", trigger: "change" }],
        brief: [
          {
            max: 200,
            message: "长度不超过 200 个字符",
            trigger: "blur",
          },
        ],
      },
      form: {
        id: null,
        type_id: "",
        movie_id: null,
        actor_id: null,
        win: null,
        brief: "",
        movie: null,
        actor: null,
      },
      award_id: "",
      session_id: "",
      movieOptions: [],
      actorOptions: [],
    };
  },

  watch: {
    visible(val) {
      if (val) {
        // 编辑时影片回显
        if (this.form.movie) {
          this.movieOptions = [this.form.movie];
        }

        // 编辑时影人回显
        if (this.form.actor) {
          this.actorOptions = [this.form.actor];
        }

        this.award_id = Number(this.$route.params.id);
        this.session_id = Number(this.$route.params.session_id);

        this.getAwardTypes();
      }
    },
  },

  methods: {
    // 获取奖项类型
    async getAwardTypes() {
      this.loading = true;
      const { code, data } = await getAwardTypes(this.award_id);
      this.loading = false;

      if (code === 200) {
        this.typeList = data;
      }
    },

    // 报错获奖影人影片
    async submit() {
      return this.isEdit
        ? await updateAwardSessionDetail(
            this.award_id,
            this.session_id,
            this.form.id,
            this.form
          )
        : await createAwardSessionDetail(
            this.award_id,
            this.session_id,
            this.form
          );
    },
  },
};
</script>

<style scoped lang="scss">
.type-create {
  padding: 15px 55px 0 35px;
}
</style>