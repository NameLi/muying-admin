<template>
  <el-popover placement="left" width="220" trigger="hover" v-if="role">
    <div class="pop-card">
      <img class="avatar" :src="role.avatar" />
      <div class="info">
        <h5>{{ role.name }}</h5>
        <!-- <span>粉丝数：{{ role.collection_count }}</span>
        <span>出生地：{{ role.born_place }}</span> -->
      </div>
    </div>
    <el-tag slot="reference" size="small">{{ role.name }}</el-tag>
  </el-popover>
</template>

<script>
export default {
  name: "RolePopover",
  props: {
    role: {
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