<template>
  <el-dialog
    title="修改密码"
    width="480px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="content">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="旧密码：" prop="old_password">
          <el-input
            type="password"
            autofocus
            v-model="form.old_password"
            show-password
            :maxlength="16"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item label="新密码：" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            show-password
            :maxlength="16"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button
        type="submit"
        @click="submitForm('form')"
        :loading="submitLoading"
      />
    </div>
  </el-dialog>
</template>

<script>
import { updateAdminPassword } from "@/api/admin";
import { modal } from "@/mixins/modal";

export default {
  name: "Password",
  mixins: [modal],

  data() {
    return {
      rules: {
        old_password: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            pattern:
              /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,16}$/,
            message: "密码必须包含大小写字母和特殊字符，长度为 8 - 16位",
            trigger: "blur",
          },
        ],
      },

      form: {
        old_password: "",
        password: "",
      },
    };
  },

  methods: {
    // 更新密码
    async submit() {
      let params = {
        old_password: this.form.old_password,
        password: this.form.password,
      };

      let res = await updateAdminPassword(params);

      if (res.code === 200) {
        this.$emit("on-success");
        this.visible = false;

        localStorage.clear();
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  padding: 0 50px 0 30px;
}
</style>