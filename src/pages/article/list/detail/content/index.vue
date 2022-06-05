<template>
  <div class="article-container" v-loading="loading">
    <!-- 编辑 -->
    <div class="article-content" v-if="isEdit">
      <el-form :model="form" :rules="rules" ref="form">
        <!-- 封面图 -->
        <el-form-item prop="cover">
          <div class="cover-upload">
            <image-upload
              :url.sync="form.cover"
              :id="form.id"
              height="190px"
              category="image"
              type="article"
              icon="el-icon-camera-solid"
            />
            <el-input v-model="form.cover" style="display: none" />
          </div>
        </el-form-item>

        <el-form-item prop="title">
          <el-input
            class="title"
            size="medium"
            v-model="form.title"
            maxlength="60"
            show-word-limit
            placeholder="请填写标题"
          />
        </el-form-item>

        <el-form-item>
          <!-- 内容 -->
          <wang-editor class="content" ref="editor" v-model="form.content" />
        </el-form-item>

        <el-form-item label="首页推荐：">
          <el-radio-group v-model="form.is_recomment">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item style="text-align: right; padding-bottom: 20px">
          <m-button type="submit" :loading="submitLoading" @click="submitForm()"
            >保 存</m-button
          >
        </el-form-item>
      </el-form>
    </div>

    <!-- 浏览 -->
    <div class="article-content" v-else>
      <h3 class="article-title">{{ form.title }}</h3>
      <div class="article-info">发布于：{{ form.created_at }}</div>

      <div class="content" v-html="form.content"></div>
    </div>
  </div>
</template>

<script>
import { getArticle, updateArticle } from "@/api/article";
import WangEditor from "@/components/Plug/Editor"; // wangEditor

export default {
  name: "ArticleDetailContent",

  components: {
    WangEditor,
  },

  inject: ["id"],

  data() {
    return {
      loading: false,
      submitLoading: false,
      isEdit: true,
      form: {
        cover: "",
        title: "",
        subtitle: "",
        tags: [],
        content: "",
      },
      rules: {
        cover: [{ required: true, message: "请选择封面", trigger: "blur" }],
        title: [
          { required: true, message: "请填写标题", trigger: "blur" },
          {
            min: 2,
            max: 60,
            message: "长度在 2 到 60 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {
    this.getArtcile();
  },

  methods: {
    // 获取文章信息
    async getArtcile() {
      this.loading = true;
      const { code, data } = await getArticle(this.id);
      this.loading = false;

      if (code === 200) {
        this.form = data;
      }
    },

    // 更新文章
    async submitForm() {
      this.submitLoading = true;
      const { code } = await updateArticle(this.id, this.form);
      this.submitLoading = false;

      if (code === 200) {
        this.getArtcile();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.article-container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #f6f6f6;
  .article-content {
    margin: 20px 0;
    width: 650px;
  }
  .cover-upload {
    width: 100%;
    min-height: 190px;
    ::v-deep .upload-wrapper {
      width: 100%;
      min-height: 190px;
      height: auto;
      background-color: #fff;
      .upload-preview {
        font-size: 0;
        .image {
          width: 100%;
          height: auto;
          max-width: 100%;
          max-height: 100%;
          .el-image__inner {
            width: 650px;
          }
        }
      }
      .upload-icon {
        border: none;
      }
    }
  }

  .article-title {
    font-size: 22px;
    font-weight: bold;
    line-height: 1.4;
    margin-bottom: 14px;
  }
  .article-info {
    margin-bottom: 16px;
    color: #999;
    font-size: 14px;
    text-align: right;
  }
  .article-content {
    ::v-deep .subject-card-delete {
      display: none;
    }
  }
}
</style>