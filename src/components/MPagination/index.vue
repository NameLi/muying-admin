<template>
  <el-pagination
    background
    small
    :layout="layout"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    :page-sizes="sizes"
    :page-size.sync="pagination.per_page"
    :current-page.sync="pagination.page"
    :total="pagination.total"
  />
</template>

<script>
/**
 * m-pagination
 * @module components/MPagination
 * @desc element-ui el-pagination 二次封装 传入pagination对象，接收方不需要再设置页码值
 * @param {string} [layout] - 同 element-ui
 * @param {object} pagination - 分页对象，支持 .sync 修饰符
 * @param {number} pagination.per_page - 每页显示条目个数
 * @param {number} pagination.page - 当前页数
 * @param {number} pagination.total - 总条目数
 * @param {array} [sizes] - 每页显示个数选择器的选项设置
 *
 * @example
 * <m-pagination :pagination.sync="pagination" @on-change="getData()" />
 */

export default {
  name: "MPagination",
  props: {
    layout: {
      default: "total, prev, pager, next, sizes, jumper",
    },
    pagination: {
      type: Object,
      required: true,
    },
    sizes: {
      type: Array,
      default() {
        return [20, 40, 60, 80, 100];
      },
    },
  },
  methods: {
    handleCurrentChange(page) {
      this.$emit("update:pagination", this.pagination);
      // this.$emit("page-change", page);
      this.$emit("on-change", this.pagination);
    },
    handleSizeChange(size) {
      this.$emit("update:pagination", this.pagination);
      // this.$emit("size-change", size);
      this.$emit("on-change", this.pagination);
    },
  },
};
</script>