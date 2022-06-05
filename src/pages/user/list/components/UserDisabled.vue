<template>
  <el-dialog
    title="用户禁用"
    width="590px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close()"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      style="padding: 38px 40px 20px"
    >
      <el-form-item label="禁用时长：" prop="disabled_day">
        <el-radio-group v-model="form.disabled_day">
          <el-radio :label="1">1天</el-radio>
          <el-radio :label="7">7天</el-radio>
          <el-radio :label="30">30天</el-radio>
          <el-radio :label="365">365天</el-radio>
          <el-radio :label="9999">永久</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="禁用原因：" prop="reason">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
          v-model="form.reason"
          show-word-limit
          maxlength="100"
          placeholder="请填写禁用原因"
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
import { updateUserSet } from "@/api/user";
import { modal } from "@/mixins/modal";

export default {
  name: "UserDisabled",

  mixins: [modal],

  data() {
    return {
      rules: {
        disabled_day: [
          { required: true, message: "请选择禁用时长", trigger: "change" },
        ],
        reason: [
          { required: true, message: "请填写禁用原因", trigger: "change" },
        ],
      },
      form: {
        id: null,
        disabled_day: null,
      },
    };
  },

  methods: {
    async submit() {
      return await updateUserSet(this.form.id, this.form);
    },
  },
};
</script>