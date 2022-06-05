<template>
  <el-drawer :visible.sync="visible" size="660px" :with-header="false">
    <div class="modal-container">
      <el-form
        :model="form"
        ref="form"
        label-width="110px"
        style="padding: 20px"
      >
        <el-form-item label="method：">{{ form.method }}</el-form-item>
        <el-form-item label="admin：">
          <span v-if="form.admin">{{ form.admin.nickname }} ({{ form.admin.account }})</span>
        </el-form-item>
        <el-form-item label="table：">{{ form.table }}</el-form-item>
        <el-form-item label="union_id：">{{ form.union_id }}</el-form-item>
        <el-form-item label="host：">{{ form.host }}</el-form-item>
        <el-form-item label="uri：">{{ form.uri }}</el-form-item>
        <el-form-item label="IP：">{{ form.ip }}</el-form-item>
        <el-form-item label="old_attributes：">
          <json-viewer v-if="form.old_attributes" :value="form.old_attributes" />
        </el-form-item>
        <el-form-item label="new_attributes：">
          <json-viewer v-if="form.new_attributes" :value="form.new_attributes" />
        </el-form-item>
        <el-form-item label="user_agent：">{{ form.user_agent }}</el-form-item>
        <el-form-item label="description：">
          {{ form.description }}
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<script>
import { getActionLog } from "@/api/log";
import { modal } from "@/mixins/modal";

export default {
  name: "ActionLogModal",

  mixins: [modal],

  data() {
    return {
      loading: false,
      form: {
        params: {},
        old_attributes: {},
        new_attributes: {}
      }
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.getActionLog();
      }
    },
  },

  methods: {
    async getActionLog() {
      this.loading = true;
      const { code, data } = await getActionLog(this.form.id);
      this.loading = false;

      if (code === 200) {
        this.form = data;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.modal-container {
  height: 100vh;
  overflow: auto;
  ::v-deep .el-form-item__label {
    font-weight: bold;
  }
  ::v-deep .jv-container .jv-code {
    padding: 0;
  }
}
</style>