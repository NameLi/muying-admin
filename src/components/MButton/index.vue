<template>
  <button
    class="el-button"
    @click="handleClick"
    :disabled="disabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      buttonType ? 'el-button--' + buttonType : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': disabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle,
      },
    ]"
  >
    <i class="el-icon-loading" v-if="loading"></i>
    <i :class="butttonIcon" v-if="butttonIcon && !loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
    <span v-else-if="buttonText">{{ buttonText }}</span>
  </button>
</template>

<script>
export default {
  name: "MButton",

  props: {
    type: {
      type: String,
      default: "default",
    },
    size: {
      type: String,
    },
    icon: {
      type: String,
      default: "",
    },
    nativeType: {
      type: String,
      default: "button",
    },
    to: [String, Object],
    replace: Boolean,
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean,
  },

  computed: {
    buttonType() {
      let btnType = this.type;

      switch (btnType) {
        case "cancel":
          btnType = "";
          break;

        case "detail":
        case "search":
        case "submit":
          btnType = "primary";
          break;

        case "sort":
        case "set":
        case "edit":
        case "status":
          btnType = "warning";
          break;

        case "delete":
          btnType = "danger";
          break;

        case "create":
        case "refresh":
          btnType = "success";
          break;
      }

      return btnType;
    },

    _typeSize() {
      let btnSize = "";
      switch (this.type) {
        // case "detail":
        // case "edit":
        // case "set":
        // case "delete":
        // case "cancel":
        // case "submit":
        //   btnSize = "small";
        //   break;

        case "create":
        case "search":
        case "refresh":
        case "sort":
          btnSize = "medium";
          break;
        default:
          btnSize = "small";
      }
      return btnSize;
    },
    buttonSize() {
      return this.size || this._typeSize;
    },

    _typeIcon() {
      let btnIcon = "";

      switch (this.type) {
        case "create":
          btnIcon = "el-icon-plus";
          break;

        case "search":
          btnIcon = "el-icon-search";
          break;

        case "refresh":
          btnIcon = "el-icon-refresh";
          break;

        case "sort":
          btnIcon = "el-icon-sort";
          break;

        default:
          btnIcon = this.icon;
      }

      return btnIcon;
    },

    butttonIcon() {
      return this.icon || this._typeIcon;
    },

    buttonText() {
      if (this.$slots.default) return;

      let btnText = "";

      switch (this.type) {
        case "detail":
          btnText = "详情";
          break;

        case "edit":
          btnText = "编辑";
          break;

        case "set":
          btnText = "设置";
          break;

        case "status":
          btnText = "状态";
          break;

        case "delete":
          btnText = "删除";
          break;

        case "cancel":
          btnText = "取 消";
          break;

        case "submit":
          btnText = "保 存";
          break;

        case "create":
          btnText = "添 加";
          break;

        case "search":
          btnText = "搜 索";
          break;

        case "sort":
          btnText = "排 序";
          break;
      }

      return btnText;
    },
  },

  methods: {
    handleClick(event) {
      if (this.to) {
        if (this.replace) {
          this.$router.replace(this.to);
        } else {
          this.$router.push(this.to);
        }
      }

      this.$emit("click", event);
    },
  },
};
</script>