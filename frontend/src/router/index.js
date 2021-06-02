import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: function () {
      return import('../views/about.vue');
    }
  },
  {
    path: '/rules',
    name: "rules",
    component: function () {
      return import('../views/rules.vue');
    }
  },
  {
    path: '/games',
    name: "games",
    component: function () {
      return import('../views/games.vue');
    }
  },
  {
    path: '/wm-qualifiers',
    name: "wm-qualifiers",
    component: function () {
      return import('../views/wmqualifiers.vue');
    }
  },
  {
    path: '/birthday-cards',
    name: "birthday-cards",
    component: function () {
      return import('../views/birthday-cards.vue');
    }
  },
  {
    path: '/birthday-cards/:year',
    name: "birthday-cards_final",
    component: function () {
      return import('../views/birthday/birthdays.vue');
    }
  },
  {
    path: '/appeal',
    name: "appeal",
    component: function () {
      return import('../views/appeal.vue');
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: function () {
      return import('../views/404.vue');
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
