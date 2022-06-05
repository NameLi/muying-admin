<template>
  <el-dialog
    :title="isEdit ? '编辑人员' : '新建人员'"
    :visible.sync="visible"
    width="640px"
    @close="close"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="110px"
      style="padding: 0 20px"
    >
      <el-form-item label="管理员名称：" prop="nickname">
        <el-input
          v-model="form.nickname"
          placeholder="请输入管理员名称，限制1~16字符"
        />
      </el-form-item>

      <el-form-item label="管理员账号：" prop="account">
        <el-input
          v-model="form.account"
          :disabled="isEdit"
          placeholder="请输入管理员账号，限制5~16字符"
        />
      </el-form-item>

      <el-form-item label="选择角色：" prop="role_ids">
        <el-select
          v-model="form.role_ids"
          multiple
          placeholder="请选择角色"
          style="width: 100%"
        >
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="有效期至：" prop="deadline_at">
        <el-date-picker
          v-model="form.deadline_at"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 100%"
          placeholder="选择有效期至"
        />
      </el-form-item>

      <el-form-item label="是否禁用：" prop="status">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>

      <el-form-item label="角色描述：" prop="brief">
        <el-input
          type="textarea"
          v-model="form.brief"
          :autosize="{ minRows: 3, maxRows: 5 }"
          maxlength="100"
          show-word-limit
          placeholder="请填写角色描述"
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
import { getRoles, createAdmin, updateAdmin } from "@/api/system";
import { modal } from "@/mixins/modal";

export default {
  name: "AdminModal",

  mixins: [modal],

  data() {
    return {
      rules: {
        nickname: [
          { required: true, message: "请输入管理员名称", trigger: "blur" },
          {
            min: 1,
            max: 16,
            message: "长度在 1 到 16 个字符",
            trigger: "blur",
          },
        ],
        account: [
          { required: true, message: "请输入管理员账号", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
        role_ids: [{ required: true, message: "请选择角色", trigger: "blur" }],
        deadline_at: [
          { required: true, message: "请选择账号有效期", trigger: "change" },
        ],
        brief: [{ max: 100, message: "不能超过 100 个字符", trigger: "blur" }],
      },

      loading: false,
      roles: [],
      submitLoading: false,
      form: {
        id: null,
        nickname: "",
        account: "",
        deadline_at: null,
        status: 0,
        role_ids: [],
        brief: "",
      },
    };
  },

  watch: {
    visible(val) {
      val && this.getRoles();
    },
  },

  methods: {
    // 获取角色列表
    async getRoles() {
      this.loading = true;
      const { code, data } = await getRoles();
      this.loading = false;

      if (code === 200) {
        this.roles = data;
      }
    },

    // 保存
    async submit() {
      return this.isEdit
        ? await updateAdmin(this.form.id, this.form)
        : await createAdmin(this.form);
    },
  },
};
</script>