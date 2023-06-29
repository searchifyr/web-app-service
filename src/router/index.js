import { createRouter, createWebHistory } from "vue-router";
import api from "@/apiService.js";

import DashboardView from "../views/ApplicationDashboard/ApplicationDashboardView.vue";
import SearchProfileView from "../views/SearchProfileDashboard/SearchProfileDashboardView.vue";
import HomeView from "../views/Landing/HomeView.vue";
import UserIsNotActivatedView from "../views/UserIsNotActivatedView.vue";
import AdminScreen from "../views/AdminScreen.vue";
import store from "../store"; // your vuex store

const ifAuthenticated = async (to, from, next) => {
  const request = api.get("api/v1/users/login/status");
  const status = { ...(await request) };
  store.commit("setIsAuthenticated", status.authenticated);
  store.commit("setUserData", status);

  if (status.authenticated) {
    next();
    return;
  }
  next("/");
};

const hasSearchprofileId = async (to, from, next) => {
  if (to.params.searchprofile.length > 0) {
    next();
    return;
  }
  next("/dashboard");
};

const isAdmin = async (to, from, next) => {
  if (store.state.userData?.admin) {
    next();
    return;
  }
  next("/dashboard");
};

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/dashboard/:application?",
    name: "dashboard",
    component: DashboardView,
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/searchprofile",
    redirect: "/dashboard",
  },
  {
    path: "/UserIsNotActivatedView",
    name: "UserIsNotActivatedView",
    component: UserIsNotActivatedView,
  },
  {
    path: "/adminscreen",
    name: "adminscreen",
    component: AdminScreen,
    beforeEnter: ifAuthenticated && isAdmin,
  },
  {
    path: "/searchprofile/:searchprofile",
    name: "searchprofile",
    component: SearchProfileView,
    beforeEnter: ifAuthenticated && hasSearchprofileId,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
