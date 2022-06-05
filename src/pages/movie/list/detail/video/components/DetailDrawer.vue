<template>
  <el-drawer
    title="视频详情"
    :visible.sync="visible"
    direction="rtl"
    :before-close="handleClose"
  >
    <div class="table-container">
      <el-table :data="list" border stripe size="small">
        <el-table-column prop="label" align="center" label="类型" width="180" />
        <el-table-column prop="value" align="center" label="值" />
        <el-table-column label="状态" align="center"> </el-table-column>
        <el-table-column label="操作" align="center"> </el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: "DetailDrawer",
  props: {},
  data() {
    return {
      visible: false,
      list: [
        { label: "影视" },
        { label: "影视" },
        { label: "影视" },
        { label: "影视" },
        { label: "影视" },
        { label: "影视" },
        { label: "影视" },
        { label: "影视" },
        { label: "影视" },
        { label: "影视" },
        { label: "影视" },
      ],
    };
  },

  methods: {
    open() {
      this.visible = true;
    },
    handleClose() {
      this.visible = false;
    },
  },
};
</script>

<style scoped lang="scss">
.table-container {
  margin: 20px;
}
</style>