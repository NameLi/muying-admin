<template>
  <el-table-column
    :prop="prop"
    :label="label"
    :sortable="sort"
    :width="width"
    :min-width="minWidth"
    :align="align"
    :header-align="headerAlign"
    :fixed="fixed"
    :show-overflow-tooltip="showOverflowTooltip"
    :class-name="mClassName"
  >
    <template slot-scope="scope">
      <slot :row="scope.row" :$index="scope.$index">
        {{ scope.row | formatterProp(prop) }}
      </slot>
    </template>
  </el-table-column>
</template>

<script>
/**
 * m-table
 * @module components/MTable/column
 * @desc 对 element-ui 的 el-table-column 组件二次封装，只可在el-table中使用
 * @param {string} prop - 对应列内容的字段名，也可以使用 property 属性
 * @param {string} label - 显示的标题
 * @param {boolean, string} [sortable] - 对应列是否可以排序
 * @param {boolean} [width] - 对应列的宽度
 * @param {boolean} [minWidth] - 对应列的最小宽度
 * @param {object} [align] - 对齐方式，默认值为 center
 * @param {string} [fixed] - 列是否固定在左侧或者右侧，true 表示固定在左侧
 * @param {string} [showOverflowTooltip] - 当内容过长被隐藏时显示 tooltip
 * @param {string} [className] - 自定义类名
 * @param {number} [lineClamp] - 超过指定行数后显示... 默认值4
 * 
 * @example
 * <m-table-column prop="name" label="列名" width="160" />
 */


import { getPropByPath } from "./util";

export default {
  name: "MTableColumn",
  props: {
    prop: {
      type: String,
    },
    label: {
      type: String,
    },
    sortable: {
      type: [Boolean, String],
      default: false,
    },
    width: {},
    minWidth: {},
    align: {
      type: String,
      default: "center",
    },
    headerAlign: {
      type: String,
      default: "center",
    },
    showOverflowTooltip: {
      type: Boolean,
      default: false,
    },
    fixed: [Boolean, String],
    className: {
      type: String,
    },
    lineClamp: {
      type: Number,
      default: 4,
    },
  },

  computed: {
    sort() {
      if (this.sortable) {
        return this.sortable;
      }

      let parentSortby = this.$parent.$attrs.sortby;

      if (parentSortby) {
        if (Array.isArray(parentSortby)) {
          return parentSortby.includes(this.prop) ? "custom" : false;
        } else {
          return parentSortby.replace(/\s+/g, "").split(",").includes(this.prop)
            ? "custom"
            : false;
        }
      } else {
        return false;
      }
    },
    mClassName() {
      return this.className
        ? this.className
        : this.showOverflowTooltip
        ? `ellipsis line-clamp-${this.lineClamp}`
        : "";
    },
  },

  filters: {
    formatterProp(row, prop) {
      const val = prop && getPropByPath(row, prop).v;

      // 如果值时数组，则转成字符串展示
      if (Array.isArray(val)) {
        return val.join(",");
      }
      return val;
    },
  },
};
</script>