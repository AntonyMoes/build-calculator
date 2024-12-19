import { createRouter, createWebHistory } from 'vue-router'
import Calculator from "@/components/calculator/Calculator.vue";
import Settings from "@/components/settings/Settings.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Calculator',
      component: Calculator,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
    },
  ],
})

export default router
