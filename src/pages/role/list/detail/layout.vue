<template>
  <keep-alive
    include="RoleDetailData, RoleDetailInfo, RoleDetailPhotos, RoleDetailWorks, RoleDetailComments"
  >
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  name: "RoleDetailLayout",
  provide() {
    return {
      id: parseInt(this.$route.params.id),
    };
  },
};
</script>