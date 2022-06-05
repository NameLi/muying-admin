<template>
  <div class="content">
    <el-input
      type="textarea"
      style="height: calc(100vh - 200px)"
      v-model="summary"
      placeholder="影人简介"
      show-word-limit
      maxlength="2000"
    />

    <div class="save-button">
      <el-button type="success" :loading="submitLoading" @click="submit"
        >保 存</el-button
      >
    </div>
  </div>
</template>

<script>
import { getActor, updateActorSummary } from "@/api/actor";

export default {
  name: "MovieDetailInfoBrief",

  inject: ["id"],

  data() {
    return {
      loading: false,
      summary: "",
      submitLoading: false,
    };
  },

  mounted() {
    this.getActor();
  },

  methods: {
    // 获取影人信息
    async getActor() {
      this.loading = true;
      const { code, data } = await getActor(this.id);
      this.loading = false;

      if (code === 200) {
        this.summary = data.summary;
      }
    },

    // 保存影人介绍
    async submit() {
      let params = {
        summary: this.summary,
      };
      this.submitLoading = true;
      await updateActorSummary(this.id, params);
      this.submitLoading = false;
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  width: 760px;
  margin: 20px auto;
  line-height: 26px;
  font-size: 14px;
  ::v-deep textarea {
    height: 100%;
    line-height: 1.8;
    font-size: 14px;
  }
  .save-button {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
