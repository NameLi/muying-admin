<template>
  <comment-page type="reviews" :id="id" :z-index="9" />
</template>

<script>
export default {
  name: "MovieDetailReviewComments",
  data() {
    return {
      id: Number(this.$route.params.review_id),
    };
  },
};
</script>
