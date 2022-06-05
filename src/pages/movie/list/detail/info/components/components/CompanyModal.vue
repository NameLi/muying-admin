<template>
  <el-dialog
    :title="isEdit ? '编辑公司' : '添加公司'"
    :visible.sync="visible"
    width="600px"
    :close-on-click-modal="false"
    @close="close()"
  >
    <el-form
      style="padding: 20px 40px"
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
    >
      <el-form-item label="公司名称：" prop="company_id">
        <remote-select
          type="company"
          v-model="form.company_id"
          :options="company"
        />
      </el-form-item>

      <el-form-item label="公司类型：" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio
            v-for="type in typeList"
            :label="type.value"
            :key="type.value"
            style="margin-top: 10px; margin-bottom: 10px; min-width: 100px"
            >{{ type.label }}</el-radio
          >
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
import { createMovieCompany, updateMovieCompany } from "@/api/movie";
import { modal } from "@/mixins/modal";

export default {
  name: "CompanyModal",

  mixins: [modal],

  props: {
    typeList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      rules: {
        company_id: [
          { required: true, message: "请选择公司名称", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择公司类型", trigger: "change" },
        ],
      },
      form: {
        id: null,
        company_id: null,
        type: null,
      },
      company: [],
    };
  },

  methods: {
    open(row) {
      if (row) {
        this.form = Object.assign({}, row);
        this.isEdit = true;

        this.form.type = row.type.id;
        // 公司回显
        if (row.company) {
          this.company = [row.company];
        }
      }
      this.visible = true;
    },

    async submit() {
      return this.isEdit
        ? await updateMovieCompany(this.id, this.form.id, this.form)
        : await createMovieCompany(this.id, this.form);
    },
  },
};
</script>