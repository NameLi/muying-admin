<template>
  <container-layout>
    <template v-slot:header>
      <m-select
        v-model="form.status"
        :options="statusList"
        placeholder="用户状态"
      />

      <el-input
        size="medium"
        v-model="form.keyword"
        @keyup.enter.native="getData(true)"
        clearable
        placeholder="用户名 / 账号"
      />
      <m-button type="search" :loading="loading" @click="getData(true)" />
    </template>

    <template v-slot:default>
      <m-table
        v-loading="loading"
        :data="list"
        :sort.sync="sort"
        @sort-change="getData(true)"
        sortby="day_count, score_count"
      >
        <m-table-column label="头像" width="72">
          <template slot-scope="scope">
            <img width="50" height="50" :src="scope.row.avatar" />
          </template>
        </m-table-column>

        <m-table-column prop="username" label="用户名" min-width="120" />
        <m-table-column prop="account" label="账号" min-width="120" />
        <m-table-column prop="gender" label="性别" min-width="120" />
        <m-table-column prop="age" label="年龄" width="120" />
        <m-table-column prop="day_count" label="注册天数" width="120" />
        <m-table-column
          prop="last_login_at"
          label="上次登录时间"
          min-width="130"
        />
        <m-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <m-button type="detail" @click="pathToDetail(scope.row)" />
            <m-button type="set" @click="showSetModal(scope.row)" />
            <m-button
              type="danger"
              v-if="!scope.row.disabled_before"
              @click="showDisabledModal(scope.row)"
            >
              禁用
            </m-button>

            <el-tooltip
              v-else
              class="item"
              effect="dark"
              :content="`该用户被禁用到 ${scope.row.disabled_before}`"
              placement="top-start"
            >
              <m-button type="danger" plain>禁用</m-button>
            </el-tooltip>
          </template>
        </m-table-column>
      </m-table>

      <!-- 用户禁用模块设置 -->
      <user-set ref="setModal" @on-success="getData()" />

      <!-- 用户禁言设置 -->
      <user-disabled ref="disabledModal" @on-success="getData()" />
    </template>

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import { getUsers } from "@/api/user";
import UserSet from "./components/UserSet";
import UserDisabled from "./components/UserDisabled";

export default {
  name: "UserList",

  components: { UserSet, UserDisabled },

  data() {
    return {
      ...this.$defaults(),

      statusList: [
        {
          label: "禁用用户",
          value: 1,
        },
        {
          label: "注销用户",
          value: 2,
        },
      ],

      form: {
        keyword: "",
      },
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    // 用户详情
    pathToDetail(row) {
      this.$router.push({
        name: "UserDetailData",
        params: { id: row.id },
      });
    },

    // 获取用户列表
    getData(isReset) {
      this.$getData(getUsers, this, isReset);
    },

    // 设置用户禁用模块
    showSetModal(row) {
      let user = {
        id: row.id,
        auth: row.auth,
      };
      this.$refs["setModal"].open(user);
    },

    // 设置用户禁言
    showDisabledModal(row) {
      let user = {
        id: row.id,
      };
      this.$refs["disabledModal"].open(user);
    },
  },
};
</script>
