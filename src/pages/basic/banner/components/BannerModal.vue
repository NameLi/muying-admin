<template>
  <el-dialog
    :title="isEdit ? '编辑横幅' : '新增横幅'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="600px"
    @close="close"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="110px"
      style="padding: 0 20px"
    >
      <el-form-item label="标题：" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="平台：" prop="platform">
        <el-radio-group v-model="form.platform">
          <el-radio :label="1">移动端</el-radio>
          <el-radio :label="2">网页端</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="详情：" prop="link_type">
        <el-radio-group v-model="form.link_type">
          <el-radio :label="0">无</el-radio>
          <el-radio :label="1">站内地址</el-radio>
          <el-radio :label="2">站外链接</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="链接：" prop="link" v-if="form.link_type">
        <el-input v-model="form.link" placeholder="请输入地址链接" />
      </el-form-item>

      <el-form-item label="图片：" prop="banner">
        <image-upload
          height="80px"
          category="image"
          type="banner"
          :url.sync="form.banner"
          :id="form.id"
        />
        <el-input style="display: none" v-model="form.banner" />
      </el-form-item>

      <el-form-item label="背景色：" prop="bgcolor">
        <div class="bgcolor">
          <div class="bgcolor-picker">
            <el-color-picker size="small" v-model="form.bgcolor" />
          </div>
          <div class="bgcolor-input">
            <el-input
              v-model="form.bgcolor"
              clearable
              placeholder="背景色 16进制 例：#ffffff"
            />
          </div>
        </div>
      </el-form-item>

      <el-form-item label="备注：" prop="mark">
        <el-input
          type="textarea"
          v-model="form.mark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          maxlength="200"
          show-word-limit
          placeholder="备注"
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
import { createBanner, updateBanner } from "@/api/basic";
import { modal } from "@/mixins/modal";

export default {
  name: "BannerModal",

  mixins: [modal],

  data() {
    return {
      rules: {
        title: [
          {
            max: 16,
            message: "长度不能超过 16 个字符",
            trigger: "blur",
          },
        ],
        platform: [
          {
            required: true,
            message: "请选择展示平台",
            trigger: "change",
          },
        ],
        link: [
          {
            min: 8,
            max: 200,
            message: "长度在 8 到 200 个字符",
            trigger: "blur",
          },
        ],
        banner: [
          {
            min: 10,
            max: 200,
            message: "长度在 10 到 200 个字符",
            trigger: "blur",
          },
        ],
        mark: [
          {
            max: 200,
            message: "长度不能超过 200 个字符",
            trigger: "blur",
          },
        ],
      },
      form: {
        id: null,
        title: "",
        platform: null,
        link_type: 0,
        link: "",
        banner: "",
        bgcolor: "",
        mark: "",
      },
    };
  },

  methods: {
    async submit() {
      return this.isEdit
        ? await updateBanner(this.form.id, this.form)
        : await createBanner(this.form);
    },
  },
};
</script>

<style scoped lang="scss">
.bgcolor {
  display: flex;
  .bgcolor-picker {
    ::v-deep .el-color-picker__trigger {
      width: 100px;
      border-color: #dcdfe6;
    }
  }
  .bgcolor-input {
    margin-left: 10px;
    flex: 1;
  }
}
</style>