<template>
  <keep-alive
    include="MovieDetailData, MovieDetailInfo, MovieDetailTorrents, MovieDetailCast, MovieDetailPhotos, MovieDetailVideos, MovieDetailRatings, MovieDetailComments, MovieDetailReviews"
  >
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  name: "MovieDetailLayout",
  provide() {
    return {
      id: parseInt(this.$route.params.id),
    };
  },
};
</script>
