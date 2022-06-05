<template>
  <el-dialog
    :title="isEdit ? '编辑上映日期' : '添加上映日期'"
    :visible.sync="visible"
    width="600px"
    :close-on-click-modal="false"
    @close="close()"
  >
    <el-form
      class="modal-container"
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
    >
      <el-form-item label="上映日期：" prop="pubdate">
        <el-date-picker
          style="width: 100%"
          v-model="form.pubdate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择上映日期"
        />
      </el-form-item>

      <el-form-item label="国家/地区：" prop="country_id">
        <el-input v-model="form.country" placeholder="上映国家/地区/其它" />
      </el-form-item>

      <el-form-item label="是否首映：">
        <el-radio-group v-model="form.is_premiere">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="备注：" prop="remark">
        <el-input v-model="form.remark" placeholder="备注信息" />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button type="submit" @click="submitForm()" :loading="submitLoading" />
    </div>
  </el-dialog>
</template>

<script>
import { createMoviePubdate, updateMoviePubdate } from "@/api/movie";
import { modal } from "@/mixins/modal";

export default {
  name: "PubdateModal",

  mixins: [modal],

  inject: ["id"],

  data() {
    return {
      rules: {
        country_id: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
        pubdate: [{ required: true, message: "请输入内容", trigger: "blur" }],
        remark: [
          {
            max: 100,
            message: "长度不能超过 100 个字符",
            trigger: "blur",
          },
        ],
      },
      form: {
        id: null,
        pubdate: null,
        country_id: null,
        is_premiere: 0,
        remark: "",
      },
      country: [],
    };
  },

  methods: {
    open(row) {
      if (row) {
        this.isEdit = true;
        this.form = Object.assign(this.form, row);
        // 国家/地区回显
        this.country = row.country ? [row.country] : [];
      }
      this.visible = true;
    },

    async submit() {
      return this.isEdit
        ? await updateMoviePubdate(this.id, this.form.id, this.form)
        : await createMoviePubdate(this.id, this.form);
    },
  },
};
</script>