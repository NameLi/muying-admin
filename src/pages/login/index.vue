<template>
  <div class="login-wrapper">
    <div class="contact">QQ交流群：577133021</div>

    <div class="logo">
      <img src="https://ixook.com/static/img/logo.3572ff19.png" alt="" />
    </div>

    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      size="medium"
      class="login-form"
      @keyup.enter.native="login()"
    >
      <el-form-item prop="account">
        <el-input
          v-model="form.account"
          autocomplete="off"
          maxlength="16"
          autofocus
          placeholder="请输入账号"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          autocomplete="new-password"
          maxlength="16"
          show-password
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="width: 100%"
          :loading="loading"
          @click="login()"
          >登 录</el-button
        >
      </el-form-item>
    </el-form>

    <div class="footer">
      <div class="copyright">
        ©2017-2022
        <a class="website" href="https://ixook.com" target="_blank">ixook.com</a> 版权所有
      </div>
      <div class="beian">
        <a href="https://beian.miit.gov.cn" target="_blank"
          >苏ICP备14015141号</a
        >
      </div>
    </div>
  </div>
</template>

<script>
const _import = require("@/router/_import_" + process.env.NODE_ENV); //获取组件的方法
import router from "@/router/index";
import Layout from "@/pages/Layout";

export default {
  name: "Login",
  data() {
    return {
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "长度在 5 到 16 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
      form: {
        account: "admin",
        password: "123456",
      },
      loading: false,
    };
  },

  mounted() {
    window.localStorage.clear();
  },

  methods: {
    login() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const loginRes = await this.$store.dispatch("user/login", this.form);

          if (loginRes.code !== 200) {
            this.loading = false;
            return;
          }

          const adminRes = await this.$store.dispatch("user/getInfo");
          this.loading = false;

          if (adminRes.code === 200) {
            // 处理路由
            let routes = adminRes.data.roles;

            let asyncRoutes = this.filterAsyncRouter(routes); //过滤路由

            let isAdd = false; // 防止动态路由重复添加
            if (!isAdd) {
              router.addRoutes(asyncRoutes); //动态添加路由
            }
            isAdd = true;

            this.$router.replace(
              this.$route.query.redirect
                ? this.$route.query.redirect
                : asyncRoutes[0].path
            );
          }
        } else {
          return false;
        }
      });
    },

    // 遍历后台传来的路由字符串，转换为组件对象
    filterAsyncRouter(asyncRoutes) {
      let accessedRouters = asyncRoutes.filter((route) => {
        if (route.component) {
          if (route.component === "Layout") {
            //Layout组件特殊处理
            route.component = Layout;
          } else {
            try {
              route.component = _import(route.component);
            } catch (e) {
              console.info(
                "%c 当前路由 " +
                  route.component +
                  ".vue 不存在，因此无法导入组件，请检查接口数据和组件是否匹配，并重新登录，清空缓存!",
                "color:red"
              );
            }
          }
        }

        // 存在子路由时递归遍历子路由
        if (route.children && route.children.length) {
          route.children = this.filterAsyncRouter(route.children);
        }
        return true;
      });

      return accessedRouters;
    },
  },
};
</script>

<style scoped lang="scss">
.login-wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f3f4;
  overflow: hidden;
  flex-direction: column;
  .contact {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 18px;
    color: $color-theme;
  }

  .logo {
    margin-bottom: 30px;
    img {
      width: 160px;
      height: 160px;
    }
  }
  .login-form {
    width: 360px;
    padding: 0 30px 70px;
    box-sizing: border-box;
    .form-item {
      padding: 10px 0;
    }
  }
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    height: 40px;
    line-height: 40px;
    color: #777;
    .website {
      color: #2ab88d;
      text-decoration: underline;
    }
    .beian {
      margin-left: 10px;
      &:hover {
        text-decoration: underline;
      }
      a {
        color: #2ab88d;
      }
    }
  }
}
</style> 