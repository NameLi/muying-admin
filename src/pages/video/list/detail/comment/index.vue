<template>
  <comment-page type="videos" :id="id" />
</template>

<script>
// 视频评论
export default {
  name: "VideoComments",
  inject: ["id"],
};
</script>
