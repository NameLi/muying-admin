<template>
  <el-popover
    placement="bottom-start"
    width="496"
    trigger="focus"
    ref="popover"
  >
    <el-scrollbar class="icon-scroller">
      <ul class="icon-list">
        <li
          class="icon-item"
          :class="{ 'is-checked': icon === value }"
          v-for="icon in icons"
          :key="icon"
          @click="iconClickHandle(icon)"
        >
          <i class="iconfont" :class="'icon-' + icon"></i>
          <span class="label" :title="icon">{{ icon }}</span>
        </li>
      </ul>
    </el-scrollbar>

    <div class="icon-select" slot="reference" @click="handleClick">
      <el-input
        ref="input"
        v-model="value"
        readonly
        :size="size"
        :clearable="clearable"
        :placeholder="placeholder"
      >
        <i
          v-if="value"
          slot="prefix"
          class="iconfont"
          :class="'icon-' + value"
          :style="iconStyle"
        ></i>
      </el-input>
    </div>
  </el-popover>
</template>

<script>
import icons from "@/config/icon";

export default {
  name: "IconSelect",
  props: {
    color: {
      type: String,
      default: "",
    },
    value: {},
    clearable: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: "small",
    },
    placeholder: {
      type: String,
      default: "请选择图标",
    },
  },

  computed: {
    iconStyle() {
      // 正则验证是否为十六进制颜色，不是则返回空
      const reg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

      if (this.color && this.color.match(reg)) {
        return `color: ${this.color}`;
      } else {
        return "";
      }
    },
  },

  data() {
    return {
      icons,
    };
  },

  methods: {
    handleClick() {
      // this.$refs['popover'].doToggle()
    },

    iconClickHandle(icon) {
      this.$refs["popover"].doClose();
      this.$emit("input", icon);
    },
  },
};
</script>

<style scoped lang="scss">
.icon-scroller {
  max-height: 300px;
}
.icon-list {
  max-height: 300px;
  font-size: 0;
  .icon-item {
    margin-bottom: 10px;
    display: inline-block;
    width: 62px;
    height: 60px;
    text-align: center;
    &.is-checked {
      background-color: #f5f7fa;
      .iconfont,
      .label {
        color: $color-theme;
      }
    }
    &:hover {
      cursor: pointer;
      background-color: #f5f7fa;
    }
    .iconfont {
      font-size: 20px;
      display: inline-block;
      height: 36px;
      line-height: 40px;
      color: #999;
    }
    .label {
      display: block;
      height: 24px;
      line-height: 20px;
      color: #8492a6;
      font-size: 13px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

.icon-select {
  cursor: pointer;
  ::v-deep .el-input {
    user-select: none;
    .el-input__prefix {
      left: 0;
      width: 30px;
      line-height: 32px;
      text-align: center;
      color: #606266;
    }
    input {
      cursor: pointer;
    }
  }
}
</style>