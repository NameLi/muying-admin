<template>
  <div class="header-wrapper">
    <header class="header">
      <!-- app 路由加载 -->
      <div v-if="app.loading" class="logo">
        <i class="el-icon-loading"></i>
      </div>

      <!-- 系统 logo -->
      <div v-else class="logo">
        <i class="iconfont icon-nav"></i>
        <!-- <img class="logo-image" src="https://img.ixook.com/image/FkYvhsF-w21SGCV3znN5fv0CU-RZ@public" alt=""> -->
      </div>

      <div class="title">慕影控制台</div>

      <div class="space" style="position: relative; flex: 1; width: 0">
        <current-role />
      </div>

      <!-- <search-bar class="item search"></search-bar>

      <div class="notice item">
        <i class="iconfont icon-notice"></i>
        <span class="tip">3</span>
      </div>

      <div class="item">用户统计</div> -->

      <!-- 管理员信息 -->
      <div class="user-wrapper item">
        <div class="user">
          <span>{{ admin.nickname }}</span>
          <i class="iconfont icon-arrow-down"></i>
          <img class="avatar" :src="admin.avatar" />
        </div>

        <!-- 菜单 -->
        <ol class="user-tool">
          <li @click="showUserInfoModal()">
            <i class="iconfont icon-set"></i>
            <span>个人资料</span>
          </li>
          <li @click="showPasswordModal()">
            <i class="iconfont icon-set"></i>
            <span>密码修改</span>
          </li>
          <li class="liner"></li>
          <li @click="doLogout()">
            <i class="iconfont icon-logout"></i>
            <span>安全退出</span>
          </li>
        </ol>
      </div>
    </header>

    <!-- 密码修改 -->
    <password ref="passwordModal" @on-success="handleSuccess" />

    <!-- 用户信息修改 -->
    <user-info ref="userModal" @on-success="handleSuccess" />
  </div>
</template>

<script>
import { mapState } from "vuex";

import CropImage from "./components/CropImage";
import Password from "./components/Password";
import UserInfo from "./components/UserInfo";
import SearchBar from "./components/SearchBar";
import CurrentRole from "./components/CurrentRole";

export default {
  name: "HeaderBar",
  components: {
    CropImage,
    UserInfo,
    Password,
    SearchBar,
    CurrentRole,
  },
  data() {
    return {};
  },

  computed: {
    ...mapState({
      app: (state) => state.app,
      admin: (state) => state.user.admin,
    }),
  },

  methods: {
    // 显示用户信息
    showUserInfoModal() {
      this.$refs["userModal"].open(this.admin);
    },

    // 显示修改密码
    showPasswordModal() {
      this.$refs["passwordModal"].open();
    },

    handleSuccess() {},

    doLogout() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped lang="scss">
.fade-enter {
  transform: translateX(10px);
}

.header-wrapper {
  .header {
    display: flex;
    height: 50px;
    color: #fff;
    background: #373d41;
    border-bottom: 1px solid #2a2f32;
    box-sizing: border-box;
    .item {
      padding: 0 15px;
    }
    .logo,
    .title,
    .item {
      height: 50px;
      line-height: 50px;
      border-right: 1px solid #2a2f32;
      &:not(.space):hover {
        cursor: pointer;
        background: #2a2f32;
      }
    }
    .logo {
      width: 59px;
      display: flex;
      align-items: center;
      justify-content: center;
      > i {
        font-size: 20px;
      }
      .logo-image {
        width: 36px;
        height: 36px;
      }
    }
    .title {
      width: 180px;
      text-indent: 16px;
    }

    .notice {
      .tip {
        display: inline-block;
        margin: 15px 0 0 10px;
        padding: 0 5px;
        height: 20px;
        line-height: 20px;
        border-radius: 4px;
        background: #ff9900;
      }
    }
    .user-wrapper {
      z-index: 1400;
      position: relative;
      &:hover {
        .icon-arrow-down {
          transform: rotate(180deg);
        }
        .user-tool {
          visibility: visible;
          top: 50px;
          opacity: 1;
        }
      }
      .user {
        position: relative;
        > span {
          display: inline-block;
          padding: 0px 2px;
          line-height: 50px;
          vertical-align: top;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        > i {
          display: inline-block;
          height: 50px;
          line-height: 50px;
          vertical-align: top;
          transition: all 0.3s;
        }
        .avatar {
          margin: 10px 0 0 10px;
          width: 30px;
          height: 30px;
          border-radius: 3px;
          vertical-align: top;
        }
      }
      .user-tool {
        position: absolute;
        left: 0;
        right: 2px;
        top: 40px;
        padding: 5px 0;
        background: #fff;
        box-shadow: 0 3px 6px #999;
        visibility: hidden;
        opacity: 0;
        transition: all 0.2s;
        > li {
          padding: 0 20px;
          height: 38px;
          line-height: 38px;
          > i {
            display: inline-block;
            color: #888;
          }
          > span {
            display: inline-block;
            padding-left: 10px;
            color: #333;
            font-size: 12px;
          }
          &.liner {
            margin: 6px 0;
            height: 1px !important;
            background: #e5e5e5;
          }
          &:hover {
            background: #ddd;
          }
        }
      }
    }
  }
}
</style>
