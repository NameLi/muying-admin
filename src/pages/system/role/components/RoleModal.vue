<template>
  <el-dialog
    :title="isEdit ? '编辑角色' : '新建角色'"
    :visible.sync="visible"
    width="560px"
    @close="close()"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
      style="padding: 0 20px"
    >
      <el-form-item label="角色名称：" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入角色名称，限制2~10字符"
        />
      </el-form-item>

      <el-form-item label="排序：" prop="sort">
        <el-input
          type="number"
          v-model.number="form.sort"
          placeholder="默认值为0，最大值为255"
        />
      </el-form-item>

      <el-form-item label="备注：" prop="brief">
        <el-input
          type="textarea"
          v-model="form.brief"
          :autosize="{ minRows: 3, maxRows: 5 }"
          maxlength="200"
          show-word-limit
          placeholder="角色备注"
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
import { createRole, updateRole } from "@/api/system";
import { modal } from "@/mixins/modal";

export default {
  name: "RoleModal",

  mixins: [modal],

  data() {
    const validateSort = (rule, value, callback) => {
      if (value) {
        if (!Number.isInteger(value)) {
          callback(new Error("排序号只能为整数"));
        } else if (value < 0 || value > 255) {
          callback(new Error("排序号只能在 0~255 字符"));
        }
      }
      callback();
    };

    return {
      rules: {
        name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        sort: [
          {
            type: "number",
            message: "取值范围为 0~255，数值越小排序越靠前",
            trigger: "blur",
          },
          { validator: validateSort, trigger: "blur" },
        ],
        brief: [
          {
            max: 200,
            message: "长度不能超过 200 个字符",
            trigger: "blur",
          },
        ],
      },

      form: {
        id: null,
        name: "",
        sort: null,
        brief: "",
      },
    };
  },
  methods: {
    async submit() {
      return this.isEdit
        ? await updateRole(this.form.id, this.form)
        : await createRole(this.form);
    },
  },
};
</script>