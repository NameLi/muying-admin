<template>
  <el-popover placement="left" width="220" trigger="hover" v-if="actor">
    <div class="pop-card">
      <img class="avatar" :src="actor.avatar" />
      <div class="info">
        <h5>{{ actor.name }}</h5>
        <span>{{ actor.name_en }}</span>
        <span>性别：{{ actor.gender }}</span>
        <span>国家/地区：{{ actor.country }}</span>
      </div>
    </div>
    <el-tag slot="reference" type="success" size="small">{{ actor.name }}</el-tag>
  </el-popover>
</template>

<script>
export default {
  name: "ActorPopover",
  props: {
    actor: {
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.pop-card {
  display: flex;
  .avatar {
    max-width: 55px;
    max-height: 80px;
  }
  .info {
    flex: 1;
    width: 0;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    > h5 {
      padding-bottom: 6px;
      line-height: 18px;
      font-size: 14px;
      font-weight: bold;
    }
    > span {
      height: 18px;
      color: #666;
      font-size: 12px;
    }
  }
}
::v-deep .el-tag {
  margin-right: 10px;
  margin-bottom: 5px;
  height: auto;
  white-space: normal;
  &:hover {
    cursor: pointer;
    border-color: rgba(#409EFF, .5);
    background: rgba(#409EFF, .15);
  }
}
</style>