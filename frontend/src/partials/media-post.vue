<template>
  <section class="hero" :class="'type-' + type" style="padding: 12px">
    <div class="hero-head" style="text-align: left">
      <strong style="position: absolute">{{ showType }}</strong>
      <a
        v-if="admin"
        @click="deletePost"
        style="position: absolute; right: 12px"
        ><button class="button is-small is-danger" :disabled="pressed">
          Delete post
        </button></a
      >
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
        <a
          v-for="(mirror, index) in mirrors"
          :key="index"
          :href="mirror.url"
          class="button is-small is-info"
          target="_blank"
        >
          {{ mirror.name }}
        </a>
      </div>
    </div>
  </section>
</template>

<script>
Array.apply();
export default {
  props: ["_id", "userID", "title", "description", "mirrors", "type", "admin"],
  data() {
    return {
      pressed: false,
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
          .delete(`/api/wm/posts/${this._id}`)
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
  /*,
  computed: {
    defaultAvatar() {
      return `https://cdn.discordapp.com/embed/avatars/${
        this.username.split("#")[1] % 5
      }.png`;
    },
  },*/
};
</script>