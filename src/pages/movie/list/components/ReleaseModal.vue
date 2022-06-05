<template>
  <el-dialog
    title="上映状态(中国大陆)"
    width="520px"
    :visible.sync="visible"
    @close="close()"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
      class="form"
    >
      <el-form-item label="上映状态：" prop="release_status">
        <el-radio-group v-model="form.release_status">
          <el-radio :label="0">未上映</el-radio>
          <el-radio :label="1">即将上映</el-radio>
          <el-radio :label="2">正在热映</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="上映日期：" prop="release_date">
        <el-input
          v-model="form.release_date"
          clearable
          placeholder="例：2021-12-01"
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
import { updateMovieRelease } from "@/api/movie";
import { modal } from "@/mixins/modal";

export default {
  name: "ReleaseModal",

  mixins: [modal],

  data() {
    var validateDate = (rule, value, callback) => {

      if (this.form.release_status === 1) {
        if (!value) {
          return callback(new Error("上映日期不能为空"));
        }
      }

      if (!value) {
        return callback();
      }

      let timeList = value.split("-");
      let tLen = timeList.length;

      for (let item of timeList) {
        if (isNaN(item)) {
          return callback(new Error("日期格式不正确，例：2020-12-01"));
        }
      }

      let len = value.length;

      console.log(len)
      console.log(tLen)

      if (
        (len === 4 && tLen === 1 && timeList[0] > 2000 && timeList[0] < 2030) ||
        (len === 7 &&
          tLen === 2 &&
          timeList[0] > 2000 &&
          timeList[0] < 2030 &&
          timeList[1] >= 0 &&
          timeList[1] <= 12) ||
        (len === 10 &&
          tLen === 3 &&
          timeList[0] > 2000 &&
          timeList[0] < 2030 &&
          timeList[1] >= 0 &&
          timeList[1] <= 12 &&
          timeList[2] >= 0 &&
          timeList[2] <= 31)
      ) {
        return callback();
      } else {
        return callback(new Error("日期格式不正确，例：2020-12-01"));
      }
    };
    return {
      form: {
        id: null,
        release_status: 0,
        release_date: "",
      },
      rules: {
        release_status: [
          { required: true, message: "请选择上映状态", trigger: "change" },
        ],
        release_date: [{ validator: validateDate, trigger: "blur" }],
      },
    };
  },

  methods: {
    open(row) {
      this.form = Object.assign(this.form, {
        id: row.id,
        release_status: row.release_status,
        release_date: row.release_date,
      });
      this.visible = true;
    },

    async submit() {
      return await updateMovieRelease(this.form.id, this.form);
    },
  },
};
</script>

<style scoped lang="scss">
.form {
  padding: 28px 20px 10px;
  user-select: none;
  ::v-deep .el-radio {
    padding: 9px 0;
  }
}
</style>