<template>
  <article class="media birthday">
    <div class="media-left" v-if="!!avatar">
      <object class="image is-64x64" :data="avatar">
        <img :src="defaultAvatar" />
      </object>
    </div>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{ username }}</strong>
          <small class="wwd_to_wubbzy_text">To: Wubbzy</small><br />{{ card }}
        </p>
        <div v-if="!!additional">
          <strong>Additional</strong><br />{{ additional }}
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.birthday {
  text-align: left;
}

.wwd_to_wubbzy_text {
  padding-left: 0.5em;
}

.media-content {
  overflow-wrap: anywhere;
}
</style>

<script>
export default {
  props: [
    "anon",
    "card",
    "additional",
    "userID",
    "username",
    "avatar",
    "adminmode",
  ],
  computed: {
    defaultAvatar() {
      return `https://cdn.discordapp.com/embed/avatars/${this.username.split("#")[1] % 5
        }.png`;
    },
  },
};
</script>