<template>
  <el-dialog
    title="奖项类型"
    width="600px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    @close="close"
  >
    <div class="type-container">
      <el-form label-width="100px" :model="form" :rules="rules" ref="form">
        <el-form-item label="类型名称：" prop="type">
          <el-input v-model="form.type" placeholder="请填写类型名称" />
        </el-form-item>

        <el-form-item label="类型英文名：" prop="type_en">
          <el-input v-model="form.type_en" placeholder="请填写类型英文名：" />
        </el-form-item>

        <el-form-item label="颁奖给影人：">
          <el-radio-group v-model="form.is_actor">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="类型简介：">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            v-model="form.brief"
            placeholder="类型简介"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button type="submit" @click="submitForm()" :loading="submitLoading" />
    </div>
  </el-dialog>
</template>

<script>
import { createAwardType, updateAwardType } from "@/api/award";
import { modal } from "@/mixins/modal";

export default {
  name: "AwardTypeCreate",

  mixins: [modal],

  data() {
    return {
      rules: {
        type: [
          { required: true, message: "请输入类型名称", trigger: "blur" },
          {
            min: 2,
            max: 32,
            message: "长度在 1 到 32 个字符",
            trigger: "blur",
          },
        ],
        type_en: [
          {
            min: 2,
            max: 128,
            message: "长度在 2 到 128 个字符",
            trigger: "blur",
          },
        ],
        brief: [
          {
            max: 100,
            message: "长度不能超过 100 个字符",
            trigger: "blur",
          },
        ],
      },
      form: {
        id: null,
        type: "",
        type_en: "",
        is_actor: 0,
        brief: "",
      },
    };
  },

  methods: {
    // 创建/编辑
    async submit() {
      return this.isEdit
        ? await updateAwardType(this.id, this.form.id, this.form)
        : await createAwardType(this.id, this.form);
    },
  },
};
</script>

<style scoped lang="scss">
.type-container {
  padding: 15px 25px 0;
}
</style>