<template>
  <div class="form">
    <div class="history" @click="showHistory()">历史记录</div>

    <el-form
      label-width="120px"
      v-loading="loading"
      ref="form"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="角色名称：" prop="name">
        <el-input v-model="form.name" placeholder="请填写角色名称" />
      </el-form-item>

      <el-form-item label="角色类型：" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">历史人物</el-radio>
          <el-radio :label="2">虚构人物</el-radio>
          <el-radio :label="3">道具</el-radio>
          <el-radio :label="4">其它</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="角色封面：" prop="avatar">
        <div class="poster-item">
          <el-image
            v-if="form.avatar"
            style="height: 140px"
            fit="contain"
            :src="form.avatar"
            :preview-src-list="[form.avatar]"
          />

          <div class="poster-none" v-else>暂无海报</div>

          <div class="poster-edit" @click="showPhotoWall()">
            {{ form.avatar ? "更换海报" : "选择海报" }}
          </div>
        </div>

        <el-input v-model="form.avatar" style="display: none" />
      </el-form-item>

      <el-form-item label="外文名：" prop="name_en">
        <el-input v-model="form.name_en" placeholder="外文名称" />
      </el-form-item>

      <el-form-item label="别名：" prop="akas">
        <tag-group
          size="larger"
          effect="plain"
          type="info"
          v-model="form.akas"
          placeholder="角色别名"
        />
      </el-form-item>

      <el-row>
        <el-col v-for="item in form.defaults" :key="item.label" :span="12">
          <el-form-item :label="item.label + '：'">
            <el-input
              v-model="item.value"
              :placeholder="item | placeholderFilter"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        label-width="0"
        v-for="(item, idx) in form.extras"
        :key="idx"
      >
        <div class="custome-item">
          <el-input class="label" v-model="item.label" />
          <span class="split">：</span>
          <div class="value">
            <el-input v-model="item.value" />
          </div>
          <el-button type="danger" @click="deleteExtra(idx)">删除</el-button>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button
          style="float: right"
          plain
          icon="el-icon-plus"
          @click="addExtra()"
        >
          添加自定义项
        </el-button>
      </el-form-item>

      <el-form-item label="标签：">
        <tag-group v-model="form.tags" placeholder="角色标签"
          >添加标签</tag-group
        >
      </el-form-item>

      <el-form-item label="角色简介：" prop="brief">
        <el-input
          type="textarea"
          :autosize="{ minRows: 15, maxRows: 20 }"
          v-model="form.brief"
          placeholder="角色简介"
          show-word-limit
          maxlength="1000"
        />
      </el-form-item>

      <el-form-item>
        <div class="submit">
          <el-button
            type="success"
            round
            size="medium"
            :loading="submitLoading"
            @click="updateRole('form')"
            >保 存</el-button
          >
        </div>
      </el-form-item>
    </el-form>

    <!-- 封面选取 -->
    <photo-wall
      ref="photoWallModal"
      type="role"
      @on-change="photoChangeHandle"
    />

    <!-- 历史记录 -->
    <history-modal ref="historyModal" />
  </div>
</template>

<script>
import { getRole, updateRole, getRoleHistories } from "@/api/role";

const rules = {
  name: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    { min: 1, max: 32, message: "长度在 1 到 32 个字符", trigger: "blur" },
  ],
  type: [{ required: true, message: "请选择角色类型", trigger: "change" }],
  brief: [
    {
      max: 1000,
      message: "长度不能超过 1000 个字符",
      trigger: "blur",
    },
  ],
};

const defaults = [
  {
    label: "性别",
    value: "",
  },
  {
    label: "生日",
    value: "",
  },
  {
    label: "年龄",
    value: "",
  },
  {
    label: "血型",
    value: "",
  },
  {
    label: "身高",
    value: "",
  },
  {
    label: "体重",
    value: "",
  },
];

export default {
  name: "RoleInfo",

  inject: ["id"],

  data() {
    return {
      loading: false,
      rules,
      form: {
        id: null,
        type: null,
        role_id: "",
        name: "",
        akas: [],
        avatar: "",
        brief: "",
        type: null,
        defaults, // 默认项
        extras: [], // 附加项
        tags: [],
      },
      submitLoading: false,
    };
  },

  filters: {
    placeholderFilter(item) {
      let placeholder = "";

      switch (item.label) {
        case "性别":
          placeholder = "男 / 女";
          break;
        case "生日":
          placeholder = "例：2020-02-02";
          break;
        case "身高":
          placeholder = "例：1.78米";
          break;
        case "体重":
          placeholder = "例：72kg";
          break;
        default:
          placeholder = item.label;
      }

      return placeholder;
    },
  },

  mounted() {
    this.getRole();
  },

  methods: {
    // 显示历史记录
    showHistory() {
      this.$refs["historyModal"].open(getRoleHistories);
    },

    // 显示照片墙，更换影视封面
    showPhotoWall() {
      this.$refs["photoWallModal"].open(this.id);
    },

    // 更换海报
    photoChangeHandle(photo) {
      this.form.avatar = photo.image;
    },

    // 获取角色信息
    async getRole() {
      this.loading = true;
      const { code, data } = await getRole(this.id);
      this.loading = false;

      if (code === 200) {
        this.form = data;
      }
    },

    // 保存更改
    updateRole(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.form.extras = this.form.extras.filter(
            (item) => item.label && item.value
          );

          let params = {
            type: "role",
            ...this.form,
          };

          this.submitLoading = true;
          await updateRole(this.form.id, params);
          this.submitLoading = false;
        } else {
          return false;
        }
      });
    },

    addExtra() {
      let obj = {
        label: "",
        value: "",
      };

      this.form.extras.push(obj);
    },

    deleteExtra(idx) {
      this.form.extras.splice(idx, 1);
    },
  },
};
</script>


<style scoped lang="scss">
.form {
  display: inline-block;
  margin: 20px;
  width: 620px;
  .history {
    position: fixed;
    right: 35px;
    top: 74px;
    padding: 2px 4px;
    color: $color-theme;
    &:hover {
      cursor: pointer;
      opacity: 0.85;
    }
  }

  .poster-item {
    position: relative;
    width: 100px;
    height: 140px;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    > img {
      max-width: 100px;
      max-height: 140px;
    }
    &:hover {
      .poster-edit {
        opacity: 1;
        visibility: visible;
      }
    }
    .poster-none {
      color: #bbb;
    }
  }
  .poster-edit {
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
    cursor: pointer;
    background: rgba(#000, 0.65);
    transition: visibility 0.2s, opacity 0.2s;
  }
}

.custome-item {
  display: flex;
  .label {
    width: 94px;
    text-align: right;
    ::v-deep .el-input__inner {
      text-align: right;
    }
  }
  .split {
    width: 26px;
  }
  .value {
    flex: 1;
    width: 0;
    margin-right: 20px;
  }
}

.submit {
  z-index: 99;
  position: fixed;
  left: 950px;
  bottom: 68px;
}
</style>