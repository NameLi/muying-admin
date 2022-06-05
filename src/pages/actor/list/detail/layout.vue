<template>
  <keep-alive
    include="ActorDetailData, ActorDetailInfo, ActorDetailPhotos, ActorDetailWorks, ActorDetailComments"
  >
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  name: "ActorDetailLayout",
  provide() {
    return {
      id: parseInt(this.$route.params.id),
    };
  },
};
</script>