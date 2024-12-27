import {createRouter, createWebHistory} from 'vue-router'
import Calculator from "@/components/calculator/Calculator.vue";
import Settings from "@/components/settings/Settings.vue";
import Equipment from "@/components/equipment/Equipment.vue";
import Characters from "@/components/characters/Characters.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Characters',
      component: Characters,
    },
    {
      path: "/test",
      name: "TEST",
      component: Calculator,
    },
    {
      path: '/equipment',
      name: 'Equipment',
      component: Equipment,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
    },
  ],
})

export default router
