<template>
  <el-input-number
    :value="value"
    :controls-position="controlsPosition"
    :min="min"
    :max="max"
    :disabled="disabled"
    :step="step"
    @change="handleChange"
    :placeholder="placeholder"
  />
</template>

<script>
/**
 * m-input-number
 * @module components/MInputNumber
 * @desc element-ui el-input-number 二次封装
 * @param {number} value - 绑定值
 * @param {number} [min] - 设置计数器允许的最小值，默认为0
 * @param {number} [max] - 设置计数器允许的最大值，默认为9999
 * @param {number} [step] - 计数器步长，默认为1
 * @param {boolean} [disabled] - 是否禁用计数器，默认为 false
 * @param {string} [controlsPosition] - 控制按钮位置，默认值为right
 * @param {string} [placeholder] - 输入框占位文本
 *
 * @example
 * <m-input-number v-model="egg_hunt" placeholder="彩蛋个数" />
 */

export default {
  name: "MInputNumber",
  props: {
    value: {},
    min: {
      default: 0,
    },
    max: {
      default: 9999,
    },
    step: {
      default: 1,
    },
    disabled: {
      default: false,
    },
    controlsPosition: {
      default: "right",
    },
    placeholder: {},
  },
  methods: {
    handleChange(value) {
      this.$emit("input", value);
    },
  },
};
</script>