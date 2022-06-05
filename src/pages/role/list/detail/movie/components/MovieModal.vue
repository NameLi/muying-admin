<template>
  <el-dialog
    title="关联影视"
    width="800px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form
      class="modal-container"
      label-width="120px"
      ref="form"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="影视名称：" prop="movie_id">
        <!-- 远程搜索影视 -->
        <remote-select
          type="movie"
          v-model="form.movie_id"
          :options="movieOptions"
        />
      </el-form-item>

      <el-form-item label="饰演者：">
        <!-- 远程搜索影人 -->
        <remote-select
          type="actor"
          v-model.trim="form.actor_id"
          :options="actorOptions"
        />
      </el-form-item>

      <el-form-item label="角色封面：">
        <image-upload
          category="role"
          type="poster"
          :id="form.id"
          :url.sync="form.avatar"
        />
      </el-form-item>

      <el-form-item label="角色简介：">
        <el-input
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 10 }"
          v-model="form.brief"
          placeholder="角色简介"
          show-word-limit
          maxlength="200"
        />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button type="submit" @click="submitForm()" :loading="submitLoading" />
    </div>
  </el-dialog>
</template>

<script>
import { modal } from "@/mixins/modal";
import { createUnion, updateUnion } from "@/api/union";

const rules = {
  movie_id: [{ required: true, message: "请选择关联影视", trigger: "change" }],
  brief: [
    {
      max: 200,
      message: "不能超过 200 个字符",
      trigger: "blur",
    },
  ],
};

export default {
  name: "RoleMovieModal",

  mixins: [modal],

  data() {
    return {
      rules,
      form: {
        id: null,
        role_id: null,
        movie_id: null,
        actor_id: null,
        movie: null,
        actor: null,
        avatar: "",
        brief: "",
      },
      movieOptions: [],
      actorOptions: [],
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.form.role_id = this.id;

        // 编辑时回显影视
        if (this.form.movie_id) {
          this.movieOptions = [this.form.movie];
        } else {
          this.movieOptions = [];
        }

        // 编辑时回显影人
        if (this.form.actor_id) {
          this.actorOptions = [this.form.actor];
        } else {
          this.actorOptions = [];
        }
      }
    },
  },

  methods: {
    async submit() {
      return this.isEdit
        ? await updateUnion(this.form.id, this.form)
        : await createUnion(this.form);
    },
  },
};
</script>


<style scoped lang="scss">
.modal-container {
  padding: 10px 30px 0;
}
</style>