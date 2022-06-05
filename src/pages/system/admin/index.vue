<template>
  <container-layout>
    <template v-slot:header>
      <el-input
        v-model="form.keyword"
        @keyup.enter.native="getData(true)"
        size="medium"
        clearable
        placeholder="名称 / 账号"
      />
      <m-button type="search" @click="getData(true)" :loading="loading" />
      <m-button type="create" @click="showModal()" />
    </template>

    <m-table
      v-loading="loading"
      :data="list"
      :sort.sync="sort"
      @sort-change="getData(true)"
      sortby="deadline_at, last_login_at"
    >
      <m-table-column prop="avatar" width="71" label="人员头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" class="avatar" />
        </template>
      </m-table-column>
      <m-table-column prop="nickname" min-width="100" label="人员名称" />
      <m-table-column prop="account" min-width="100" label="账号" />
      <m-table-column prop="created_at" min-width="140" label="创建时间" />
      <m-table-column
        prop="last_login_at"
        min-width="140"
        label="上次登录时间"
      />
      <m-table-column prop="deadline_at" min-width="100" label="有效期至" />
      <m-table-column prop="last_login_ip" min-width="100" label="上次登录IP" />

      <m-table-column prop="roles" min-width="120" label="权限角色">
        <template slot-scope="scope">
          <el-tag v-for="role in scope.row.roles" :key="role.id">{{
            role.name
          }}</el-tag>
        </template>
      </m-table-column>

      <m-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">启用</span>
          <span v-else-if="scope.row.status === 1" class="danger">禁用</span>
        </template>
      </m-table-column>

      <m-table-column
        prop="brief"
        label="简介"
        show-overflow-tooltip
        min-width="180"
      />

      <m-table-column fixed="right" label="操作" width="126">
        <template slot-scope="scope">
          <m-button type="edit" @click="showModal(scope.row)" />
          <m-button type="delete" @click="deleteAdmin(scope.row)" />
        </template>
      </m-table-column>
    </m-table>

    <!-- 新增/编辑 -->
    <admin-modal ref="modal" @on-success="getData()" />

    <template v-slot:footer>
      <m-pagination :pagination.sync="pagination" @on-change="getData()" />
    </template>
  </container-layout>
</template>

<script>
import { getAdmins, deleteAdmin } from "@/api/system";
import AdminModal from "./components/AdminModal";

export default {
  name: "AdminList",

  components: {
    AdminModal,
  },

  data() {
    return {
      ...this.$defaults(),

      form: {
        keyword: "",
      },
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    // 获取管理员列表
    getData(isReset) {
      this.$getData(getAdmins, this, isReset);
    },

    // 创建/编辑管理员
    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 删除管理员
    async deleteAdmin(row) {
      try {
        await this.$confirm("确定要删除该管理员吗?", "提示", {
          type: "warning",
        });

        const { code } = await deleteAdmin(row.id);

        if (code === 200) {
          this.getData();
        }
      } catch {}
    },
  },
};
</script>
