<template>
  <article class="media birthday">
    <div class="media-left" v-if="!!avatar">
      <figure class="image is-64x64">
        <img
          id="avatar"
          :src="avatar"
          alt="Image"
          @error="replaceToDefault(username)"
        />
      </figure>
    </div>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{ username }}</strong>
          <small id="wwd_to_wubbzy_text">To: Wubbzy</small>
          <br />
          {{ card }}
        </p>
        <div v-if="!!additional">
          <strong>Additional</strong><br />{{ additional }}
        </div>
      </div>

      <nav v-if="adminmode" class="level is-mobile">
        <!-- in progress -->
      </nav>
    </div>
  </article>
</template>

<style>
#wwd_to_wubbzy_text {
  padding-left: 0.5em;
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
  methods: {
    replaceToDefault(tag) {
      return `https://cdn.discordapp.com/embed/avatars/${
        tag.split("#")[1] % 5
      }.png`;
    },
  },
};
</script>