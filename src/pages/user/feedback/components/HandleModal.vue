<template>
  <el-dialog
    title="反馈处理"
    width="520px"
    :visible.sync="visible"
    @close="close()"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="110px"
      style="user-select: none"
    >
      <el-form-item label="处理方式：" prop="result">
        <el-radio-group v-model="form.result">
          <el-radio :label="1">采纳</el-radio>
          <el-radio :label="-1">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="处理说明：" prop="mark">
        <el-input
          v-model="form.mark"
          type="textarea"
          maxlength="100"
          show-word-limit
          placeholder="请输入处理说明"
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
import { handleFeedback } from "@/api/user";

export default {
  name: "HandleModal",

  mixins: [modal],

  data() {
    return {
      rules: {
        result: [
          { required: true, message: "请选择处理方式", trigger: "change" },
        ],
        mark: [
          {
            max: 100,
            message: "处理说明文字不能超过100个字符",
            trigger: "blur",
          },
        ],
      },
      id: null,
      form: {
        result: null,
        mark: "",
      },
    };
  },

  methods: {
    open(row) {
      this.id = row.id;
      this.visible = true;
    },

    async submit() {
      this.submitLoading = true;
      const { code } = await handleFeedback(this.id, this.form);
      this.submitLoading = false;

      if (code === 200) {
        this.$emit("on-success");
        this.visible = false;
      }
    },
  },
};
</script>