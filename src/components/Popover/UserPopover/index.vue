<template>
  <el-popover placement="top-start" width="220" trigger="hover" v-if="user">
    <div class="pop-card">
      <img class="avatar" :src="user.avatar" />
      <div class="info">
        <h5 class="name">{{ user.username }}</h5>
        <!-- <a
          class="span span-mini span-primary"
          @click="goPath('users/' + user.id + '/info')"
          >查看详情</a
        > -->
      </div>
    </div>

    <el-tag type="warning" slot="reference" size="small">{{ user.username }}</el-tag>
  </el-popover>
</template>

<script>
export default {
  name: "UserPopover",
  props: {
    user: {
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
    border-color: rgba(#e6a23c, .5);
    background: rgba(#e6a23c, .15);
  }
}
</style>