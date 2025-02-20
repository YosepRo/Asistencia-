import { useAuthStore } from "src/stores/authStore";

export function authGuard(to, _, next) {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/loginad");
  } else {
    next();
  }
}
