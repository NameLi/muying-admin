<!-- 变更影人状态 -->

<template>
  <el-dialog
    title="影人设置"
    width="520px"
    :visible.sync="visible"
    @close="close()"
  >
    <el-form :model="form" ref="form" label-width="100px" class="form">
      <el-form-item label="影人状态：" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="-2">待补充</el-radio>
          <el-radio :label="-1">不展示</el-radio>
          <el-radio :label="0">展示</el-radio>
          <el-radio :label="1">锁定</el-radio>
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
import { updateActorStatus } from "@/api/actor";
import { modal } from "@/mixins/modal";

export default {
  name: "ActorSet",

  mixins: [modal],

  data() {
    return {
      form: {
        id: null,
        status: 0,
      },
    };
  },

  methods: {
    async submit() {
      return await updateActorStatus(this.form.id, this.form);
    },
  },
};
</script>

<style scoped lang="scss">
.form {
  padding: 28px 20px 10px;
  user-select: none;
  ::v-deep .el-radio {
    padding: 9px 0;
  }
}
</style>