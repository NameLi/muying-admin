<template>
  <div class="tab-wrapper">
    <div class="tab-container">
      <div class="tab-header">
        <tab-nav :components="components" :value="value" @on-change="onChange">
          <slot name="header" />
        </tab-nav>
      </div>

      <div class="tab-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import TabNav from "./TabNav";

export default {
  name: "TabLayout",

  components: {
    TabNav,
  },

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

  methods: {
    onChange(value) {
      this.$emit("input", value);
    },
  },
};
</script>

<style scoped lang="scss">
.tab-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .tab-container {
    position: relative;
    padding: 0 10px;
    height: calc(100vh - 50px);
    background-color: #fff;
    .tab-header {
      display: flex;
      height: 55px;
      white-space: nowrap;
    }

    .tab-content {
      height: calc(100vh - 115px);
      border: 1px solid #d1dbe5;
      border-top: none;
      box-sizing: border-box;
      overflow: auto;
    }
  }
}
</style>
