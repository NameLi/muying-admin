<template>
  <div class="child-wrapper">
    <div class="child-header">
      <slot name="header" />
    </div>
    <div class="child-content">
      <slot />
    </div>
    <div class="child-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ChildLayout",
};
</script>

<style scoped lang="scss">
.child-wrapper {
  position: relative;
  padding: 0 10px;
  height: calc(100vh - 116px);
  .child-header {
    display: flex;
    height: 48px;
    white-space: nowrap;
    box-sizing: border-box;
    ::v-deep .search-wrapper {
      margin-left: auto;
      margin-top: 8px;
      .el-select,
      .el-input {
        margin-right: 12px;
        width: 170px;
      }
    }
  }
  .child-content {
    height: calc(100vh - 200px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .child-footer {
    padding: 5px 0;
    text-align: right;
    box-sizing: border-box;
    background: #fff;
    ::v-deep .pagination {
      padding-top: 4px;
      text-align: right;
    }
  }
}
</style>
