<template>
  <h1 v-if="!logged" class="title">
    You must login with Discord on this website first.
  </h1>
  <h1 v-else-if="!loaded" class="title">Loading...</h1>
  <h1 v-else-if="!canView" class="title">
    You must be verified on Wow Wow Discord to view this content.
  </h1>
  <div v-else>
    <div class="box">
      <h1 class="title">
        Wow! Wow! Wubbzy! multimedia
      </h1>
      <router-link v-if="canPublish" to="/wubbzy-media/publish" class="button is-info is-light is-focused">
        New post
      </router-link>
      <h2 v-if="!posts.length" class="subtitle" style="font-size: 1.5rem; margin-top: 10px;">
        There are no contributions yet, although they are supposed to be here
        now.
      </h2>
    </div>
    <div v-if="!!posts.length">
      <div class="block" v-for="post in posts" :key="post._id">
        <mediaPost :_id="post._id" :userID="post.userID" :title="post.title" :description="post.description"
          :mirrors="post.mirrors" :type="post.type" :admin="admin" />
      </div>
    </div>
  </div>
</template>

<style>
.type-0 {
  background-color: rgb(255, 235, 146);
}

.type-1 {
  background-color: rgb(255, 248, 215);
}

.type-2 {
  background-color: rgb(150, 239, 251);
}

.type-3 {
  background-color: rgb(220, 251, 255);
}
</style>

<script>
import mediaPost from "../../partials/media-post.vue";
export default {
  components: { mediaPost },
  data() {
    return {
      loaded: false,
      logged: this.$root.logged,
      canView: false,
      canPublish: false,
      admin: false,
      posts: [],
    };
  },
  created() {
    document.body.className = "main";
    this.logged = this.$root.logged;
    if (this.logged) this.goWubbzyMedia();
  },
  methods: {
    goWubbzyMedia() {
      this.axios.get(`${window.apiDomain}/wm/posts`).then((e) => {
        this.canView = e.data.wmui.view;
        this.canPublish = e.data.wmui.publish;
        this.admin = e.data.wmui.admin;
        this.posts = e.data.posts;
        this.loaded = true;
      });
    },
  },
};
</script>