<template>
  <el-table
    :data="data"
    :sort="sort"
    :border="border"
    :stripe="stripe"
    :height="height"
    :highlight-current-row="highlightCurrentRow"
    @sort-change="sortChangeHandle"
    :span-method="spanMethod"
    :sortby="sortby"
  >
    <slot />
  </el-table>
</template>

<script>
/**
 * m-table
 * @module components/MTable
 * @desc 对 element-ui 的 el-table 组件二次封装
 * @param {array} data - 显示的数据，同el-table
 * @param {string, number} [height] - table 高度，默认值 true
 * @param {boolean} [stripe] - 是否为斑马纹 table，默认值 true
 * @param {boolean} [border] - 是否带有纵向边框，默认值 true
 * @param {boolean} [highlightCurrentRow] - 是否要高亮当前行，默认值 true
 * @param {object} [sort] - 手动对 Table 进行排序，同 el-table
 * @param {string} [sort.sortby] - 排序字段
 * @param {string} [sort.order] - 排序顺序，asc，desc
 * @param {string} [sortby] - 调用后端排序的字段，逗号分隔，对el-table的sortby方法进行了改写
 * @param {function} [spanMethod] - 合并行或列的计算方法，同 el-table
 * 
 * @example
 * <m-table v-loading="loading"
 *   :data="list"
 *   :sort.sync="sort"
 *   @sort-change="getData(true)"
 *   sortby="year, vote_count"
 * >
 *    <m-table-column>...</m-table-column>
 * </m-table>
 */

export default {
  name: "MTable",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    height: {
      type: [String, Number],
      default: "100%",
    },
    stripe: {
      type: Boolean,
      default: true,
    },
    border: {
      type: Boolean,
      default: true,
    },
    highlightCurrentRow: {
      type: Boolean,
      default: true,
    },
    spanMethod: {},
    sort: {},
    sortby: {},
  },
  methods: {
    sortChangeHandle({ column, prop, order }) {
      const orderby = order
        ? order === "ascending"
          ? "asc"
          : order === "descending"
          ? "desc"
          : order
        : order;

      // 如果是多级属性，则取最后一个
      // e.g movie.year 取 year
      if (prop) {
        prop = prop.split(".")[prop.split(".").length - 1];
      }

      this.$emit("update:sort", { sortby: prop, order: orderby });

      this.$emit("sort-change", { column, prop, order });
    },
  },
};
</script>