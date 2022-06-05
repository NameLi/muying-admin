import Comment from './index.vue';

export default {
    install(Vue) {
        Vue.component(Comment.name, Comment);
    }
};