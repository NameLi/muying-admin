<template>
  <nav class="sub-nav-wrapper" :class="{ 'is-toggle': app.sidebar }">
    <div v-if="$route.matched.length < 3" class="sub-nav-title">
      {{ title }}
    </div>

    <div v-else class="sub-nav-title back" @click="goBack()">
      <i class="el-icon-arrow-left"></i>返回
    </div>

    <ul class="sub-nav">
      <router-link
        tag="li"
        v-for="item in menuList"
        :to="{ name: item.name, params: $route.params }"
        replace
        :key="item.name"
      >
        <span>{{ item.meta.title }}</span>
      </router-link>
    </ul>

    <!-- 菜单折叠 -->
    <div v-if="!app.sidebar" class="nav-toggle is-open" @click="navToggle()">
      <i class="el-icon-s-fold"></i>
    </div>

    <div v-else class="nav-toggle is-close" @click="navToggle()">
      <i class="el-icon-s-unfold"></i>
    </div>
  </nav>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "MiddleBar",
  data() {
    return {
      subMenu: {},
      routeParams: {},
    };
  },

  computed: {
    ...mapState({
      app: (state) => state.app,
      menus: (state) => state.user.menus,
    }),
    title() {
      return this.subMenu.meta.title;
    },
    menuList() {
      return this.subMenu.children.filter((item) => {
        return !item.name.includes("Layout");
      });
    },
  },

  watch: {
    $route: {
      immediate: true,
      handler: "getCurrentParentMenu",
      deep: true,
    },
  },

  methods: {
    goBack() {
      this.$router.back();
    },

    navToggle() {
      this.$store.dispatch("app/setSidebar", !this.app.sidebar);
    },

    getCurrentParentMenu() {
      const matcheds = this.$route.matched;
      const curParentRoute = matcheds[matcheds.length - 1].parent;
      const curParentRouteName = curParentRoute.name;

      this.getMenuByName(this.menus, curParentRouteName);
    },

    getMenuByName(menus, name) {
      if (!menus) return;

      for (let menu of menus) {
        if (menu.name === name) {
          this.subMenu = menu;
          break;
        }
        if (menu.children && menu.children.length) {
          this.getMenuByName(menu.children, name);
        }
      }
      return;
    },
  },
};
</script>

<style scoped lang="scss">
.sub-nav-wrapper {
  z-index: 1;
  position: relative;
  width: 180px;
  height: calc(100vh - 51px);
  background: #eaedf1;
  user-select: none;
  transition: margin 0.2s ease-in-out;
  &.is-toggle {
    margin-left: -180px;
  }
  // 展开与收起
  .nav-toggle {
    z-index: 11;
    position: absolute;
    top: 50%;
    left: auto;
    width: 0;
    height: 32px;
    line-height: 32px;
    font-weight: 700;
    padding-left: 2px;
    transform: translateY(-50%);
    &.is-open {
      right: 0;
      border-top: 9px solid transparent;
      border-bottom: 9px solid transparent;
      border-left: none;
      border-right: 13px solid #fff;
    }
    &.is-close {
      right: -15px;
      border-top: 9px solid transparent;
      border-bottom: 9px solid transparent;
      border-right: none;
      border-left: 13px solid #ebeef5;
      opacity: 0.55;
      transition: opacity 0.2s;
      &:hover {
        opacity: 1;
      }
      i {
        left: auto;
        right: 3px;
      }
    }
    &:hover {
      cursor: pointer;
      i {
        color: #66b1ff;
      }
    }
    i {
      color: #aaa;
      position: absolute;
      left: 2px;
      top: 0;
      height: 50px;
      line-height: 32px;
      text-align: center;
    }
  }

  .sub-nav-title {
    height: 55px;
    line-height: 55px;
    padding-left: 16px;
    font-size: 14px;
    font-weight: bold;
    background: #d9dee4;
    &.back {
      i {
        padding-right: 2px;
        font-weight: bold;
      }
      &:hover {
        cursor: pointer;
        background-color: rgba(#d9dee4, 0.85);
      }
    }
  }
  .sub-nav {
    > li {
      text-indent: 16px;
      height: 43px;
      line-height: 43px;
      color: #333;
      transition: background-color 0.2s ease-in;
      &:not(.is-active):hover {
        cursor: pointer;
        background: #f5f6fa;
      }
      > span {
        padding-left: 5px;
      }
    }
    .is-active {
      background-color: #fff;
    }
  }
}
</style>
