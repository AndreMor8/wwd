<template>
  <div>
    <br />
    <figure class="image is-128x128">
      <img id="wwd_home_icon" src="/img/icon.gif" alt="wwd_home_icon" />
    </figure>

    <h1 id="wwd_home_title" class="title">Wow Wow Discord</h1>
    <h2 id="wwd_home_subtitle" class="subtitle">
      The best custom Wow! Wow! Wubbzy! server
    </h2>
    <span id="wwd_home_description">
      Wow Wow Discord is a Discord server dedicated to existing and new Wubbzy
      fans. Our goal is to bring fans together, relive childhood and provide a
      space for Wubbzy to continue in our lives.
    </span>
    <div class="buttons fix">
      <a v-if="joined" href="https://discord.com/channels/402555684849451028"
        ><button class="button">Go to the server</button></a
      >
      <a v-if="!joined" href="https://discord.gg/5qx9ZcV"
        ><button class="button">Join the server :)</button></a
      >

      <router-link to="/wwd/rules"
        ><button class="button">Server rules</button></router-link
      >

      <router-link v-if="logged && !joined" to="/wwd/appeal"
        ><button class="button">Appeal your ban</button></router-link
      >

      <router-link to="/wwd/wm-qualifiers"
        ><button class="button">
          What qualifies for Wubbzy Media?
        </button></router-link
      >
      <!--<a v-if="admin" href="/appeals"><button class="button">Ban appeals</button></a>-->
    </div>
  </div>
</template>

<style>
#wwd_home_icon {
  margin-top: 4px;
  border-color: #18191c;
  border-style: solid;
  background-color: #18191c;
}
#wwd_home_title {
  margin-top: 15px;
}

#wwd_home_subtitle {
  font-size: 40px;
  margin-top: -15px;
  margin-bottom: 10px;
}
#wwd_home_description {
  padding: 3px;
  margin-top: 10px;
  background-color: rgba(243, 247, 129, 0.87);
  font-size: 20px;
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