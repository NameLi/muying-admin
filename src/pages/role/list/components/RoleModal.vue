<template>
  <el-dialog
    title="添加角色"
    width="520px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :append-to-body="appendToBody"
    @close="close()"
  >
    <el-form
      class="form"
      label-width="110px"
      :model="form"
      :rules="rules"
      ref="form"
    >
      <el-form-item label="中文名称：" prop="name">
        <el-input v-model="form.name" placeholder="请填写角色名称" />
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
import { createRole } from "@/api/role";

export default {
  name: "RoleModal",

  mixins: [modal],

  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      rules: {
        name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 1,
            max: 16,
            message: "长度在 1 到 32 个字符",
            trigger: "blur",
          },
        ],
      },
      form: {
        name: "",
      },
    };
  },

  methods: {
    async submit() {
      this.submitLoading = true;
      const { code, data } = await createRole(this.form);
      this.submitLoading = false;

      if (code === 200) {
        this.$emit("on-success");
        this.visible = false;

        this.$router.push({ name: "RoleDetailInfo", params: { id: data.id } });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.modal-container {
  padding: 10px 30px 0;
  .form {
    user-select: none;
    padding: 20px 40px 10px 16px;
  }
}
</style>