import { createRouter, createWebHistory } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Login from '../components/Login.vue';
import ChatLayout from '../components/ChatLayout.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatLayout,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

router.beforeEach(async (to) => {
  const user = await getCurrentUser();

  const tieneLoginManual = sessionStorage.getItem('perfilChat');

  if (to.path === '/chat' && !user && !tieneLoginManual) {
    return '/';
  }

  if (to.path === '/' && user) {
    return '/chat';
  }
});


export default router;
