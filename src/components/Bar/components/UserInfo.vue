<template>
  <el-dialog
    title="个人信息"
    width="540px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="close"
  >
    <div class="content">
      <el-form :model="form" :rules="rules" ref="form" label-width="90px">
        <el-form-item label="账号：">
          <div>{{ form.account }}</div>
        </el-form-item>

        <el-form-item label="昵称：" prop="nickname">
          <el-input
            v-model="form.nickname"
            :maxlength="12"
            placeholder="请输入昵称（2-12字符）"
          />
        </el-form-item>

        <el-form-item label="头像：" prop="avatar">
          <el-input v-model="form.avatar" class="hidden" />
          <div class="avatar-wrapper" @click="chosenFileHandle">
            <img class="avatar" v-if="form.avatar" :src="form.avatar" />
            <i class="el-icon-plus icon" v-else></i>
            <div class="edit">头像编辑</div>
          </div>
        </el-form-item>

        <el-form-item label="生日：">
          <el-date-picker
            style="width: 100%"
            v-model="form.birthday"
            type="date"
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>

        <el-form-item label="有效期至：">
          <div>
            <span>{{ form.deadline_at }}</span>
            <span style="color: #67c23a"
              >（{{ form.deadline_at | dateDiff }}）</span
            >
          </div>
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

    <!-- 头像图片选择 -->
    <input
      type="file"
      name="file"
      accept="image/*"
      ref="fileInput"
      class="upload-input"
      @change="fileChangeHandle"
    />

    <!-- 头像上传 -->
    <el-dialog
      title="头像上传"
      :visible.sync="isShowAvatar"
      width="440px"
      append-to-body
    >
      <div class="crop-image">
        <crop-image
          ref="cropImage"
          @on-change="submitAvatar"
          :img="avatarImg"
        />
      </div>
      <span slot="footer">
        <el-button @click="isShowAvatar = false">取 消</el-button>
        <el-button type="primary" @click="cropImage()" :loading="uploading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import CropImage from "./CropImage";
import { modal } from "@/mixins/modal";
import { updateAdmin } from "@/api/admin";
import { getQiniuUpToken } from "@/api/api";
import { mapState } from "vuex";
import * as qiniu from "qiniu-js";

export default {
  name: "UserInfo",

  mixins: [modal],

  components: {
    CropImage,
  },

  data() {
    return {
      rules: {
        avatar: [{ required: true, message: "请上传头像", trigger: "blur" }],
        nickname: [
          { required: true, message: "请填写昵称", trigger: "blur" },
          {
            min: 2,
            max: 12,
            message: "长度在 2 到 12 个字符",
            trigger: "blur",
          },
        ],
      },

      form: {
        account: "",
        avatar: "",
        nickname: "",
        birthday: "",
        deadline_at: "",
      },

      isShowAvatar: false,
      avatarImg: null,
      uploading: false,
    };
  },

  computed: {
    ...mapState({
      admin: (state) => state.user.admin,
    }),
    diffDay() {
      return this.$Util.dateDiff(this.form.deadline_at);
    },
  },

  methods: {
    // 更新管理员信息
    async submit() {
      let params = {
        avatar: this.form.avatar,
        nickname: this.form.nickname,
        birthday: this.form.birthday,
      };

      const { code } = await updateAdmin(params);

      if (code === 200) {
        const admin = Object.assign(this.admin, params);
        this.$store.commit("user/SET_ADMIN", admin);

        this.$emit("on-success");
        this.visible = false;
      }
    },

    // 触发选择文件事件
    chosenFileHandle() {
      this.avatarImg = "";

      let evt = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      this.$refs.fileInput.dispatchEvent(evt);
    },

    // 选择图片
    fileChangeHandle(evt) {
      if (!evt.target.files || !evt.target.files[0]) return;

      const file = evt.target.files[0];

      if (file.size > 1024 * 1024 * 10) {
        this.$message.warning("头像图片不能超过 10MB");
        return;
      }

      if (file.size < 1024 * 2) {
        this.$message.warning("头像图片不能小于 2KB");
        return;
      }

      let url = URL.createObjectURL(file);

      let img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
      };

      this.isShowAvatar = true;
      this.avatarImg = url;
    },

    cropImage() {
      this.$refs.cropImage.clipImage();
    },

    submitAvatar(file) {
      this.handleInsertImg(file);
    },

    // 头像上传
    async handleInsertImg(file) {
      this.uploading = true;

      const { code, data } = await getQiniuUpToken({ category: "image" });

      if (code === 200) {
        const token = data;
        const key = null;
        const putExtra = {
          fname: "",
          params: {
            "x:category": "image",
          },
          mimeType: ["image/png", "image/jpeg", "image/gif"],
        };
        const config = {
          useCdnDomain: true, //使用cdn加速
        };
        const observable = qiniu.upload(file, key, token, putExtra, config);

        observable.subscribe({
          next: (result) => {
            // 主要用来展示进度
            // console.warn(result);
          },
          error: (err) => {
            this.$message.error(err.code + " 上传图片失败");
            this.uploading = false;
          },

          complete: ({ url }) => {
            this.isShowAvatar = false;

            this.uploading = false;

            this.form.avatar = url;
          },
        });
      } else {
        this.uploading = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  padding: 0 60px 0 40px;
  .avatar-wrapper {
    position: relative;
    width: 120px;
    height: 120px;
    background: #f5f5f5;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      cursor: pointer;
      .edit {
        visibility: visible;
        opacity: 1;
      }
      .icon {
        color: #444;
      }
    }
    .avatar {
      width: 120px;
      height: 120px;
    }
    .icon {
      font-size: 36px;
      color: #999;
    }

    .edit {
      opacity: 0;
      visibility: hidden;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      color: #fff;
      text-align: center;
      background: rgba(#000, 0.65);
      transition: visibility 0.2s, opacity 0.2s;
    }
  }
}

.upload-input {
  display: none;
}
</style>