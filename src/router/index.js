import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { auth } from 'src/boot/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

let isAuthChecked = false
let userAuthenticated = false

const checkAuth = () => {
  return new Promise((resolve) => {
    if (isAuthChecked) {
      resolve(userAuthenticated)
      return
    }

    onAuthStateChanged(auth, (user) => {
      userAuthenticated = !!user
      isAuthChecked = true
      resolve(userAuthenticated)
    })
  })
}

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth) {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      next('/loginad')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
