<template>
  <el-dialog
    title="新增文章"
    width="520px"
    :visible.sync="visible"
    @close="close()"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="110px"
      style="user-select: none; padding: 0 40px 0 20px"
    >
      <el-form-item label="文章标题：" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题" />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button type="submit" @click="submitForm()" :loading="submitLoading" />
    </div>
  </el-dialog>
</template>

<script>
import { createArticle } from "@/api/article";
import { modal } from "@/mixins/modal";

export default {
  name: "CreateModal",

  mixins: [modal],
  
  data() {
    return {
      rules: {
        title: [
          { required: true, message: "请输入影视名称", trigger: "blur" },
          {
            min: 1,
            max: 32,
            message: "影视名称为 1-32 个字符",
            trigger: "blur",
          },
        ],
      },

      form: {
        title: "",
      },
    };
  },

  methods: {
    // 创建文章标题
    async submit() {
      const { code, data } = await createArticle(this.form);

      if (code === 200) {
        this.$emit("on-success");
        this.visible = false;

        // 创建成功后跳转文章详情页
        this.$router.push({ name: "ArticleDetailContent", params: { id: data.id } });
      }
    },
  },
};
</script>