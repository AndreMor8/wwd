<template>
  <div class="box">
    <div class="container">
      <figure class="image">
        <img id="wwd_home_icon" src="../assets/icon.webp" alt="wwd_home_icon" />
      </figure>
      <h1 class="title">Wow Wow Discord</h1>
    </div><br />

    <h2 id="wwd_home_subtitle" class="subtitle">
      The best custom Wow! Wow! Wubbzy! server
    </h2>
  </div>
  <div class="box">
    <p class="content">
      Wow Wow Discord is a Discord server dedicated to existing and new Wubbzy fans.
    </p>
    <p class="content">Our goal is to bring fans together, relive childhood and provide a
      space for Wubbzy to continue in our lives.</p>
    <div class="buttons">
      <a v-if="joined" href="https://discord.com/channels/402555684849451028"
        class="button is-responsive is-info is-light is-focused">Go to the
        server</a>
      <a v-if="!joined" href="https://discord.gg/5qx9ZcV" class="button is-responsive is-info is-light is-focused">Join
        the server :)</a>

      <router-link to="/wwd/rules" class="button is-responsive is-info is-light is-focused">Server rules</router-link>

      <router-link to="/wwd/appeal" class="button is-responsive is-info is-light is-focused">Appeal your ban
      </router-link>

      <router-link to="/wwd/wm-qualifiers" class="button is-responsive is-info is-light is-focused">
        What qualifies for Wubbzy Media?
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.box>.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.box>.container>figure {
  width: 128px;
}

.box>.container>figure>img {
  border-color: #18191c;
  border-style: solid;
  background-color: #18191c;
  border-radius: 100%;
}

.box>.container>h1 {
  margin-left: 2rem;
}

#wwd_home_subtitle {
  font-size: 2rem;
}
</style>

<script>
export default {
  data() {
    return {
      logged: this.$root.logged,
      joined: this.$root.user.inserver,
      verified: this.$root.user.verified,
      admin: this.$root.user.admin,
    };
  },
  created() {
    document.body.className = "wwd";
    this.logged = this.$root.logged;
    this.joined = this.$root.user.inserver;
    this.verified = this.$root.user.verified;
    this.admin = this.$root.user.admin;
  },
};
</script>