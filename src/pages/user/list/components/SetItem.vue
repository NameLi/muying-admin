<template>
  <el-form-item>
    <span slot="label">
      {{ label }}
      <el-tooltip
        class="item"
        effect="dark"
        :content="explain"
        placement="top-start"
      >
        <i class="explain el-icon-question"></i>
      </el-tooltip>
      ：
    </span>
    <el-switch
      :value="value"
      :inactive-value="0"
      :active-value="1"
      @change="$emit('input', $event)"
    />
  </el-form-item>
</template>

<script>
export default {
  name: "SetItem",

  props: {
    value: {},
    label: {
      type: String,
      required: true,
    },
    explain: {},
  },
};
</script>

<style scoped lang="scss">
.explain {
  position: relative;
  color: #999;
  top: -6px;
  font-size: 14px;
}
</style>