<!-- 新增影人信息，需要豆瓣ID -->

<template>
  <el-dialog
    title="新增影人"
    width="520px"
    :visible.sync="visible"
    @close="close()"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="110px"
      style="user-select: none"
    >
      <el-form-item label="影人名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入影人姓名" />
      </el-form-item>
      <el-form-item label="豆瓣编号：" prop="douban_id">
        <el-input v-model="form.douban_id" placeholder="请输入豆瓣编号" />
      </el-form-item>
      <el-form-item label="IMDB编号：" prop="imdb_id">
        <el-input
          v-model="form.imdb_id"
          placeholder="请输入IMDB编号（例：nm0000375）"
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
import { createActor } from "@/api/actor";
import { modal } from "@/mixins/modal";

export default {
  name: "ActorModal",

  mixins: [modal],

  data() {
    const validateImdbId = (rule, value, callback) => {
      if (value && !value.startsWith("nm")) {
        callback(new Error("IMDB影人编号为 nm 开头的 9~10 位字符串"));
      } else {
        callback();
      }
    };

    return {
      rules: {
        name: [
          { required: true, message: "请输入影人姓名", trigger: "blur" },
          {
            min: 1,
            max: 32,
            message: "影人姓名为 1-32 个字符",
            trigger: "blur",
          },
        ],
        imdb_id: [{ validator: validateImdbId, trigger: "blur" }],
        douban_id: [
          { required: true, message: "请输入豆瓣编号", trigger: "blur" },
          {
            min: 7,
            max: 10,
            message: "豆瓣编号为 7~10 位数字",
            trigger: "blur",
          },
        ],
      },

      form: {
        name: "",
        imdb_id: "",
        douban_id: "",
      },
    };
  },

  methods: {
    // 创建影人ID信息
    async submit() {
      this.submitLoading = true;
      const { code, data } = await createActor(this.form);
      this.submitLoading = false;

      if (code === 200) {
        this.$emit("on-success");
        this.visible = false;

        // 跳转到影人详情页补充影人详细信息
        this.$router.push({ name: "ActorDetailInfo", params: { id: data.id } });
      }
    },
  },
};
</script>