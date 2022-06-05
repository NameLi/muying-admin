<template>
  <el-dialog
    title="删除原因"
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
      <el-form :model="form" status-icon :rules="rules" ref="form">
        <!-- 删除原因快捷操作(部分类型有) -->
        <el-form-item prop="reason" v-if="isShowRadio">
          <el-radio-group v-model="form.reason" style="width: 100%">
            <div
              class="reason-item"
              v-for="reason in reasons"
              :key="reason.value"
            >
              <el-radio :label="reason.value">{{ reason.label }}</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>

        <!-- 删除原因，不显示 radio 的此项必填 -->
        <el-form-item prop="mark">
          <el-input
            ref="brief"
            type="textarea"
            v-model.trim="form.mark"
            :autosize="{ minRows: 4, maxRows: 5 }"
            maxlength="100"
            show-word-limit
            clearable
            :placeholder="
              form.reason === 9 || !isShowRadio
                ? '删除原因 (必填)'
                : '删除原因 (选填)'
            "
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
/**
 * 删除资源原因选择 modal
 *
 * */

import { deleteComment } from "@/api/comment";
import { deleteMovie } from "@/api/movie";
import { deleteReview } from "@/api/review";
import { deleteActor } from "@/api/actor";
import { deleteVideo } from "@/api/video";
import { deleteRole } from "@/api/role";
import { deletePhoto } from "@/api/photo";
import { deleteArticle } from "@/api/article";
import { deleteCountry } from "@/api/basic";

import DELETE_REASONS from "@/config/delete";
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
  name: "DeleteModal",
  mixins: [modal],

  props: {
    type: {
      type: String,
      validator(val) {
        return DELETE_TYPES.includes(val);
      },
    },
    delete: {
      type: Function,
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
    var checkMark = (rule, value, callback) => {
      if ((this.form.reason === 9 || !this.isShowRadio) && value === "") {
        callback(new Error("请填写删除原因"));
      } else {
        callback();
      }
    };

    return {
      rules: {
        reason: [
          { required: true, message: "请选择删除原因", trigger: "change" },
        ],
        mark: [
          { validator: checkMark, trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur",
          },
        ],
      },

      form: {
        reason: null,
        mark: "",
      },

      request: null,
      id: null,
      sub_id: null,
      child_id: null,
      args: null,
    };
  },

  computed: {
    reasons() {
      return DELETE_REASONS[this.type];
    },
    isShowRadio() {
      return DELETE_TYPES.includes(this.type);
    },
  },

  methods: {
    /**
     * @desc 删除接口与参数
     * @param {Any} arg1
     * @param {Any} [arg2]
     * @param {Any} [args]
     */
    open(arg1, arg2, ...args) {
      // 没有参数时
      if (arguments.length === 0) {
        console.error("arguments can not be null");
        return;
      }

      // 只有一个参数，且参数类型为 number/array, 并且 type 在枚举参数中
      if (arguments.length === 1 && DELETE_TYPES.includes(this.type)) {
        this.request = null;
        this.id = arg1;

        // 有多个参数时，第一个参数需为 request function，第二个参数需为 id
      } else {
        if (typeof arg1 !== "function") {
          console.error("arguments[0] must be a function");
        }

        this.request = arg1;
        this.id = arg2;
        this.args = args;
      }

      this.submitLoading = false;

      this.visible = true;
    },

    async submit() {
      let params = {
        delete_status: this.form.reason,
        mark: this.form.mark,
      };

      let request = this.request;

      if (!request) {
        switch (this.type) {
          case "movie":
            request = deleteMovie;
            break;

          case "actor":
            request = deleteActor;
            break;

          case "role":
            request = deleteRole;
            break;

          case "article":
            request = deleteArticle;
            break;

          case "video":
            request = deleteVideo;
            break;

          case "review":
            request = deleteReview;
            break;

          case "comment":
            request = deleteComment;
            break;

          case "photo":
            request = deletePhoto;
            break;

          case "country":
            request = deleteCountry;
            break;

          default:
            request = this.request;
        }
      }

      if (this.args && this.args.length) {
        return await request(this.id, this.args, params);
      } else {
        if (Array.isArray(this.id)) {
          let data = {
            delete: this.id,
            ...params,
          };
          return await request(data);
        } else {
          return await request(this.id, params);
        }
      }
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