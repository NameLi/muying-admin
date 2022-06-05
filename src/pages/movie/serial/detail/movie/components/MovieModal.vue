<template>
  <el-dialog
    :title="isEdit ? '编辑' : '新建'"
    width="600px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form
      class="modal-container"
      label-width="100px"
      ref="form"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="影视名称：" prop="movie_id">
        <remote-select
          :disabled="isEdit"
          type="movie"
          v-model="form.movie_id"
          :options="options"
        />
      </el-form-item>

      <el-form-item label="关联备注" prop="mark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
          v-model="form.mark"
          placeholder="关联备注"
          show-word-limit
          maxlength="100"
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
import { createSerialMovie, updateSerialMovie } from "@/api/serial";

const rules = {
  movie_id: [{ required: true, message: "请选择关联影视", trigger: "change" }],
  mark: [
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
        movie_id: null,
        mark: "",
      },
      options: [],
    };
  },

  methods: {
    open(row) {
      if (row) {
        this.isEdit = true;
        this.form = {
          id: row.id,
          movie_id: row.movie.id,
          mark: row.mark,
        };

        this.options = [row.movie];
      }
      this.visible = true;
    },

    async submit() {
      return this.isEdit
        ? await updateSerialMovie(this.id, this.form.id, this.form)
        : await createSerialMovie(this.id, this.form);
    },
  },
};
</script>


<style scoped lang="scss">
.modal-container {
  padding: 10px 30px 0;
}
</style>