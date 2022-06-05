<template>
  <el-dialog
    title="新增影视"
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
      <el-form-item label="影视名称：" prop="title">
        <el-input v-model="form.title" placeholder="请输入影视名称" />
      </el-form-item>
      <el-form-item label="豆瓣编号：" prop="douban_id">
        <el-input v-model="form.douban_id" placeholder="请输入豆瓣编号" />
      </el-form-item>
      <el-form-item label="IMDB编号：" prop="imdb_id">
        <el-input v-model="form.imdb_id" placeholder="请输入IMDB编号" />
      </el-form-item>
    </el-form>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button type="submit" @click="submitForm()" :loading="submitLoading" />
    </div>
  </el-dialog>
</template>

<script>
import { createMovie } from "@/api/movie";
import { modal } from "@/mixins/modal";
export default {
  name: "MovieModal",
  mixins: [modal],
  data() {
    const validateImdbId = (rule, value, callback) => {
      if (value && !value.startsWith("tt")) {
        callback(new Error("IMDB编号为 tt 开头的 9 位字符串"));
      } else {
        callback();
      }
    };

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
        imdb_id: [{ validator: validateImdbId, trigger: "blur" }],
        douban_id: [
          { required: true, message: "请输入豆瓣编号", trigger: "blur" },
          {
            min: 7,
            max: 9,
            message: "豆瓣编号是 7-9 位的数字",
            trigger: "blur",
          },
        ],
      },

      form: {
        title: "",
        imdb_id: "",
        douban_id: "",
      },
    };
  },

  methods: {
    async submit() {
      const { code, data } = await createMovie(this.form);

      if (code === 200) {
        this.$emit("on-success");
        this.visible = false;

        this.$router.push({ name: "MovieDetailInfo", params: { id: data.id } });
      }
    },
  },
};
</script>