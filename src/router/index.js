// import { createRouter, createWebHistory } from 'vue-router'
//
// import routes from './routes'
//
// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// })
//
// export default router

import { defineRouter } from "#q-app/wrappers";
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";
import routes from "./routes";
import { authGuard } from "./guards";

export default defineRouter(function() {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : createWebHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(authGuard);

  return Router;
});
