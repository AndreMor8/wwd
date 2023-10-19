<template>
  <div class="box">
    <h1 id="home_title" class="title">Welcome to Wubbworld!</h1>
    <p class="content">We are a community of fans of the Wow! Wow! Wubbzy! show starting from 2008.</p>
    <p class="content">Welcome to our website. We currently have 4 places where our fanatic (or interested) community
      has been distributed.</p>
    <p class="content">Feel free to interact with them, especially if you are a fan of the series. We need more
      interested!</p>
    <p class="content">Are you a fan / do you remember the series / do you like it?<br /><strong>Easily join us
        :)</strong></p>
  </div>
  <div class="box">
    <h2 class="subtitle wfamily">Sections in this page</h2>
    <div class="buttons">
      <router-link to="/birthday-cards" class="button home-button is-link">
        Wubbzy birthday cards
      </router-link>
      <router-link to="/games" class="button home-button is-link">Games</router-link>
      <a href="https://archive.wubbworld.xyz/" class="button home-button is-success">Archives</a>
      <a href="https://stream.wubbworld.xyz/" class="button home-button is-success">Stream Wubbzy episodes</a>
      <router-link to="/wubbzy-media" class="button home-button is-link is-light is-focused">Wubbzy media (WWD level
        2)</router-link>
    </div>
  </div>
  <div class="box">
    <h2 class="subtitle wfamily">
      Platforms or services where we are
    </h2>
    <div class="buttons">
      <router-link to="/wubbzypedia" class="button home-button is-link">
        Wubbzypedia
      </router-link>
      <router-link to="/wwd" class="button home-button is-link">
        Wow Wow Discord
      </router-link>
      <a href="https://twitter.com/WubbWorld" class="button home-button is-success is-light is-focused">@WubbWorld</a>
      <a href="https://www.reddit.com/r/wubbzy" class="button home-button is-success is-light is-focused">r/wubbzy</a>
      <a href="https://www.roblox.com/groups/7054763/Wow-Wow-Roblox"
        class="button home-button is-success is-light is-focused">Wow Wow
        Roblox</a>
    </div>
  </div>
</template>

<style>
#home_title {
  color: #FEE382;
  -webkit-text-stroke: 1.5px #363636;
  font-size: 2.4rem;
}

.container>.box>p {
  font-size: larger;
}

.wfamily {
  font-size: 2rem;
  color: #70ff7c;
  -webkit-text-stroke: 1px #363636;
}

.home-button {
  font-size: 17px;
}

.home-text {
  font-size: 20px;
}

.home-color {
  background-color: #ffe260f3;
  padding: 5px;
  border-radius: 0.5em;
}
</style>

<script>
export default {
  created() {
    document.body.className = "main";
  },
};
</script>