<template>
  <el-popover placement="left" width="220" trigger="hover" v-if="movie">
    <div class="pop-card">
      <img class="avatar" :src="movie.poster" />
      <div class="info">
        <h5>{{ movie.title }}</h5>
        <span>评分：{{ movie.rating }}</span>
        <span>年份：{{ movie.year }}</span>
      </div>
    </div>
    <el-tag slot="reference" size="small">{{ movie.title }}</el-tag>
  </el-popover>
</template>

<script>
export default {
  name: "MoviePopover",
  props: {
    movie: {
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