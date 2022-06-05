<template>
  <div class="nav">
    <router-link
      v-for="item in subMenus"
      :key="item.name"
      :to="{ name: item.name, params: { id } }"
      replace
    >
      {{ item.meta.title }}
    </router-link>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ChildBar",
  props: {
    component: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      id: parseInt(this.$route.params.id),
    };
  },
  computed: {
    ...mapState({
      menus: (state) => state.user.menus,
    }),

    subMenus() {
      let menu = this.Util.getMenuByName(this.menus, this.component);
      return menu ? menu.children : [];
    },
  },
};
</script>

<style scoped lang="scss">
.nav {
  margin-top: 14px;
  width: 100%;
  height: 41px;
  border: 1px solid #d1dbe5;
  box-sizing: border-box;
  white-space: nowrap;
  background: #eef1f6;
  > a {
    display: inline-block;
    line-height: 40px;
    padding: 0 20px;
    color: #8391a5;
    cursor: pointer;
    user-select: none;
    transition: color 0.3s;
    box-sizing: border-box;
    &.actived {
      color: #20a0ff;
      border-left: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
      border-bottom: 1px solid #fff;
      background: #fff;
      &:hover {
        color: #20a0ff;
      }
    }
    &:nth-child(1) {
      border-left: none;
    }
    &:hover {
      color: #333;
    }
  }
}
</style>