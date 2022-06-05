<template>
  <div class="nav-wrapper">
    <el-scrollbar class="aside-scroller">
      <ul class="nav min-nav" @click="navClickHandle">
        <router-link
          tag="li"
          v-for="item of menus"
          :to="item.path"
          :key="item.path"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="item.meta.title"
            placement="right"
          >
            <i
              :class="['iconfont', 'icon-' + item.meta.icon]"
              :style="`color:${item.meta.color}`"
            ></i>
          </el-tooltip>
        </router-link>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "LeftBar",
  data() {
    return {};
  },

  computed: {
    ...mapState({
      menus: (state) => state.user.menus,
    }),
  },
  methods: {
    navClickHandle(e) {
      let el = e.target;

      if (el.tagName === "I" || el.tagName === "LI") {
        const scrollEl = document.querySelector(
          ".aside-scroller .el-scrollbar__wrap"
        );
        const scrollElHeight = scrollEl.offsetHeight;
        const navHeight = scrollEl.firstElementChild.offsetHeight;
        if (scrollElHeight >= navHeight) return;

        const scrollTop = scrollEl.scrollTop;

        if (el.tagName === "I") {
          el = el.parentNode;
        }

        const offsetTop = el.offsetTop;

        if (offsetTop - scrollTop < 110) {
          scrollEl.scrollTop = 0;
        } else if (scrollElHeight - (offsetTop - scrollTop) < 110) {
          scrollEl.scrollTop = scrollTop + 110;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.nav-wrapper {
  z-index: 2;
  position: relative;
  background: #373d41;
}

.aside-scroller {
  height: calc(100vh - 42px);
  // ::v-deep .el-scrollbar__bar.is-vertical {
  //   opacity: 0;
  // }
  // ::v-deep .el-scrollbar__wrap {
  //   overflow-x: hidden;
  // }
}
.nav {
  position: relative;
  z-index: 10;
  padding-bottom: 30px;
  width: 60px;
  transition: width 0.2s;
  > li {
    position: relative;
    left: 0;
    top: 0;
    height: 55px;
    line-height: 55px;
    cursor: pointer;
    white-space: nowrap;
    transition: 0.2s ease-in;
    > i {
      display: inline-block;
      width: 60px;
      font-size: 20px;
      color: #ccc;
      text-align: center;
      vertical-align: top;
    }
    > em {
      float: right;
      height: 16px;
      line-height: 16px;
      margin: 20px 10px 0 0;
      padding: 0 5px;
      border-radius: 5px;
      font-size: 12px;
      text-indent: 0;
      background: #1797be;
    }

    &.is-active {
      position: relative;
      background: #2e3344;
      &:hover {
        background: #2e3344;
      }
      &::before,
      &::after {
        display: block;
        content: " ";
        position: absolute;
        left: 0;
        width: 100%;
        height: 1px;
        font-size: 0;
        background: #000;
        overflow: hidden;
        box-shadow: 0 1px 1px #555;
      }
    }
  }
}

.liner {
  height: 1px;
  background: #000;
  overflow: hidden;
  font-size: 0;
  box-shadow: 0 1px 1px #555;
}

.min-nav {
  .tip {
    z-index: 2300;
    position: absolute;
    left: 72px;
    top: 8px;
    padding-right: 10px;
    width: auto;
    height: 40px;
    line-height: 40px;
    color: #fff;
    // display: none;
    border-radius: 2px;
    text-indent: 10px;
    font-size: 14px;
    transition: all 0.3;
    white-space: nowrap;
    background: #4a5064;
    &::before {
      position: absolute;
      left: -5px;
      top: 14px;
      width: 10px;
      height: 10px;
      background: #4a5064;
      content: " ";
      transform: rotate(45deg);
      z-index: -1;
    }
  }
  > li {
    &:hover {
      background: #4a5064;
      .tip {
        display: block;
        > em {
          // display: none;
        }
      }
    }
  }
}
</style>
