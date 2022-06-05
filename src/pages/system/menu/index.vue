<template>
  <container-layout :footer="false">
    <template v-slot:header>
      <m-button type="create" @click="showModal()" />
    </template>

    <el-table
      v-loading="loading"
      :data="menus"
      stripe
      border
      size="medium"
      row-key="id"
      height="100%"
    >
      <el-table-column
        prop="title"
        label="菜单名称"
        align="left"
        min-width="120"
      />
      <el-table-column prop="path" label="路由地址" align="left" />
      <el-table-column prop="component" label="组件路径" align="left" />
      <el-table-column prop="name" label="组件名称" align="center" />
      <el-table-column prop="icon" label="菜单图标" align="center">
        <template slot-scope="scope">
          <i
            v-if="scope.row.icon"
            :class="`iconfont icon-${scope.row.icon}`"
            :style="`color:${scope.row.color}`"
          />
        </template>
      </el-table-column>
      <el-table-column prop="redirect_zh" label="是否跳转" align="center" />
      <el-table-column prop="cache_zh" label="是否缓存" align="center" />
      <el-table-column prop="sort" label="排序" align="center" />
      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <m-button type="edit" @click="showModal(scope.row)" />
          <m-button type="delete" @click="deleteMenu(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建/编辑菜单 -->
    <menu-modal ref="modal" @on-success="getMenus()" />
  </container-layout>
</template>

<script>
import { getMenus, deleteMenu } from "@/api/system";
import MenuModal from "./components/MenuModal";

export default {
  name: "SystemMenu",

  components: {
    MenuModal,
  },

  data() {
    return {
      loading: false,
      menus: [],
    };
  },

  mounted() {
    this.getMenus();
  },

  methods: {
    // 获取菜单列表
    async getMenus() {
      this.loading = true;
      const { code, data } = await getMenus();
      this.loading = false;

      if (code === 200) {
        for (let item of data) {
          item.redirect_zh = item.redirect === 1 ? "是" : "";
          item.cache_zh = item.cache === 1 ? "是" : "";
        }

        this.menus = data;
      }
    },

    // 创建/编辑菜单
    showModal(row) {
      this.$refs["modal"].open(row);
    },

    // 删除菜单
    async deleteMenu(row) {
      try {
        await this.$confirm("确定要删除该菜单吗?", "提示", {
          type: "warning",
        });

        const { code } = await deleteMenu(row.id);
        if (code === 200) {
          this.getMenus();
        }
      } catch (error) {}
    },
  },
};
</script>