<template>
  <keep-alive
    include="UserDetailData, UserDetailInfo, UserDetailTorrents, UserDetailCasts, UserDetailPhotos, UserDetailVideos, UserDetailRatings, UserDetailComments, UserDetailReviews"
  >
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  name: "UserDetailLayout",
  provide() {
    return {
      id: parseInt(this.$route.params.id),
    };
  },
};
</script>
