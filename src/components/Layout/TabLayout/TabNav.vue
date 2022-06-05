<template>
  <div class="tab-nav">
    <div
      class="tab-nav__item"
      :class="{ 'is-active': value === item.component }"
      v-for="item in components"
      :key="item.title"
      @click="$emit('on-change', item.component)"
    >
      {{ item.title }}
    </div>

    <div class="slot">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "TabNav",
  props: {
    components: {
      type: Array,
      default: () => {
        return [];
      },
    },
    value: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped lang="scss">
.tab-nav {
  position: relative;
  margin-top: 14px;
  width: 100%;
  height: 41px;
  border: 1px solid #d1dbe5;
  box-sizing: border-box;
  white-space: nowrap;
  background: #eef1f6;
  .tab-nav__item {
    display: inline-block;
    line-height: 40px;
    padding: 0 20px;
    color: #8391a5;
    cursor: pointer;
    user-select: none;
    transition: color 0.3s;
    box-sizing: border-box;
    &.is-active {
      color: #20a0ff;
      border-left: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
      border-bottom: 1px solid #fff;
      background: #fff;
    }
    &:nth-child(1) {
      border-left: none;
    }
    &:not(.is-active):hover {
      color: #333;
    }
  }
  .slot {
    z-index: 2;
    position: absolute;
    right: 8px;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
  }
}
</style>