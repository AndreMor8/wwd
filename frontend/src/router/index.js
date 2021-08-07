import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: function () {
      return import('../views/home.vue');
    }
  },
  {
    path: '/wwd',
    name: 'wwd',
    component: function () {
      return import('../views/wwd.vue');
    }
  },
  {
    path: '/wubbzypedia',
    name: 'wubbzypedia',
    component: function () {
      return import('../views/wubbzypedia.vue');
    }
  },
  {
    path: '/wwd/rules',
    name: "rules",
    component: function () {
      return import('../views/wwd/rules.vue');
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
    path: '/wwd/wm-qualifiers',
    name: "wm-qualifiers",
    component: function () {
      return import('../views/wwd/wmqualifiers.vue');
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
    path: "/birthday-cards/submit",
    name: "birthday-cards_submit",
    component: function () {
      return import('../views/birthday/submit.vue');
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
    path: '/wwd/appeal',
    name: "appeal",
    component: function () {
      return import('../views/wwd/appeal.vue');
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
});

export default router;