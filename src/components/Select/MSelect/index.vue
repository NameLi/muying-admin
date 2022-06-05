<template>
  <el-select
    :loading="loading"
    :value="value"
    :size="size"
    :multiple="multiple"
    :multiple-limit="multipleLimit"
    :clearable="clearable"
    :filterable="filterable"
    :allow-create="allowCreate"
    :placeholder="placeholder"
    @input="$emit('input', $event)"
    @change="$emit('change')"
  >
    <el-option
      v-for="item in list"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    >
      <template v-if="useSlot">
        <span class="label">{{ item.label }}</span>
        <span class="count">{{ item.count }}</span>
      </template>

      <span v-else-if="$slots.default"><slot></slot></span>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "MSelect",
  props: {
    value: {},
    options: {
      type: Array,
      default: () => [],
    },
    multipleLimit: {
      type: Number,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    useSlot: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    allowCreate: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "medium",
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    props: {
      type: Object,
      default: () => {
        return {
          value: "value",
          label: "label",
          count: "count",
        };
      },
    },
  },
  computed: {
    loading() {
      return !this.list.length;
    },
    list() {
      let list = [];
      this.options.map((item) => {
        list.push({
          value:
            item[this.props.value] === undefined
              ? item
              : item[this.props.value],
          label:
            item[this.props.label] === undefined
              ? item
              : item[this.props.label],
          count:
            item[this.props.count] === undefined ? "" : item[this.props.count],
        });
      });

      return list;
    },
  },
};
</script>

<style scoped lang="scss">
.label {
  float: left;
}
.count {
  float: right;
  color: #8492a6;
  font-size: 13px;
}
</style>