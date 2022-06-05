<template>
  <div class="frame-wrapper">
    <!-- 顶部导航栏 -->
    <header-bar />

    <div class="frame-body">
      <!-- 左侧导航栏 -->
      <left-bar />

      <!-- 左侧子导航栏 -->
      <middle-bar />

      <!-- 内容区域 -->
      <div class="frame-container">
        <keep-alive
          include="MovieList,ActorList,RoleList,VideoList,UserList,ArticleList,DataSummary,DataMovie,DataActor"
        >
          <router-view />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderBar from "@/components/Bar/HeaderBar";
import LeftBar from "@/components/Bar/LeftBar";
import MiddleBar from "@/components/Bar/MiddleBar";

export default {
  name: "Layout",
  components: {
    HeaderBar,
    LeftBar,
    MiddleBar,
  },
};
</script>


<style lang="scss">
.frame-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .frame-body {
    display: flex;
    flex-shrink: 0;
    .frame-container {
      position: relative;
      flex: 1;
      height: calc(100vh - 50px);
      overflow: auto;
    }
  }
}
</style>