<template>
  <el-dialog
    :title="isEdit ? '编辑菜单' : '新建菜单'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="680px"
    @close="close"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="90px"
      style="padding: 0 20px"
    >
      <el-form-item label="菜单名称" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入菜单名称，限制2~16字符"
        />
      </el-form-item>

      <el-form-item label="路由地址" prop="path">
        <el-input
          v-model="form.path"
          placeholder="请输入路由地址，限制2~64字符"
        />
      </el-form-item>

      <el-form-item label="组件名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入路由名称，限制2~32字符"
        />
      </el-form-item>

      <el-form-item label="组件地址" prop="component">
        <el-input
          v-model="form.component"
          placeholder="请输入组件地址，限制2~64字符"
        />
      </el-form-item>

      <el-form-item label="菜单图标" prop="icon">
        <icon-select
          v-model="form.icon"
          :color="form.color"
          placeholder="请选择图标（主目录必须选择）"
        />
      </el-form-item>

      <el-form-item label="图标颜色" prop="color">
        <el-input v-model="form.color" placeholder="请输入图标颜色" />
      </el-form-item>

      <el-form-item label="排序" prop="sort">
        <el-input
          type="number"
          v-model.number="form.sort"
          placeholder="默认值为0，最大值为255"
        />
      </el-form-item>

      <el-form-item label="是否跳转" prop="redirect">
        <el-switch
          v-model="form.redirect"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>

      <el-form-item label="是否缓存" prop="cache">
        <el-switch v-model="form.cache" :active-value="1" :inactive-value="0" />
      </el-form-item>

      <el-form-item label="父级菜单" prop="pids">
        <el-cascader
          :key="Math.random()"
          placeholder="请选择父级菜单"
          style="width: 100%"
          v-model="form.pids"
          :options="formMenus"
          filterable
          :props="{ checkStrictly: true }"
        />
      </el-form-item>

      <el-form-item label="描述" prop="brief">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
          v-model="form.brief"
          show-word-limit
          maxlength="100"
          placeholder="菜单描述"
        />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button type="submit" @click="submitForm()" :loading="submitLoading" />
    </div>
  </el-dialog>
</template>

<script>
import { getMenus, createMenu, updateMenu } from "@/api/system";
import { modal } from "@/mixins/modal";
import IconSelect from "./IconSelect";

export default {
  name: "MenuModal",

  components: {
    IconSelect,
  },

  mixins: [modal],

  data() {
    return {
      menusLoading: false,
      formMenus: [],
      rules: {
        title: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符",
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "请输入路由名称", trigger: "blur" },
          {
            min: 2,
            max: 32,
            message: "长度在 2 到 32 个字符",
            trigger: "blur",
          },
        ],
        path: [
          { required: true, message: "请输入路由地址", trigger: "blur" },
          {
            min: 2,
            max: 64,
            message: "长度在 2 到 64 个字符",
            trigger: "blur",
          },
        ],
        component: [
          { required: true, message: "请输入组件地址", trigger: "blur" },
          {
            min: 2,
            max: 64,
            message: "长度在 2 到 64 个字符",
            trigger: "blur",
          },
        ],
        sort: [
          {
            type: "number",
            message: "取值范围为0~255，数值越小排序越靠前",
            trigger: "blur",
          },
        ],
        pids: [{ required: true, message: "请选择父菜单", trigger: "change" }],
        brief: [
          { max: 100, message: "描述不能超过 100 个字符", trigger: "blur" },
        ],
      },

      form: {
        id: null,
        title: "",
        name: "",
        path: "",
        component: "",
        icon: "",
        color: "",
        sort: null,
        redirect: 0,
        cache: 0,
        pids: [],
        brief: "",
      },
    };
  },

  watch: {
    visible(val) {
      val && this.getFormMenus();
    },
  },

  methods: {
    // 获取有层级关系的菜单列表(value label 格式)
    async getFormMenus() {
      this.menusLoading = true;
      const { code, data } = await getMenus({ type: "simple" });
      this.menusLoading = false;

      if (code === 200) {
        this.formMenus = data;
      }
    },

    async submit() {
      return this.isEdit
        ? await updateMenu(this.form.id, this.form)
        : await createMenu(this.form);
    },
  },
};
</script>

<style scoped lang="scss">
.select-icon {
  float: left;
  color: $color-theme;
}
.select-value {
  float: right;
  color: #8492a6;
  font-size: 13px;
}
</style>