<template>
  <transition name="fade">
    <div class="current-info" v-if="role && isShow">
      <div class="info-img">
        <img :src="role.image" />
      </div>
      <div class="info-list">
        <div class="info-item info-title">{{ role.name }}</div>
        <div class="info-item info-subtitle">{{ role.name_en }}</div>

        <div class="info-sub" v-if="moduleName === 'movie'">
          <div class="info-item">评分：{{ role.rating }}</div>
          <div class="info-item">年份：{{ role.year }}</div>
          <div class="info-item">类型：{{ role.genres }}</div>
        </div>
        <div class="info-sub" v-else-if="moduleName === 'actor'">
          <div class="info-item">性别：{{ role.gender }}</div>
          <div class="info-item">国家：{{ role.country }}</div>
          <div class="info-item">生日：{{ role.birthday }}</div>
        </div>
        <div class="info-sub" v-else-if="moduleName === 'role'"></div>
        <div class="info-sub" v-else-if="moduleName === 'award'">
          <div class="info-item">年代：{{ role.year }}</div>
          <div class="info-item">届数：{{ role.session }}</div>
          <div class="info-item">国家：{{ role.country }}</div>
        </div>
        <div class="info-sub" v-else-if="moduleName === 'user'">
          <div class="info-item">性别：{{ role.gender }}</div>
          <div class="info-item">注册：{{ role.created_at }}</div>
        </div>
        <div class="info-sub" v-else-if="moduleName === 'article'"></div>
      </div>
    </div>
  </transition>
</template>

<script>
import { getMovie } from "@/api/movie";
import { getActor } from "@/api/actor";
import { getRole } from "@/api/role";
import { getAward } from "@/api/award";
import { getArticle } from "@/api/article";
import { getUser } from "@/api/user";

export default {
  name: "CurrentRole",

  data() {
    return {
      role: {},
      moduleName: "",
      isShow: false
    };
  },

  watch: {
    $route: "routeChangeHandle",
  },

  methods: {
    async routeChangeHandle(val) {
      const id = this.$route.params?.id;
      const name = this.$route.name.toLowerCase();
      let request = null;


      if (!id) {
        this.isShow = false;
        return;
      }

      if (id && this.role.id !== parseInt(id)) {
        let moduleName = null;
        if (name.startsWith("movieDetail")) {
          request = getMovie;
          moduleName = "movie";
        } else if (name.startsWith("actorDetail")) {
          request = getActor;
          moduleName = "actor";
        } else if (name.startsWith("roleDetail")) {
          request = getRole;
          moduleName = "role";
        } else if (name.startsWith("awardDetail")) {
          request = getAward;
          moduleName = "award";
        } else if (name.startsWith("articleDetail")) {
          request = getArticle;
          moduleName = "article";
        } else if (name.startsWith("userDetail")) {
          request = getUser;
          moduleName = "user";
        } else {
          this.isShow = false;
          return;
        }

        if (request) {
          this.moduleName = moduleName;

          this.loading = true;
          let res = await request(id);
          this.loading = false;

          if (res.code === 200) {
            let role = res.data;

            if (name.startsWith("movie")) {
              role.name = role.title;
              role.image = role.poster;
            } else if (name.startsWith("actor")) {
              role.image = role.avatar;
            } else if (name.startsWith("role")) {
              role.image = role.avatar;
            } else if (name.startsWith("award")) {
              role.name = role.title;
              role.image = role.poster;
            } else if (name.startsWith("article")) {
              role.name = role.title;
              role.image = role.cover;
            } else if (name.startsWith("user")) {
              role.name = role.nickname;
              role.image = role.avatar;
            }

            this.role = role;
            this.isShow = true;
          }
        }
      } else {
        this.isShow = true;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.current-info {
  position: relative;
  padding-left: 10px;
  height: 50px;
  width: 240px;
  transition: height 0.2s;
  .info-img {
    position: absolute;
    left: 10px;
    top: 5px;
    width: 30px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    transition: all 0.2s;
    > img {
      max-width: 32px;
      max-height: 40px;
      transition: all 0.2s;
    }
  }
  .info-list {
    position: absolute;
    left: 40px;
    top: 10px;
    margin-left: 8px;
    font-size: 12px;
    transition: all 0.2s;
    .info-sub {
      visibility: hidden;
      opacity: 0;
    }
    .info-item {
      color: #999;
      line-height: 20px;
      width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &.info-title {
        font-size: 14px;
        color: #fff;
        line-height: 18px;
        font-weight: bold;
      }
      &.info-subtitle {
        margin-bottom: 6px;
        font-size: 12px;
        color: #999;
        line-height: 18px;
      }
    }
  }
  &:hover {
    z-index: 9;
    position: absolute;
    left: 0;
    top: 0;
    height: 130px;
    cursor: pointer;
    background-color: #373d41;
    .info-img {
      position: absolute;
      top: 15px;
      width: 70px;
      height: 100px;
      line-height: 100px;
      > img {
        max-width: 70px;
        max-height: 100px;
      }
    }
    .info-list {
      left: 84px;
      .info-title {
        margin-top: 4px;
      }
      .info-subtitle {
        line-height: 20px;
      }
      .info-sub {
        visibility: visible;
        opacity: 1;
      }
    }
  }
}
</style>