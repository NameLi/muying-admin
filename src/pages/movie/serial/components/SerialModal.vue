<template>
  <el-dialog
    :title="isEdit ? '编辑系列' : '新建系列'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="600px"
    @close="close()"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="110px"
      style="padding: 0 20px"
    >
      <el-form-item label="系列名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入系列名称" />
      </el-form-item>

      <el-form-item label="系列封面：">
        <image-upload
          category="image"
          type="serial"
          :id="form.id"
          :url.sync="form.poster"
        />
        <el-input v-model="form.poster" style="display: none" />
      </el-form-item>

      <el-form-item label="英文名称：" prop="name_en">
        <el-input v-model="form.name_en" placeholder="请输入系列英文名" />
      </el-form-item>

      <el-form-item label="简介：" prop="brief">
        <el-input
          type="textarea"
          v-model="form.brief"
          :autosize="{ minRows: 3, maxRows: 5 }"
          maxlength="200"
          show-word-limit
          placeholder="系列简介（选填）"
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
import { createSerial, updateSerial } from "@/api/serial";
import { modal } from "@/mixins/modal";

export default {
  name: "SerialModal",
  mixins: [modal],
  data() {
    return {
      rules: {
        name: [
          { required: true, message: "请输入系列中文名称", trigger: "blur" },
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 32 个字符",
            trigger: "blur",
          },
        ],
        name_en: [
          {
            min: 2,
            max: 32,
            message: "长度在 2 到 64 个字符",
            trigger: "blur",
          },
        ],
        brief: [
          {
            min: 0,
            max: 200,
            message: "长度在 0 到 200 个字符",
            trigger: "blur",
          },
        ],
      },
      form: {
        id: null,
        poster: "",
        name: "",
        name_en: "",
        brief: "",
      },
    };
  },

  methods: {
    async submit() {
      return this.isEdit
        ? await updateSerial(this.form.id, this.form)
        : await createSerial(this.form);
    },
  },
};
</script>