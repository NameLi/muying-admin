<template>
  <div class="form">
    <el-form :model="user" ref="form" label-width="120px" v-loading="loading">
      <el-form-item label="用户名：" prop="title">
        <div>{{ user.username }}</div>
      </el-form-item>

      <el-form-item label="头像：">
        <el-image
          style="width: 100px; height: 100px"
          :src="user.avatar"
          fit="fill"
        />
      </el-form-item>

      <el-form-item label="账号：">
        <div>{{ user.account }}</div>
      </el-form-item>

      <el-form-item label="性别：">
        <div>{{ user.gender }}</div>
      </el-form-item>

      <el-form-item label="生日：">
        <div>{{ user.birthday }}</div>
      </el-form-item>

      <el-form-item label="个签：">
        <div>{{ user.signature }}</div>
      </el-form-item>

      <el-form-item label="注册时间：">
        <div>{{ user.created_at }}</div>
      </el-form-item>

      <el-form-item label="上次登录时间：">
        <div>{{ user.last_login_at }}</div>
      </el-form-item>

      <el-form-item label="登录IP：">
        <div>{{ user.ip }}</div>
      </el-form-item>

      <el-form-item label="登录平台：">
        <div>{{ user.plant }}</div>
      </el-form-item>

      <el-form-item label="地址：">
        <div>{{ user.address }}</div>
      </el-form-item>

      <el-form-item label="权限：">
        <div>{{ user.auth }}</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUser } from "@/api/user";

export default {
  name: "UserDetailInfo",

  inject: ["id"],

  data() {
    return {
      loading: false,
      user: {
        avatar: "",
        gender: null,
      },
    };
  },

  mounted() {
    this.getUser();
  },

  methods: {
    // 获取用户信息
    async getUser() {
      this.loading = true;
      const { code, data } = await getUser(this.id);
      this.loading = false;

      if (code === 200) {
        this.user = data;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.form {
  display: inline-block;
  margin: 20px;
  .poster-item {
    width: 100px;
    height: 100px;
    background-color: #f5f5f5;
  }
  .info-list {
    .info-item {
      margin-top: 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      .label {
        display: inline-block;
        margin-right: 10px;
        width: 90px;
        text-align: right;
      }
      .value {
        display: inline-block;
      }
    }
  }
}
</style>