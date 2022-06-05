<template>
  <el-dialog
    :title="isEdit ? '编辑职务' : '新建职务'"
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
      <el-form-item label="中文名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入职务名称" />
      </el-form-item>

      <el-form-item label="英文简称：" prop="name_en">
        <el-input v-model="form.name_en" placeholder="请输入职务英文名称" />
      </el-form-item>

      <el-form-item label="父级职务" prop="pid">
        <m-select
          v-model="form.pid"
          style="width: 100%"
          filterable
          placeholder="请选择父级职务"
          :options="professionList"
        />
      </el-form-item>

      <el-form-item label="类型状态：" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">展示</el-radio>
          <el-radio :label="1">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="简介：" prop="brief">
        <el-input
          type="textarea"
          v-model="form.brief"
          :autosize="{ minRows: 2, maxRows: 5 }"
          maxlength="200"
          show-word-limit
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
import { createProfession, updateProfession } from "@/api/basic";
import { modal } from "@/mixins/modal";

export default {
  name: "ProfessionModal",

  mixins: [modal],

  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            message: "请输入职务中文名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符",
            trigger: "blur",
          },
        ],
        name_en: [
          {
            required: true,
            message: "请输入职务英文名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 32,
            message: "长度在 2 到 32 个字符",
            trigger: "blur",
          },
        ],
        pid: [
          {
            required: true,
            type: "number",
            message: "请选择父级职务",
            trigger: "change",
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
        name_en: "",
        pid: null,
        status: null,
        brief: "",
      },

      professionList: [],
    };
  },

  methods: {
    // 设置 职务父级
    data(list) {
      let professionList = [
        {
          value: 0,
          label: "根目录",
        },
      ];

      for (let item of list) {
        let row = {
          value: item.id,
          label: item.name + " (" + item.name_en + ")",
        };
        professionList.push(row);
      }

      this.professionList = professionList;
    },

    async submit() {
      return this.isEdit
        ? await updateProfession(this.form.id, this.form)
        : await createProfession(this.form);
    },
  },
};
</script>