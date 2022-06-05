<template>
  <keep-alive include="VideoDetailData, VideoDetailComments">
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  name: "VideoDetailLayout",
  provide() {
    return {
      id: parseInt(this.$route.params.id),
    };
  },
};
</script>
