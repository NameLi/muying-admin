<template>
  <el-dialog
    title="用户设置"
    width="540px"
    :visible.sync="visible"
    @close="close()"
  >
    <el-form
      :model="form"
      ref="form"
      label-width="200px"
      style="padding: 0 40px; user-select: none"
    >
      <set-item
        v-model="all"
        label="禁止所有操作"
        explain="开启后用户只有浏览权限"
      />
      <set-item
        v-model="form.movie"
        label="禁止添加/更新影视信息"
        explain="开启后用户不可添加或更新影视信息"
      />
      <set-item
        v-model="form.actor"
        label="禁止添加/更新影人信息"
        explain="开启后用户不可添加或更新影人信息"
      />
      <set-item
        v-model="form.role"
        label="禁止添加/更新角色信息"
        explain="开启后用户不可添加或更新角色信息"
      />
      <set-item
        v-model="form.photo"
        label="禁止上传照片"
        explain="开启后用户不可上传任何影视/影人/角色照片"
      />
      <set-item
        v-model="form.video"
        label="禁止上传短视频"
        explain="开启后用户不可上传短视频"
      />
      <set-item
        v-model="form.rate"
        label="禁止对影视评分"
        explain="开启后用户不可对影视评分"
      />
      <set-item
        v-model="form.comment"
        label="禁止发布影评/评论"
        explain="开启后用户不可发布影评或评论"
      />
    </el-form>

    <div slot="footer">
      <m-button type="cancel" @click="visible = false" />
      <m-button type="submit" @click="submitForm()" :loading="submitLoading" />
    </div>
  </el-dialog>
</template>

<script>
import { updateUserSet } from "@/api/user";
import { modal } from "@/mixins/modal";
import SetItem from "./SetItem";
import SetDate from "./SetItem";

export default {
  name: "UserSet",

  components: {
    SetItem,
    SetDate,
  },

  mixins: [modal],

  data() {
    return {
      id: null,
      all: 0,
      form: {
        movie: 0,
        actor: 0,
        role: 0,
        photo: 0,
        video: 0,
        rate: 0,
        comment: 0,
      },
    };
  },

  watch: {
    all(val) {
      if (val === 0) {
        this.$refs["form"].resetFields();
      }
    },
  },

  methods: {
    open(row) {
      this.id = row.id;

      // 编辑数据回显
      if (row.auth) {
        this.form = Object.assign(this.form, row.auth);
      }

      this.visible = true;
    },

    async submit() {
      return await updateUserSet(this.id, { auth: this.form });
    },
  },
};
</script>