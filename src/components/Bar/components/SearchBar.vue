<template>
  <el-popover
    placement="bottom-start"
    width="440"
    popper-class="search-popover"
    trigger="manual"
    ref="popover"
    v-model="visible"
  >
    <el-scrollbar class="search-scroller">
      <ul class="search-list">
        <li class="search-item">
          <div class="item-title"></div>
          <div class="item-result">
            增加 elasticsearch 功能
            <!-- <div class="result-item">123</div> -->
          </div>
        </li>
      </ul>
    </el-scrollbar>

    <div class="search-bar" slot="reference" @click="handleClick">
      <el-input
        size="mini"
        style="width: 200px"
        ref="input"
        v-model="value"
        suffix-icon="el-icon-search"
        placeholder="影片 / 影人 / 角色 / 用户"
      />
    </div>
  </el-popover>
</template>

<script>
export default {
  name: "SearchBar",
  props: {
    value: {},
  },

  data() {
    return {
      visible: false,
    };
  },

  methods: {
    handleClick() {
      this.visible = true;
      // this.$refs['popover'].doToggle()
    },

    iconClickHandle(icon) {
      this.$refs["popover"].doClose();
      this.$emit("input", icon);
    },
  },
};
</script>

<style lang="scss">
.search-popover {
  padding: 6px !important;
  border-radius: 0;
  .popper__arrow {
    top: 7px;
    left: 40px !important;
  }
}
</style>

<style scoped lang="scss">
.search-bar {
  ::v-deep .el-input {
    .el-input__inner {
      border-radius: 40px;
      font-size: 12px;
      border: none;
    }
  }
}

.search-scroller {
  height: 200px;
  max-height: 300px;
  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
.search-list {
  max-height: 300px;
  .search-item {
    font-size: 13px;
    .item-title {
      padding: 0 6px;
      height: 22px;
      line-height: 22px;
      color: #20a0ff;
    }
  }
}
</style>