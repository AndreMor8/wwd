<template>
  <h1 v-if="!logged" class="title main_title">
    You must login with Discord on this website first.
  </h1>
  <h1 v-else-if="!loaded" class="title main_title">Loading...</h1>
  <h1 v-else-if="!canView" class="title main_title">
    You must be verified on Wow Wow Discord to view this content.
  </h1>
  <div v-else>
    <router-link
      v-if="canPublish"
      to="/wubbzy-media/publish"
      style="right: 0; padding-right: 1em; padding-top: 1em; position: absolute"
    >
      <button class="button is-info is-light">New post</button>
    </router-link>
    <h1
      class="birthday_title title main_title"
      style="text-align: center; margin-bottom: 15px"
    >
      Wow! Wow! Wubbzy! multimedia
    </h1>
    <div v-if="!!posts.length">
      <div class="block" v-for="post in posts" :key="post._id">
          <mediaPost
            :_id="post._id"
            :userID="post.userID"
            :title="post.title"
            :description="post.description"
            :mirrors="post.mirrors"
            :type="post.type"
            :admin="admin"
          />
      </div>
    </div>
    <div v-else>
      <b
        ><h2 class="subtitle" style="font-size: 2em">
          There are no contributions yet, although they are supposed to be here
          now.
        </h2></b
      >
    </div>
  </div>
</template>

<style>
.type-0 {
  background-color: rgb(255, 228, 108);
}
.type-1 {
  background-color: rgb(249, 238, 191);
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
      this.axios.get("/api/wm/posts").then((e) => {
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