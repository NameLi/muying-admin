<template>
  <keep-alive include="AwardDetailData, AwardDetailInfo, AwardDetailComments">
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  name: "AwardDetailLayout",
  provide() {
    return {
      id: parseInt(this.$route.params.id),
    };
  },
};
</script>
