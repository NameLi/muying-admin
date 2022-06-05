<template>
  <tab-layout :components="components" v-model="currentView">
    <template slot="header" v-if="isShowCreateBtn">
      <m-button type="create" size="mini" @click="handleClick()" />
    </template>

    <transition name="fade">
      <keep-alive>
        <component :is="currentView" :ref="currentView" />
      </keep-alive>
    </transition>
  </tab-layout>
</template>

<script>
import Basic from "./components/Basic";
import Dialogue from "./components/Dialogue";
import Company from "./components/Company";
import Award from "./components/Award";
import Knowledge from "./components/Knowledge";
import Level from "./components/Level";
import Pubdate from "./components/Pubdate";

export default {
  name: "MovieInfoLayout",
  components: {
    Basic,
    Dialogue,
    Company,
    Award,
    Knowledge,
    Pubdate,
    Level,
  },
  data() {
    return {
      currentView: "Basic",
      components: [
        {
          title: "基础信息",
          component: "Basic",
        },
        {
          title: "上映日期",
          component: "Pubdate",
        },
        {
          title: " 家长引导",
          component: "Level",
        },
        {
          title: "幕后知识",
          component: "Knowledge",
        },
        {
          title: "经典台词",
          component: "Dialogue",
        },
        {
          title: "荣誉奖项",
          component: "Award",
        },
        {
          title: "制作发行",
          component: "Company",
        },
      ],
    };
  },
  computed: {
    isShowCreateBtn() {
      return ["Knowledge", "Dialogue"].includes(this.currentView);
    },
  },
  watch: {
    currentView(nVal, oVal) {
      if (nVal === oVal || nVal === this.$route.query.view) return;
      this.$router.replace("?view=" + nVal);
    },
  },
  created() {
    this.currentView = this.$route.query.view || "Basic";
  },
  methods: {
    handleClick() {
      this.$refs[this.currentView].showModal();
    },
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