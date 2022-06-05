<template>
  <div class="content" v-loading="loading">
    <div class="count-list">
      <card-count
        v-for="(item, index) in summary"
        :title="item.title"
        :total="item.total"
        :key="index"
      />
    </div>
  </div>
</template>

<script>
import { getRoleData } from "@/api/role";

export default {
  name: "RoleDetailData",

  inject: ["id"],

  data() {
    return {
      loading: false,
      summary: [],
    };
  },

  mounted() {
    this.getRoleData();
  },

  methods: {
    async getRoleData() {
      this.loading = true;
      const { code, data } = await getRoleData(this.id);
      this.loading = false;

      if (code === 200) {
        this.summary = data.summary;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  padding: 8px;
  min-height: calc(100vh - 50px);
  background-color: #f5f6fa;
  box-sizing: border-box;
}
</style>
