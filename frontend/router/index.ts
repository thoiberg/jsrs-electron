import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddCardView from '../views/AddCardView.vue'
import BrowseCardView from '../views/BrowseCardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/add_card',
      name: 'addCard',
      component: AddCardView,
    },
    {
      path: '/browse',
      name: 'browse',
      component: BrowseCardView,
    },
  ],
})

export default router
