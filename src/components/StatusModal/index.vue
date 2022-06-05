<template>
  <el-dialog
    title="状态设置"
    width="460px"
    custom-class="delete-dialog"
    top="50vh"
    :visible.sync="visible"
    :modal-append-to-body="modalAppendToBody"
    :append-to-body="appendToBody"
    :close-on-click-modal="false"
    :modal="modal"
    @close="close"
  >
    <div class="content">
      <el-form :model="form" :disabled="disabled" :rules="rules" ref="form">
        <el-form-item prop="status">
          <el-radio-group v-model="form.status" style="width: 100%">
            <div
              class="radio-item"
              v-for="status in statusList"
              :key="status.value"
            >
              <el-radio :label="status.value"
                >{{ status.label }}
                <span class="tip" v-if="status.value < 0"
                  >（客户端不显示）</span
                >
                <span class="tip" v-else-if="status.value === 1"
                  >（用户只可浏览）</span
                >
              </el-radio>
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
            placeholder="变更备注 (选填)"
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
import STATUS from "@/config/status";
import { modal } from "@/mixins/modal";

const DELETE_TYPES = [
  "movie",
  "actor",
  "role",
  "video",
  "photo",
  "review",
  "comment",
  "article",
  "torrent",
];

export default {
  name: "StatusModal",
  mixins: [modal],

  props: {
    type: {
      type: String,
      validator(val) {
        return DELETE_TYPES.includes(val);
      },
    },
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
    return {
      rules: {
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        mark: [
          {
            max: 100,
            message: "不能超过 100 个字符",
            trigger: "blur",
          },
        ],
      },

      form: {
        status: null,
        mark: "",
      },

      disabled: false,

      request: null,
      id: null,
    };
  },

  computed: {
    statusList() {
      return STATUS[this.type];
    },
  },

  methods: {
    /**
     * @desc 状态接口与参数
     * @param {Function} request  状态设置接口
     */
    open(request, row) {
      if (!DELETE_TYPES.includes(this.type)) {
        if (!request) {
          throw new Error("statue request method can not be null");
        }

        if (!row.id) {
          throw new Error("status requst params id can not be null");
        }
      }

      this.submitLoading = false;
      this.request = request;
      this.id = row.id;
      this.form.status = row.status;

      this.disabled = row.status === -9;

      this.visible = true;
    },

    async submit() {
      let params = {
        status: this.form.status,
        mark: this.form.mark,
      };

      return await this.request(this.id, params);
    },
  },
};
</script>

<style lang="scss">
.delete-dialog {
  margin-top: 50vh;
  transform: translateY(-50%);
}
</style>

<style scoped lang="scss">
.content {
  padding: 10px 20px 0;
  .radio-item {
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
    .tip {
      float: right;
      font-size: 12px;
      line-height: 20px;
      vertical-align: middle;
      color: #999;
    }
  }
}
</style>