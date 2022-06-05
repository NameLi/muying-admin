<template>
  <el-drawer
    :visible.sync="visible"
    size="660px"
    append-to-body
    :with-header="false"
  >
    <div class="modal-container">
      <el-form
        :model="form"
        ref="form"
        label-width="110px"
        style="padding: 20px"
      >
        <el-form-item label="操作人：">
          <span v-if="form.admin"
            >{{ form.admin.nickname }} ({{ form.admin.account }})</span
          >
        </el-form-item>

        <el-form-item label="原有值：">
          <json-viewer
            v-if="form.old_attributes"
            :value="form.old_attributes"
            preview-mode
          />
        </el-form-item>

        <el-form-item label="变更后：">
          <json-viewer
            v-if="form.new_attributes"
            :value="form.new_attributes"
            preview-mode
          />
        </el-form-item>

        <el-form-item label="变更说明：">
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
  name: "HistoryDetailModal",

  mixins: [modal],

  data() {
    return {
      loading: false,
      form: {
        params: {},
        old_attributes: {},
        new_attributes: {},
      },
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
  ::v-deep .jv-container {
    padding: 0 10px;
    background-color: #f5f5f5;
    .jv-code {
      padding: 0;
    }
  }
}
</style>