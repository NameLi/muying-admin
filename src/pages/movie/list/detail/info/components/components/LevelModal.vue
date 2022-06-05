<template>
  <el-dialog
    :title="isEdit ? '编辑家长引导' : '添加家长引导'"
    :visible.sync="visible"
    width="460px"
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
      <el-form-item label="家长指导：" prop="level">
        <el-cascader
          style="width: 90%"
          v-model="form.level"
          :options="levels"
          :props="{ expandTrigger: 'hover' }"
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
import { createMovieLevel, updateMovieLevel } from "@/api/movie";
import { getSimpleLevels } from "@/api/basic";
import { modal } from "@/mixins/modal";

export default {
  name: "LevelModal",

  mixins: [modal],

  inject: ["id"],

  data() {
    return {
      rules: {
        level: [
          { required: true, message: "请选择家长引导", trigger: "change" },
        ],
      },
      form: {
        id: null,
        level: [],
      },
      levels: [],
    };
  },

  methods: {
    open(row) {
      if (row) {
        this.isEdit = true;
        this.form = Object.assign(this.form, row);
        // 等级回显
        this.form.level = [row.level.country.id, row.level_id];
      }
      this.visible = true;

      this.getLevels();
    },

    // 获取家长引导列表
    async getLevels() {
      this.levelLoading = true;
      const { code, data } = await getSimpleLevels();
      this.levelLoading = false;

      if (code === 200) {
        this.levels = data;
      }
    },

    async submit() {
      let params = { level_id: this.form.level[1] };

      return this.isEdit
        ? await updateMovieLevel(this.id, this.form.id, params)
        : await createMovieLevel(this.id, params);
    },
  },
};
</script>