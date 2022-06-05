<template>
  <tab-layout :components="components" v-model="currentView">
    <transition name="fade">
      <keep-alive>
        <!-- 动态组件 -->
        <component :is="currentView" :ref="currentView" />
      </keep-alive>
    </transition>
  </tab-layout>
</template>

<script>
import Basic from "./components/Basic";
import Brief from "./components/Brief";
import Award from "./components/Award";

export default {
  name: "ActorInfoLayout",

  components: {
    Basic,
    Brief,
    Award,
  },

  inject: ["id"],

  data() {
    return {
      currentView: "Basic",
      components: [
        {
          title: "基础信息",
          component: "Basic",
        },
        {
          title: "影人介绍",
          component: "Brief",
        },
        {
          title: "荣誉奖项",
          component: "Award",
        },
      ],
    };
  },

  watch: {
    // tab切换时切换为对应的动态路由地址
    currentView(nVal, oVal) {
      if (nVal === oVal || nVal === this.$route.query.view) return;
      this.$router.replace("?view=" + nVal);
    },
  },

  created() {
    // 如果路由存在 view，则使用该 view（为了刷新时路由地址不变），否则使用默认值
    this.currentView = this.$route.query.view || "Basic";
  },
};
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter {
  opacity: 0;
}
</style>