<template>
  <el-dialog
    title="视频审核"
    width="460px"
    custom-class="verify-dialog"
    top="50vh"
    :visible.sync="visible"
    :modal-append-to-body="modalAppendToBody"
    :append-to-body="appendToBody"
    :close-on-click-modal="false"
    :modal="modal"
    @close="close"
  >
    <div class="content">
      <el-form :model="form" status-icon :rules="rules" ref="form">
        <el-form-item prop="status">
          <el-radio-group v-model="form.status" style="width: 100%">
            <div
              class="reason-item"
              v-for="status in statusList"
              :key="status.value"
            >
              <el-radio :label="status.value">{{ status.label }}</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="mark">
          <el-input
            ref="brief"
            type="textarea"
            v-model.trim="form.mark"
            :autosize="{ minRows: 4, maxRows: 5 }"
            maxlength="100"
            show-word-limit
            clearable
            :placeholder="placeholder"
          />
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button
        type="submit"
        @click="submitForm('form')"
        :loading="submitLoading"
      />
    </div>
  </el-dialog>
</template>

<script>
import { updateVideoStatus } from "@/api/video";
import { modal } from "@/mixins/modal";

export default {
  name: "VideoStatusModal",
  mixins: [modal],

  props: {
    modal: {
      type: Boolean,
      default: true,
    },
    modalAppendToBody: {
      type: Boolean,
      default: false,
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    var checkMark = (rule, value, callback) => {
      if (this.form.reason - 1 && value === "") {
        callback(new Error("请填写删除原因"));
      } else {
        callback();
      }
    };

    return {
      rules: {
        status: [
          { required: true, message: "请选择审核是否通过", trigger: "change" },
        ],
        mark: [
          { validator: checkMark, trigger: "blur" },
          {
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur",
          },
        ],
      },

      statusList: [
        {
          label: "通过",
          value: 1,
        },
        {
          label: "不通过",
          value: -1,
        },
      ],

      form: {
        status: null,
        mark: "",
      },
      id: null,
    };
  },

  computed: {
    placeholder() {
      return this.form.status === -1 ? "不通过原因 (必填)" : "审核备注 (选填)";
    },
  },

  methods: {
    /**
     * @desc 审核接口与参数
     * @param {Number} id         删除资源 id
     */
    open(id) {
      if (!id) {
        throw new Error("video verify requst params id can not be null");
      }

      this.id = id;

      this.visible = true;
    },

    async submit() {
      return await updateVideoStatus(this.id, this.form);
    },
  },
};
</script>

<style lang="scss">
.verify-dialog {
  margin-top: 50vh;
  transform: translateY(-50%);
}
</style>

<style scoped lang="scss">
.content {
  padding: 10px 20px 0;
  .reason-item {
    width: 100%;
    border-bottom: 1px solid #f6f6f6;
    &:last-child {
      border: 0;
    }
    ::v-deep .el-radio {
      width: 100%;
      display: block;
      padding: 12px;
      box-sizing: border-box;
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}
</style>