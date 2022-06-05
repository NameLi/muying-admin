<template>
  <comment-page type="articles" :id="id" />
</template>

<script>
export default {
  name: "ArticleComments",
  inject: ["id"],
};
</script>
