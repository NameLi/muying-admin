<template>
  <keep-alive include="MovieSerialDetailData, MovieSerialDetailMovie">
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  name: "MovieSerialDetailLayout",
  provide() {
    return {
      id: parseInt(this.$route.params.id),
    };
  },
};
</script>
