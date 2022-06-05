import VideoPlayer from './index.vue';

export default {
  install(Vue) {
    Vue.component(VideoPlayer.name, VideoPlayer);
  }
};