import { useAuthStore } from 'src/stores/authStore'

export function authGuard(to, _, next) {
  const authStore = useAuthStore()

  // Permitir acceso libre a LoginAS.vue
  if (to.path === '/' || to.path === '/registerAS') {
    next()
    return
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/loginad') // Solo redirigir a loginad si es otra página protegida
  } else {
    next()
  }
}
