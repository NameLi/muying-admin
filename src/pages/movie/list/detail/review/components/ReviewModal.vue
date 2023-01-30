<template>
  <el-dialog
    :title="isEdit ? '编辑影评' : '新增影评'"
    width="740px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close()"
  >
    <el-form
      class="modal-container"
      :model="form"
      :rules="rules"
      ref="form"
      v-loading="loading"
    >
      <el-form-item prop="title">
        <el-input
          v-model="form.title"
          maxlength="64"
          show-word-limit
          placeholder="影评标题"
        />
      </el-form-item>

      <el-form-item label="是否剧透：">
        <el-radio-group v-model="form.is_spoiler">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否原创：">
        <el-radio-group v-model="form.is_original">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="版权信息：">
        <el-radio-group v-model="form.copyright">
          <el-radio :label="0">无</el-radio>
          <el-radio :label="1">禁止商业转载</el-radio>
          <el-radio :label="2">禁止所有转载</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <wang-editor class="wang-editor" category="movie" ref="editor" v-model="form.content" />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button type="submit" @click="submitForm()" :loading="submitLoading" />
    </div>
  </el-dialog>
</template>

<script>
import { getReview, createReview, updateReview } from "@/api/review";
import { modal } from "@/mixins/modal";
import WangEditor from "@/components/Plug/Editor";

const rules = {
  title: [
    { required: true, message: "请填写标题", trigger: "blur" },
    { min: 2, max: 64, message: "长度在 2 到 64 个字符", trigger: "blur" },
  ],
};

export default {
  name: "ReviewModal",

  components: {
    WangEditor,
  },

  mixins: [modal],

  data() {
    return {
      loading: false,
      rules,
      form: {
        id: null,
        title: "",
        is_spoiler: 0,
        is_original: 0,
        copyright: 0,
        content: "",
      },
    };
  },

  watch: {
    visible(val) {
      if (val && this.isEdit) {
        this.getReview();
      }
    },
  },

  methods: {
    async getReview() {
      this.loading = true;
      const { code, data } = await getReview(this.form.id);
      this.loading = false;

      if (code === 200) {
        this.form = data;
      }
    },

    async submit() {
      this.$refs.editor.getContent();

      return this.isEdit
        ? await updateReview(this.form.id, this.form)
        : await createReview(this.id, this.form);
    },
  },
};
</script>

<style scoped lang="scss">
.modal-container {
  padding: 10px 30px 0;
  .wang-editor ::v-deep .w-e-text {
    min-height: 70vh;
  }
}
</style>