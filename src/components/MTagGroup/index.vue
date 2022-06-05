<template>
  <div class="tag-group">
    <el-tag
      v-for="tag in tags"
      :key="tag"
      :size="size"
      :effect="effect"
      :type="type"
      closable
      disable-transitions
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>

    <el-input
      class="input-new-tag"
      v-model="inputValue"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
      :placeholder="placeholder"
      :style="{ width: inputWidth }"
    />
  </div>
</template>


<script>
/**
 * m-tag-group
 * @module components/MTagGroup
 * @desc element-ui tag 二次封装 group形式
 * @param {array} [value] - tag 内容数组
 * @param {string} [effect] - 主题，参考 el-tag
 * @param {string} [type] - 类型，参考 el-tag
 * @param {string} [size] - 尺寸，参考 el-tag
 * @param {string} [placeholder] - 输入框占位文本，默认值为"添加标签"
 * @param {string} [inputWidth] - 输入框宽度，单位px，默认"100px"
 *
 * @example
 * <tag-group v-model="tags" placeholder="添加标签" />
 */

export default {
  name: "TagGroup",
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    effect: {
      default: "light",
    },
    type: {
      default: "primary",
    },
    size: {
      default: "larger",
    },
    placeholder: {
      type: String,
      default: "添加标签",
    },
    inputWidth: {
      type: String,
    },
  },
  data() {
    return {
      tags: this.value,
      inputValue: "",
    };
  },

  watch: {
    value(val) {
      this.tags = val;
    },
  },

  methods: {
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.$emit("input", this.tags);
    },

    handleInputConfirm() {
      if (this.tags.includes(this.inputValue)) {
        this.$message.warning("该标签已存在");
        return;
      }

      let inputValue = this.inputValue;
      if (inputValue) {
        this.value.push(inputValue);
        this.$emit("input", this.tags);
      }
      this.inputValue = "";
    },
  },
};
</script>

<style scoped lang="scss">
.tag-group {
  .el-tag {
    margin-right: 10px;
    margin-bottom: 8px;
  }
  .input-new-tag {
    width: 100px;
    ::v-deep .el-input__inner {
      vertical-align: top;
      border-style: dashed;
      font-size: 12px;
    }
  }
}
</style>