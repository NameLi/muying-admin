<template>
  <el-dialog
    title="影片设置"
    width="520px"
    :visible.sync="visible"
    @close="close()"
    :modal-append-to-body="modalAppendToBody"
    :append-to-body="appendToBody"
    :modal="modal"
  >
    <el-form :model="form" ref="form" label-width="100px" class="form">
      <el-form-item label="影人状态：" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio
            v-for="item in statusList"
            :label="item.value"
            :key="item.value"
            >{{ item.label }} ({{ item.value }})</el-radio
          >
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button
        type="submit"
        @click="submitForm()"
        :loading="submitLoading"
        :disabled="disabled"
      />
    </div>
  </el-dialog>
</template>

<script>
import { updateActorStatus } from "@/api/actor";
import { modal } from "@/mixins/modal";
import STATUS_LIST from "@/config/status";

export default {
  name: "CommonStatus",

  mixins: [modal],

  props: {
    type: {
      required: true,
      type: String,
      validator(val) {
        return [
          "movie",
          "actor",
          "role",
          "video",
          "review",
          "comment",
          "article",
          "award",
          "country",
        ].includes(val);
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
      disabled: true,
      form: {
        status: 0,
      },
    };
  },

  computed: {
    statusList() {
      return STATUS_LIST[this.type];
    },
  },

  watch: {
    "form.status"(val) {
      this.disabled = false;
    },
  },

  methods: {
    async submit() {
      let params = {
        status: this.form.status,
      };

      let request = null;

      switch (this.type) {
        case "movie":
          request = deleteMovie;
          break;

        case "actor":
          request = updateActorStatus;
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
      }

      return await request(this.form.id, params);
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