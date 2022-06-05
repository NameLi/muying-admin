<template>
  <el-dialog
    :title="isEdit ? '更新奖项' : '新增奖项'"
    :visible.sync="visible"
    width="680px"
    :append-to-body="appendToBody"
    :close-on-click-modal="false"
    @close="close"
  >
    <el-form
      class="modal-container"
      label-width="100px"
      :model="form"
      :rules="rules"
      ref="form"
      v-loading="loading"
    >
      <el-form-item label="奖项名称：" prop="title">
        <el-input v-model="form.title" placeholder="请填写奖项名称" />
      </el-form-item>

      <el-form-item label="奖项名称：" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请填写奖项英文名称，用于客户端 url 参数"
        />
      </el-form-item>

      <el-form-item label="所属类别：" prop="categories">
        <m-select
          v-model="form.categories"
          :options="categories"
          allow-create
          filterable
          multiple
          size="small"
          style="width: 100%"
          placeholder="请选择所属类别"
        />
      </el-form-item>

      <el-form-item label="奖项封面：" prop="poster">
        <image-upload
          :url.sync="form.poster"
          category="award"
          type="poster"
          :id="form.id"
        />
        <el-input style="display: none" v-model="form.poster" />
      </el-form-item>

      <el-form-item label="奖项英文名：" prop="title_en">
        <el-input v-model="form.title_en" placeholder="请填写奖项英文名" />
      </el-form-item>

      <el-form-item label="奖项全名：" prop="subtitle">
        <el-input v-model="form.subtitle" placeholder="请填写奖项全名" />
      </el-form-item>

      <el-form-item label="奖项别名：" prop="akas">
        <el-input v-model="form.akas" placeholder="别名，多个用 , 分隔" />
      </el-form-item>

      <el-form-item label="所属国家：" prop="country">
        <remote-select
          v-model="form.country_id"
          :options="countries"
          type="country"
          placeholder="请选择奖项所属国家/地区"
        />
      </el-form-item>

      <el-form-item label="起始年代：" prop="year">
        <el-input v-model.number="form.year" placeholder="请填写起始年代" />
      </el-form-item>

      <el-form-item label="官方网站：" prop="website">
        <el-input v-model="form.website" placeholder="请填写奖项官网" />
      </el-form-item>

      <el-form-item label="奖项简介：">
        <el-input
          :autosize="{ minRows: 8, maxRows: 20 }"
          v-model="form.brief"
          type="textarea"
          maxlength="2000"
          show-word-limit
          placeholder="奖项简介"
        />
      </el-form-item>

      <el-form-item label="是否展示：">
        <el-switch
          v-model="form.status"
          :active-value="0"
          :inactive-value="1"
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
import { createAward, updateAward } from "@/api/award";
import { modal } from "@/mixins/modal";

const rules = {
  title: [
    { required: true, message: "请输入奖项名称", trigger: "blur" },
    { min: 1, max: 16, message: "长度在 1 到 16 个字符", trigger: "blur" },
  ],
  name: [
    {
      required: true,
      message: "请填写奖项英文名称，用于客户端 url 参数",
      trigger: "blur",
    },
    { min: 2, max: 16, message: "长度在 2 到 16 个字符", trigger: "blur" },
  ],
  title_en: [
    { min: 1, max: 128, message: "长度在 1 到 128 个字符", trigger: "blur" },
  ],
  subtitle: [
    { min: 1, max: 128, message: "长度在 1 到 128 个字符", trigger: "blur" },
  ],
  // poster: [{ required: true, message: "请上传封面", trigger: "blur" }],
  akas: [
    { min: 1, max: 128, message: "长度在 1 到 128 个字符", trigger: "blur" },
  ],
  website: [
    { min: 10, max: 64, message: "长度在 10 到 64 个字符", trigger: "blur" },
  ],
  brief: [
    { min: 2, max: 1000, message: "长度在 20 到 1000 个字符", trigger: "blur" },
  ],
};

export default {
  name: "AwardModal",

  mixins: [modal],

  data() {
    return {
      rules,
      form: {
        id: null,
        title: "",
        title_en: "",
        name: "",
        subtitle: "",
        country: "",
        year: null,
        categroy: "",
        akas: "",
        poster: "",
        brief: "",
        status: 0,
      },
      countries: [],
      categories: ["电影", "动画", "纪录片", "电视剧", "综艺"],
    };
  },

  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    open(award) {
      if (award) {
        this.form = Object.assign(award);
        this.isEdit = true;

        this.countries = [award.country];
      }
      this.visible = true;
    },

    async submit() {
      return this.isEdit
        ? await updateAward(this.form.id, this.form)
        : await createAward(this.form);
    },
  },
};
</script>

<style scoped lang="scss">
.modal-container {
  padding: 10px 30px 0;
}
</style>