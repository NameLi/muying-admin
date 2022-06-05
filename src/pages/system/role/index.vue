<template>
  <div class="role-container">
    <div class="role">
      <div class="role-list">
        <div class="sub-header">
          <m-button type="create" @click="showModal()" />
        </div>

        <el-table
          v-loading="loading"
          :data="roles"
          @current-change="handleRoleChange"
          highlight-current-row
          ref="roleRef"
          height="70vh"
        >
          <el-table-column prop="name" label="角色名称" />

          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <m-button type="edit" @click="showModal(scope.row)" />
              <m-button type="delete" @click="deleteRole(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="menu-list" v-loading="menusLoading">
        <el-tree
          :data="menus"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
        />
      </div>
    </div>

    <div class="save-btn">
      <m-button
        type="submit"
        size="medium"
        @click="updateRoleMenus()"
        :loading="submitLoading"
        :disabled="!role.id"
      />
    </div>

    <!-- 角色新增/编辑 -->
    <role-modal ref="modal" @on-success="getRoles()" />
  </div>
</template>

<script>
import { getRoles, getMenus, updateRole, deleteRole } from "@/api/system";
import RoleModal from "./components/RoleModal";

export default {
  name: "Role",

  components: {
    RoleModal,
  },

  data() {
    return {
      loading: false,
      height: 400,
      role: {
        id: null,
        name: "",
        sort: 0,
        menu_ids: [],
        desc: "",
      },
      roles: [],
      menus: [],
      menusLoading: false,

      submitLoading: false,
    };
  },

  mounted() {
    this.getRoles();
    this.getMenus();
  },

  methods: {
    // 获取有层级关系的菜单列表(value label 格式)
    async getMenus() {
      this.menusLoading = true;
      const { code, data } = await getMenus({ type: "simple" });
      this.menusLoading = false;

      if (code === 200) {
        this.menus = data;
      }
    },

    // 获取角色列表
    async getRoles() {
      this.loading = true;
      const { code, data } = await getRoles();
      this.loading = false;

      if (code === 200) {
        this.roles = data;

        if (data.length) {
          this.$refs.roleRef.setCurrentRow(data[0]);
        }
      }
    },

    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 删除菜单
    async deleteRole(row) {
      await this.$confirm("确定要删除该菜单吗?", "提示", {
        type: "warning",
      });

      const { code } = await deleteRole(row.id);
      if (code === 200) {
        this.getRoles();
      }
    },

    //
    handleRoleChange(row) {
      this.role = row;
      this.$refs.tree.setCheckedKeys(row.menu_ids);
    },

    // 更新角色菜单
    async updateRoleMenus() {
      let params = Object.assign({}, this.role);

      params.menu_ids = this.$refs.tree.getCheckedKeys();

      this.submitLoading = true;
      const { code } = await updateRole(this.role.id, params);
      this.submitLoading = false;

      if (code === 200) {
        this.getRoles();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.role-container {
  display: block;
  width: 100%;
  .role {
    margin: 20px auto;
    padding: 10px 15px;
    width: 820px;
    .role-list {
      display: inline-block;
      width: 360px;
      .sub-header {
        height: 44px;
        text-align: right;
      }
    }
    .menu-list {
      display: inline-block;
      margin-top: 44px;
      margin-left: 60px;
      padding: 0 15px 40px;
      width: 360px;
      height: calc(100vh - 260px);
      overflow-y: scroll;
    }
  }
  .save-btn {
    width: 100%;
    text-align: center;
  }
}
</style>