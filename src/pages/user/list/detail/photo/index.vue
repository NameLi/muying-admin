<template>
  <photo-page category="user" :option="option">
    <template slot="header">
      <m-select
        v-model="photoType"
        :options="userPhotoTypes"
        :clearable="false"
        placeholder="选择照片类型"
      />
    </template>
  </photo-page>
</template>

<script>
export default {
  name: "userDetailPhotos",

  inject: ["id"],

  data() {
    return {
      photoType: "movie",
      userPhotoTypes: [
        {
          label: "影视",
          value: "movie",
        },
        {
          label: "影人",
          value: "actor",
        },
        {
          label: "角色",
          value: "role",
        },
      ],
    };
  },

  computed: {
    option() {
      return {
        category: this.photoType,
      };
    },
  },
};
</script>