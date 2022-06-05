<template>
  <el-dialog
    :title="isEdit ? '编辑经典台词' : '添加经典台词'"
    :visible.sync="visible"
    width="600px"
    :close-on-click-modal="false"
    @close="close()"
  >
    <el-form
      class="modal-container"
      label-position="top"
      :model="form"
      :rules="rules"
      ref="form"
    >
      <el-form-item prop="content">
        <el-input
          ref="textarea"
          type="textarea"
          :autosize="{ minRows: 15, maxRows: 20 }"
          v-model="form.content"
          placeholder="台词内容"
          maxlength="2000"
          show-word-limit
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
import { createMovieDialogue, updateMovieDialogue } from "@/api/movie";
import { modal } from "@/mixins/modal";

export default {
  name: "DialogueModal",

  mixins: [modal],

  data() {
    return {
      rules: {
        content: [
          { required: true, message: "请输入台词内容", trigger: "blur" },
          {
            min: 2,
            max: 2000,
            message: "长度在 2 到 2000 个字符",
            trigger: "blur",
          },
        ],
      },
      form: {
        id: null,
        content: "",
      },
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.textarea.focus();
        });
      }
    },
  },

  methods: {
    async submit() {
      return this.isEdit
        ? await updateMovieDialogue(this.id, this.form.id, this.form)
        : await createMovieDialogue(this.id, this.form);
    },
  },
};
</script>