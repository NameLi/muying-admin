<template>
  <el-form-item label="禁用时长：" prop="disabled_day">
    <el-radio-group :value="value" @change="$emit('input', $event)">
      <el-radio :label="1">1天</el-radio>
      <el-radio :label="7">7天</el-radio>
      <el-radio :label="30">30天</el-radio>
      <el-radio :label="365">365天</el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<script>
export default {
  name: "SetDate",

  props: ["value"],
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