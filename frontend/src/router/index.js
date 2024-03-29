import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: function () {
      return import('../views/web-home.vue');
    }
  },
  {
    path: '/wwd',
    name: 'wwd',
    component: function () {
      return import('../views/wwd-server.vue');
    }
  },
  {
    path: '/wubbzypedia',
    name: 'wubbzypedia',
    component: function () {
      return import('../views/wubbzy-wiki.vue');
    }
  },
  {
    path: '/wwd/rules',
    name: "rules",
    component: function () {
      return import('../views/wwd/server-rules.vue');
    }
  },
  {
    path: '/games',
    name: "games",
    component: function () {
      return import('../views/wubbzy-games.vue');
    }
  },
  {
    path: '/wwd/wm-qualifiers',
    name: "wm-qualifiers",
    component: function () {
      return import('../views/wwd/wm-qualifiers.vue');
    }
  },
  {
    path: '/birthday-cards',
    name: "birthday-cards",
    component: function () {
      return import('../views/birthday-years.vue');
    }
  },
  {
    path: "/birthday-cards/submit",
    name: "birthday-cards_submit",
    component: function () {
      return import('../views/birthday/card-submit.vue');
    }
  },
  {
    path: '/birthday-cards/:year',
    name: "birthday-cards_final",
    component: function () {
      return import('../views/birthday/birthday-cards.vue');
    }
  },
  {
    path: '/wwd/appeal',
    name: "appeal",
    component: function () {
      return import('../views/wwd/appeal-ban.vue');
    }
  },
  {
    path: '/wubbzy-media',
    name: "wubbzy-media",
    component: function () {
      return import('../views/wubbzy-media/media-home.vue');
    }
  },
  {
    path: '/wubbzy-media/publish',
    name: "publish",
    component: function () {
      return import('../views/wubbzy-media/media-publish.vue');
    }
  },
  {
    path: '/wubbzy-media/publish/:_id',
    name: "publish_edit",
    component: function () {
      return import('../views/wubbzy-media/media-publish.vue');
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: function () {
      return import('../views/error-404.vue');
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;