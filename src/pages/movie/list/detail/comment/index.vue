<template>
  <comment-page type="movies" :id="id" />
</template>

<script>
export default {
  name: "MovieComments",
  inject: ["id"],
};
</script>
