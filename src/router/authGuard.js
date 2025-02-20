export function authGuard(to, from, next) {
  const isAuthenticated = localStorage.getItem('isAuthenticated')

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    next()
  }
}
