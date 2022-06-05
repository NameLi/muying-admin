<template>
  <el-dialog
    title="照片审核"
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
        <!-- 审核快捷操作 -->
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

        <!-- 审核备注，不显示 radio 的此项必填 -->
        <el-form-item prop="mark">
          <el-input
            ref="brief"
            type="textarea"
            v-model.trim="form.mark"
            :autosize="{ minRows: 4, maxRows: 5 }"
            maxlength="100"
            show-word-limit
            clearable
            :placeholder="form.status | placeholder"
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
import { updatePhotoStatus, batchUpdatePhotoStatus } from "@/api/photo";
import { modal } from "@/mixins/modal";

export default {
  name: "PhotoStatusModal",
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
        callback(new Error("请填写审核不通过原因"));
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

      photos: [],
    };
  },

  filters: {
    placeholder(status) {
      let placeholder = "审核备注 (选填)";
      if (status === -1) {
        placeholder = "不通过原因 (必填)";
      }

      return placeholder;
    },
  },

  methods: {
    /**
     * @desc 照片审核接口与参数
     * @param {Object/Array} photo      单个图片或图片组
     */
    open(photos) {
      if (!photos) {
        throw new Error("audit arguments photos can not be null");
      }

      if (!Array.isArray(photos)) {
        photos = [photos];
      }

      if (photos.length === 1) {
        this.form.status = photos[0].status;
        this.form.mark = photos[0].mark;
      }

      this.photos = photos;

      this.visible = true;
    },

    // 提交审核
    async submit() {
      const ids = this.photos.map((p) => p.id);

      if (ids.length > 1) {
        let params = {
          audit: ids,
          ...this.form,
        };

        return await batchUpdatePhotoStatus(params);
      } else {
        return await updatePhotoStatus(ids[0], this.form);
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