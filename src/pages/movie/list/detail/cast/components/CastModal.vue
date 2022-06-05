<template>
  <el-dialog
    :title="isEdit ? '编辑演员' : '添加演员'"
    width="620px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close()"
  >
    <el-form
      style="padding: 10px 30px 0"
      label-width="100px"
      :model="form"
      :rules="rules"
      ref="form"
    >
      <!-- 查询影人 -->
      <el-form-item label="影人名称：" prop="actor_id">
        <remote-select
          type="actor"
          v-model="form.actor_id"
          :options="actors"
          :disabled="isEdit"
          placeholder="请填写影人名称进行搜索"
        />
      </el-form-item>

      <!-- 影人职务 -->
      <el-form-item label="影人职务：" prop="profession_ids">
        <el-cascader
          placeholder="请选择影人职务"
          popper-class="profession"
          style="width: 100%"
          filterable
          v-model="form.profession_ids"
          :options="professions"
          :props="{
            expandTrigger: 'hover',
            label: 'name',
            value: 'id',
          }"
        >
          <template slot-scope="{ data }">
            <span>{{ data.name }} </span>
            <span style="float: right; margin-left: 14px">
              {{ data.name_en }}
            </span>
          </template>
        </el-cascader>
      </el-form-item>

      <!-- 职务为"演员"时，显示搜索角色项与是否主演选项 -->
      <template v-if="isActor">
        <el-form-item label="是否主演：" prop="starring">
          <el-radio-group v-model="form.starring">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="饰演角色：" prop="act">
          <el-input v-model="form.act" clearable placeholder="饰演角色" />
        </el-form-item>
      </template>
    </el-form>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button type="submit" @click="submitForm()" :loading="submitLoading" />
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";

import { createMovieCast, updateMovieCast } from "@/api/movie";
import { modal } from "@/mixins/modal";

export default {
  name: "CastModal",

  mixins: [modal],

  data() {
    return {
      rules: {
        actor_id: [
          { required: true, message: "请选择影人", trigger: "change" },
        ],
        profession_ids: [
          { required: true, message: "请选择影人职务", trigger: "change" },
        ],
        starring: [
          { required: true, message: "请选择是否主演", trigger: "change" },
        ],
        act: [{ max: 120, message: "最多可输入120个字符", trigger: "blur" }],
      },

      form: {
        id: null,
        actor_id: null,
        profession_ids: [],
        starring: 0,
        act: "",
      },
      actors: [],
    };
  },

  computed: {
    ...mapState({
      professions: (state) => state.basic.professions,
    }),

    // 主职务ID
    profession_id() {
      return this.form.profession_ids.length
        ? this.form.profession_ids[0]
        : null;
    },

    // 详细职务ID
    profession_detail_id() {
      return this.form.profession_ids.length === 2
        ? this.form.profession_ids[1]
        : null;
    },

    // 是否为演员职务（Cast）
    isActor() {
      return this.profession_detail_id === 26; // 25为演员对应ID
    },
  },

  methods: {
    open(row) {
      // 编辑时拼接表单数据
      if (row) {
        this.isEdit = true;

        // 演员主职务数据回显
        const profession_ids = [];
        if (row.profession_id) {
          profession_ids.push(row.profession_id);
        }

        // 职务详情回显
        if (row.profession_detail_id) {
          profession_ids.push(row.profession_detail_id);
        }

        this.form = Object.assign(this.form, row);
        this.form.profession_ids = profession_ids;

        this.actors = [row.actor];

        this.getProfessions();
      }
      this.visible = true;
    },

    // 获取影人职业（存全局）
    async getProfessions() {
      await this.$store.dispatch("basic/getProfessions");
    },

    // 保存
    submit() {
      let params = {
        actor_id: this.form.actor_id,
        starring: this.form.starring,
        profession_id: this.profession_id,
        profession_detail_id: this.profession_detail_id,
        act: this.form.act,
      };

      return this.isEdit
        ? updateMovieCast(this.id, this.form.id, params)
        : createMovieCast(this.id, params);
    },
  },
};
</script>

<style lang="scss">
.profession {
  .el-cascader-menu__wrap {
    height: calc(80vh - 160px);
  }
}
</style>
