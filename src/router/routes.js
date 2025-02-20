const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginAS.vue') },
      { path: 'registerAS', component: () => import('pages/RegisterAS.vue') },
      { path: 'loginad', component: () => import('pages/LoginAD.vue') },
      {
        path: 'dashboardAD',
        component: () => import('pages/DashboardAD.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'empleados',
        component: () => import('pages/EmpleadosAD.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'reportes',
        component: () => import('pages/ReportesAD.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'calendario/:dni',
        component: () => import('pages/CalendarioAD.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
