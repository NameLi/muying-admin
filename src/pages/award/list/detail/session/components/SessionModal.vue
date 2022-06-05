<template>
  <el-dialog
    :title="isEdit ? '更新奖项' : '添加奖项'"
    :visible.sync="visible"
    width="600px"
    :append-to-body="appendToBody"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form
      style="padding: 10px 30px 0"
      label-width="120px"
      :model="form"
      :rules="rules"
      ref="form"
      v-loading="loading"
    >
      <el-form-item label="奖项封面：" prop="poster">
        <image-upload
          :url.sync="form.poster"
          :id="form.id"
          category="award"
          type="poster"
        />
        <el-input style="display: none" v-model="form.poster" />
      </el-form-item>

      <el-form-item label="奖项届：" prop="session">
        <el-input v-model.number="form.session" placeholder="请填写奖项届" />
      </el-form-item>

      <el-form-item label="奖项年份：" prop="year">
        <el-input v-model.number="form.year" placeholder="请填写颁奖年份" />
      </el-form-item>

      <el-form-item label="颁奖日期：" prop="award_date">
        <el-date-picker
          style="width: 100%"
          type="date"
          v-model="form.award_date"
          placeholder="请选择颁奖日期"
        />
      </el-form-item>

      <el-form-item label="颁奖地址：" prop="award_place">
        <el-input v-model="form.award_place" placeholder="请填写颁奖地址" />
      </el-form-item>

      <el-form-item label="奖项简介：" prop="brief">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 10 }"
          v-model="form.brief"
          show-word-limit
          maxlength="500"
          placeholder="奖项简介"
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
import { createAwardSession, updateAwardSession } from "@/api/award";
import { modal } from "@/mixins/modal";

export default {
  name: "SessionModal",

  mixins: [modal],

  data() {
    return {
      rules: {
        year: [{ required: true, message: "请填写奖年份", trigger: "blur" }],
        session: [{ required: true, message: "请填写奖项届", trigger: "blur" }],
        award_place: [
          { max: 64, message: "长度不能超过 64 个字符", trigger: "blur" },
        ],
        brief: [
          {
            max: 500,
            message: "长度不能超过 500 个字符",
            trigger: "blur",
          },
        ],
      },
      form: {
        id: null,
        poster: "",
        session: null,
        award_date: null,
        award_place: "",
        year: null,
        brief: "",
      },
    };
  },

  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    async submit() {
      return this.isEdit
        ? await updateAwardSession(this.id, this.form.id, this.form)
        : await createAwardSession(this.id, this.form);
    },
  },
};
</script>