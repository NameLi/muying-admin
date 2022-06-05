import Vue from "vue";
import Router from "vue-router";
import Login from "@/pages/login";
import NotFound from "@/pages/404";

Vue.use(Router);

const constantRoutes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "*",
    component: NotFound,
  },
];

export default new Router({
  mode: "history",
  linkActiveClass: "is-active",
  linkExactActiveClass: "is-active",
  base: __dirname,
  routes: constantRoutes,
});
