import { getAuth, onAuthStateChanged } from 'firebase/auth'

export function authGuard(to, from, next) {
  const auth = getAuth()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        next() // Permite el acceso si el usuario está autenticado
      } else {
        next() // Redirige al login si no hay usuario autenticado
      }
    })
  } else {
    next() // Permite el acceso a rutas públicas
  }
}
