import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
    },
    {
      path: '/carreras',
      name: 'carreras',
      component: () => import('../views/Carreras/index.vue'),
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: () => import('../views/Carreras/edit.vue'),
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/Carreras/create.vue'),
    },
    {
      path: '/alumnos',
      name: 'alumnos',
      component: () => import('../views/Alumnos/index.vue'),
    },
    {
      path: '/graphic',
      name: 'graphic',
      component: () => import('../views/Alumnos/graphic.vue'),
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/Alumnos/reports.vue'),
    }
  ]
});

router.beforeEach(async (to) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const authStore = useAuthStore();

  // Verificar si la autenticación es requerida y si hay un token presente
  if (authRequired && !authStore.token) {
    authStore.returnUrl = to.fullPath; // Guardar la URL a la que se intentaba acceder
    return '/login';
  }
});

export default router;
