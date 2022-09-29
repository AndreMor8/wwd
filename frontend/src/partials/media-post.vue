<template>
  <section class="hero" :class="'type-' + type" style="padding: 12px">
    <div class="hero-head" style="text-align: left">
      <strong style="position: absolute">{{ showType }}</strong>
      <div v-if="admin || userID === loggedID" style="position: absolute; right: 12px" class="buttons">
        <router-link :to="'/wubbzy-media/publish/' + _id" class="button is-link is-responsive">
          Edit post
        </router-link>
        <button @click="deletePost" class="button is-danger is-responsive" :disabled="pressed">
          Delete post
        </button>
      </div>
    </div>
    <div class="hero-body">
      <h2 class="subtitle">{{ title }}</h2>
      <div class="content">
        <p>
          {{ description }}
        </p>
      </div>
    </div>
    <div class="hero-foot">
      <div class="buttons">
        <a v-for="(mirror, index) in mirrors" :key="index" :href="mirror.url" class="button is-info is-responsive"
          target="_blank">
          {{ mirror.name }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  border-radius: 1rem;
}
</style>

<script>
Array.apply();
export default {
  props: ["_id", "userID", "title", "description", "mirrors", "type", "admin"],
  data() {
    return {
      pressed: false,
      loggedID: this.$root.user.id,
    };
  },
  computed: {
    showType() {
      const mytypes = [
        "Episode compilation",
        "Another compilation",
        "Individual episode",
        "Another individual media",
      ];
      return mytypes[this.type];
    },
  },
  methods: {
    deletePost() {
      if (this.pressed) return;
      this.pressed = true;
      const a = confirm("Do you want to delete this post permanently?");
      if (a) {
        this.axios
          .delete(`${window.apiDomain}/wm/posts/${this._id}`)
          .then(() => {
            alert("Post deleted.");
            this.$parent.goWubbzyMedia();
          })
          .catch((e) => {
            //console.error(e);
            this.pressed = false;
            alert(`Error: ${e.response.data.message}`);
          });
      } else this.pressed = false;
    },
  },
};
</script>