<template>
  <el-dialog
    :title="isEdit ? '编辑公司' : '新建公司'"
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
      <el-form-item label="中文简称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入中文简称" />
      </el-form-item>

      <el-form-item label="公司封面：">
        <image-upload
          :url.sync="form.logo"
          :id="form.id"
          category="image"
          type="company"
        />
        <el-input style="display: none" v-model="form.logo" />
      </el-form-item>

      <el-form-item label="中文全称：" prop="fullname">
        <el-input v-model="form.fullname" placeholder="请输入中文全称" />
      </el-form-item>

      <el-form-item label="英文简称：" prop="name_en">
        <el-input v-model="form.name_en" placeholder="请输入英文简称" />
      </el-form-item>

      <el-form-item label="英文全称：" prop="fullname_en">
        <el-input v-model="form.fullname_en" placeholder="请输入英文全称" />
      </el-form-item>

      <el-form-item label="隶属公司：" prop="company_id">
        <remote-select
          v-model="form.company_id"
          :options="company"
          type="company"
          placeholder="请选择隶属公司"
        />
      </el-form-item>

      <el-form-item label="国家：" prop="country_id">
        <remote-select
          v-model="form.country_id"
          :options="country"
          type="country"
          placeholder="公司所属国家"
        />
      </el-form-item>

      <el-form-item label="成立日期：" prop="begin_date">
        <el-date-picker
          style="width: 100%"
          v-model="form.begin_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择成立日期"
        />
      </el-form-item>

      <el-form-item label="消失日期：" prop="end_date">
        <el-date-picker
          style="width: 100%"
          v-model="form.end_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择消失日期"
        />
      </el-form-item>

      <el-form-item label="简介：" prop="brief">
        <el-input
          type="textarea"
          v-model="form.brief"
          :autosize="{ minRows: 2, maxRows: 5 }"
          maxlength="200"
          placeholder="公司简介"
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
import { createCompany, updateCompany } from "@/api/basic";
import { modal } from "@/mixins/modal";

export default {
  name: "CompanyModal",
  mixins: [modal],
  data() {
    return {
      rules: {
        name: [
          { required: true, message: "请输入中文简称", trigger: "blur" },
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
        id: null,
        logo: "",
        name: "",
        fullname: "",
        name_en: "",
        fullname_en: "",
        company_id: null,
        country_id: null,
        begin_date: null,
        end_date: null,
        brief: "",
      },
      company: [],
      country: [],
    };
  },

  methods: {
    open(row) {
      if (row) {
        this.isEdit = true;
        this.form = Object.assign(this.form, row);

        if (row.company_id) {
          this.company = [row.company];
        }

        if (row.country_id) {
          this.country = [row.country];
        }
      }
      this.visible = true;
    },

    async submit() {
      return this.isEdit
        ? await updateCompany(this.form.id, this.form)
        : await createCompany(this.form);
    },
  },
};
</script>