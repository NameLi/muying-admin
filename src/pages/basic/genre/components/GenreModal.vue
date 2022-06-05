<template>
  <el-dialog
    :title="isEdit ? '编辑类型' : '新建类型'"
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
      <el-form-item label="分类名称：" prop="category">
        <el-input v-model="form.category" disabled placeholder="选择分类名称" />
      </el-form-item>

      <el-form-item label="中文名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入中文名称" />
      </el-form-item>

      <el-form-item label="英文名称：" prop="name_en">
        <el-input v-model="form.name_en" placeholder="请输入英文名称" />
      </el-form-item>

      <el-form-item label="类型状态：" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">展示</el-radio>
          <el-radio :label="1">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button type="submit" @click="submitForm()" :loading="submitLoading" />
    </div>
  </el-dialog>
</template>

<script>
import { createGenre, updateGenre } from "@/api/basic";
import { modal } from "@/mixins/modal";

export default {
  name: "GenreModal",

  mixins: [modal],

  props: {
    category: {
      type: String,
    },
  },

  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            message: "请输入类型中文名称",
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
            min: 2,
            max: 32,
            message: "长度在 2 到 32 个字符",
            trigger: "blur",
          },
        ],
      },
      form: {
        category: "",
        name: "",
        name_en: "",
        status: null,
      },
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.form.category = this.category;
      }
    },
  },

  methods: {
    async submit() {
      return this.isEdit
        ? await updateGenre(this.form.id, this.form)
        : await createGenre(this.form);
    },
  },
};
</script>