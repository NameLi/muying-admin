<template>
  <el-dialog
    :title="isEdit ? '编辑家长引导' : '新建家长引导'"
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
      <el-form-item label="国家/地区：" prop="country_id">
        <remote-select
          v-model="form.country_id"
          :options="country"
          type="country"
          placeholder="请选择国家"
        />
      </el-form-item>

      <el-form-item label="家长引导：" prop="level">
        <el-input v-model="form.level" placeholder="请输入家长引导等级" />
      </el-form-item>

      <el-form-item label="引导中文：" prop="level_zh">
        <el-input
          v-model="form.level_zh"
          placeholder="请输入家长引导中文等级"
        />
      </el-form-item>

      <el-form-item label="类型状态：" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">展示</el-radio>
          <el-radio :label="1">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="引导模板：" prop="descript">
        <el-input
          type="textarea"
          v-model="form.descript"
          :autosize="{ minRows: 4, maxRows: 8 }"
          maxlength="100"
          show-word-limit
          placeholder="例：本片在${country}的评级为【${level}】，适合任何年龄观看。"
        />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitForm()"
        >保 存</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { createLevel, updateLevel } from "@/api/basic";
import { modal } from "@/mixins/modal";

export default {
  name: "LevelModal",

  mixins: [modal],

  data() {
    return {
      rules: {
        level: [
          {
            required: true,
            message: "请输入家长引导等级",
            trigger: "blur",
          },
          {
            min: 1,
            max: 16,
            message: "长度在 1 到 16 个字符",
            trigger: "blur",
          },
        ],
        level: [
          {
            max: 32,
            message: "长度不能超过 32 个字符",
            trigger: "blur",
          },
        ],
        country_id: [
          {
            required: true,
            message: "请选择国家",
            trigger: "change",
          },
        ],
        descript: [
          {
            required: true,
            trigger: "blur",
          },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
      },
      form: {
        id: null,
        country_id: null,
        level: "",
        level_zh: "",
        status: null,
        descript: "本片在${country}的评级为【${level}】，适合任何年龄观看。",
      },
      country: [],
    };
  },

  methods: {
    open(row) {
      if (row) {
        this.isEdit = true;
        this.form = Object.assign(this.form, row);
        this.country = [row.country];
      }
      this.visible = true;
    },

    async submit() {
      return this.isEdit
        ? await updateLevel(this.form.id, this.form)
        : await createLevel(this.form);
    },
  },
};
</script>