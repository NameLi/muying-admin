<template>
  <el-dialog
    :title="isEdit ? '编辑国家/地区' : '新建国家/地区'"
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
        <el-input v-model="form.name" placeholder="请输入国家/地区简称" />
      </el-form-item>

      <el-form-item label="编码：" prop="code">
        <el-input v-model="form.code" placeholder="请输入国家/地区编码" />
      </el-form-item>

      <el-form-item label="类型：" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="0">国家</el-radio>
          <el-radio :label="1">地区</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="国旗/区旗：" prop="flag">
        <image-upload
          height="80px"
          category="image"
          type="flag"
          :id="form.id"
          :url.sync="form.flag"
        />
        <el-input style="display: none" v-model="form.flag" />
      </el-form-item>

      <el-form-item label="中文全称：" prop="fullname">
        <el-input v-model="form.fullname" placeholder="请输入国家/地区全称" />
      </el-form-item>

      <el-form-item label="所属大洲：" prop="continent">
        <m-select
          v-model="form.continent"
          :options="continents"
          size="small"
          style="width: 100%"
          placeholder="请选择所属大洲"
        />
      </el-form-item>

      <el-form-item label="英文简称：" prop="name_en">
        <el-input
          v-model="form.name_en"
          placeholder="请输入国家/地区英文简称"
        />
      </el-form-item>

      <el-form-item label="英文全称：" prop="fullname_en">
        <el-input
          v-model="form.fullname_en"
          placeholder="请输入国家/地区英文全称"
        />
      </el-form-item>

      <el-form-item label="原名简称：" prop="original_name">
        <el-input
          v-model="form.original_name"
          placeholder="请输入国家/地区原名简称"
        />
      </el-form-item>

      <el-form-item label="原名全称：" prop="original_fullname">
        <el-input
          v-model="form.original_fullname"
          placeholder="请输入国家/地区原名全称"
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
          :autosize="{ minRows: 4, maxRows: 8 }"
          maxlength="600"
          show-word-limit
          placeholder="国家/地区简介"
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
import { createCountry, updateCountry } from "@/api/basic";
import { modal } from "@/mixins/modal";

export default {
  name: "CountryModal",

  mixins: [modal],

  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            message: "请输入国家/地区中文简称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符",
            trigger: "blur",
          },
        ],
        code: [
          {
            max: 2,
            message: "编码长度为 2 个字符",
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
            max: 600,
            message: "长度在 0 到 600 个字符",
            trigger: "blur",
          },
        ],
      },
      form: {
        id: null,
        name: "",
        code: "",
        type: 0,
        continent: "",
        fullname: "",
        name_en: "",
        fullname_en: "",
        original_name: "",
        original_fullname: "",
        flag: "",
        begin_date: null,
        end_date: null,
        brief: "",
      },

      continents: [
        { label: "亚洲", value: "亚洲" },
        { label: "欧洲", value: "欧洲" },
        { label: "南美洲", value: "南美洲" },
        { label: "北美洲", value: "北美洲" },
        { label: "大洋洲", value: "大洋洲" },
        { label: "非洲", value: "非洲" },
      ],
    };
  },

  methods: {
    async submit() {
      return this.isEdit
        ? await updateCountry(this.form.id, this.form)
        : await createCountry(this.form);
    },
  },
};
</script>