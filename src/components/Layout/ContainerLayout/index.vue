<template>
  <div
    class="container-wrapper"
    :class="{ 'is-fixed': zIndex }"
    :style="containerStyle"
  >
    <div class="container-header">
      <slot name="header" />
    </div>
    <div class="container-content" :style="style">
      <slot />
    </div>
    <div class="container-footer" v-if="footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ContainerLayout",
  props: {
    zIndex: {
      type: Number,
    },
    height: {
      type: String,
      default: "calc(100vh - 50px)",
    },
    footer: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },

  computed: {
    containerStyle() {
      return { "z-index": this.zIndex, height: this.height };
    },
    style() {
      let diffH = Number(this.height.match(/calc\(100vh - (\S*)px\)/)[1]);

      let height = this.footer ? diffH + 93 : diffH + 63;

      return { height: `calc(100vh - ${height}px)` };
    },
  },
};
</script>

<style scoped lang="scss">
.container-wrapper {
  padding: 0 10px;
  flex: 1;
  display: block;
  overflow: auto;
  height: calc(100vh - 50px);
  background-color: #fff;
  box-sizing: border-box;
  &.is-fixed {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
  }
  .container-header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 55px;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
    ::v-deep .el-select,
    .el-input {
      margin-right: 10px;
      width: 150px;
    }
  }

  .container-content {
    height: calc(100vh - 143px);
    padding: 5px 0;
    box-sizing: border-box;
    ::v-deep .el-table {
      .avatar {
        width: 46px;
        height: 46px;
        border-radius: 4px;
      }
      .poster {
        max-width: 70px;
        max-height: 100px;
      }
    }
  }
  .container-footer {
    padding: 5px 0;
    text-align: right;
    border-top: 1px solid #f5f5f5;
    background: #fff;
  }
}
</style>