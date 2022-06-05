<template>
  <keep-alive include="ArticleDetailContent">
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  name: "ArticleDetailLayout",
  provide() {
    return {
      id: parseInt(this.$route.params.id),
    };
  },
};
</script>