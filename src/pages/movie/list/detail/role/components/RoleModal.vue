<template>
  <el-dialog
    title="角色"
    width="800px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form
      style="padding: 10px 30px 0"
      label-width="120px"
      ref="form"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="角色：" prop="role_id">
        <remote-select
          type="role"
          v-model="form.role_id"
          :disabled="isEdit"
          :options="roleOptions"
          placeholder="请输入角色名称进行搜索"
        />
      </el-form-item>

      <el-form-item label="饰演者：">
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
        <el-input style="display: none" v-model="form.avatar" />
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
  role_id: [{ required: true, message: "请选择角色", trigger: "change" }],
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
        role: null,
        actor: null,
        avatar: "",
        brief: "",
      },
      roleOptions: [],
      actorOptions: [],
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.form.movie_id = this.id;

        // 编辑复现角色信息
        if (this.form.role_id) {
          this.roleOptions = [this.form.role];
        } else {
          this.roleOptions = [];
        }

        // 编辑复现影人信息
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