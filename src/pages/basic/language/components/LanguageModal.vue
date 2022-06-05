<template>
  <el-dialog
    :title="isEdit ? '编辑语言' : '新建语言'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="600px"
    @close="close"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="110px"
      style="padding: 0 20px"
    >
      <el-form-item label="中文简称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入语言简称" />
      </el-form-item>

      <el-form-item label="中文全称：" prop="fullname">
        <el-input v-model="form.fullname" placeholder="请输入语言全称" />
      </el-form-item>

      <el-form-item label="所属国家：">
        <remote-select
          v-model="form.country_id"
          :options="country"
          type="country"
          placeholder="语言所属国家/地区"
        />
      </el-form-item>

      <el-form-item label="英文简称：" prop="name_en">
        <el-input v-model="form.name_en" placeholder="请输入语言英文简称" />
      </el-form-item>

      <el-form-item label="英文全称：" prop="fullname_en">
        <el-input v-model="form.fullname_en" placeholder="请输入语言英文全称" />
      </el-form-item>

      <el-form-item label="原名简称：" prop="original_name">
        <el-input
          v-model="form.original_name"
          placeholder="请输入语言原名简称"
        />
      </el-form-item>

      <el-form-item label="原名全称：" prop="original_fullname">
        <el-input
          v-model="form.original_fullname"
          placeholder="请输入语言原名全称"
        />
      </el-form-item>

      <el-form-item label="简介：" prop="brief">
        <el-input
          type="textarea"
          v-model="form.brief"
          :autosize="{ minRows: 2, maxRows: 5 }"
          maxlength="200"
          show-word-limit
          placeholder="语言简介"
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
import { createLanguage, updateLanguage } from "@/api/basic";
import { modal } from "@/mixins/modal";

export default {
  name: "LanguageModal",

  mixins: [modal],

  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            message: "请输入语言中文简称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符",
            trigger: "blur",
          },
        ],
        fullname: [
          {
            min: 2,
            max: 32,
            message: "长度在 2 到 32 个字符",
            trigger: "blur",
          },
        ],
        name_en: [
          {
            min: 2,
            max: 32,
            message: "长度在 2 到 32 个字符",
            trigger: "blur",
          },
        ],
        fullname_en: [
          {
            min: 2,
            max: 32,
            message: "长度在 2 到 64 个字符",
            trigger: "blur",
          },
        ],
        original_name: [
          {
            min: 2,
            max: 32,
            message: "长度在 2 到 32 个字符",
            trigger: "blur",
          },
        ],
        original_fullname: [
          {
            min: 2,
            max: 64,
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
        name: "",
        country_id: null,
        fullname: "",
        name_en: "",
        fullname_en: "",
        original_name: "",
        original_fullname: "",
        brief: "",
      },
      country: [],
    };
  },

  methods: {
    open(row) {
      if (row) {
        this.isEdit = true;
        this.form = Object.assign(this.form, row);
        if(this.form.country) {
          this.country = [this.form.country];
        }
      }
      this.visible = true;
    },

    async submit() {
      return this.isEdit
        ? await updateLanguage(this.form.id, this.form)
        : await createLanguage(this.form);
    },
  },
};
</script>