<template>
  <div>
    <h1 id="home_title" class="main_title title">Welcome to Wubbworld!</h1>
    <h2 class="subtitle" style="font-size: x-large">
      <span class="home-color">We are a community of fans of the <i>Wow! Wow! Wubbzy!</i> show starting
      from 2008.</span>
    </h2>
    <p class="home-text">
      <span class="home-color">Welcome to our website. We currently have 4 places where our fanatic (or
      interested) community has been distributed.</span>
    </p>
    <br>
    <p class="home-text">
      <span class="home-color">Feel free to interact with them, especially if you are a fan of the
      series. We need more interested!</span>
    </p>
    <p class="home-text">
     <span class="home-color"> Are you a fan / do you remember the series / do you like it?<br /><b
        >Easily join us :)</b
      ></span>
    </p>
    <div class="buttons fix">
      <h2 class="subtitle wfamily"><b>Sections in this page</b></h2>
      <router-link to="/birthday-cards"
        ><button class="button home-button is-info">
          Wubbzy birthday cards
        </button></router-link
      >
      <router-link to="/games"
        ><button class="button home-button is-info">Games</button></router-link
      >
      <router-link to="/wubbzy-media"
        ><button class="button home-button is-info is-light">Wubbzy media</button></router-link
      >
    </div>
    <div class="buttons fix">
      <h2 class="subtitle wfamily">
        <b>Platforms or services where we are</b>
      </h2>

      <router-link to="/wubbzypedia"
        ><button class="button home-button is-info">
          Wubbzypedia
        </button></router-link
      >

      <router-link to="/wwd"
        ><button class="button home-button is-info">
          Wow Wow Discord
        </button></router-link
      >

      <a href="https://twitter.com/WubbzyWednesday"
        ><button class="button home-button is-link">@WubbzyWednesday</button></a
      >

      <a href="https://www.reddit.com/r/wubbzy"
        ><button class="button home-button is-link">r/wubbzy</button></a
      >
      <a href="https://www.roblox.com/groups/7054763/Wow-Wow-Roblox"
        ><button class="button home-button is-link">Wow Wow Roblox</button></a
      >
    </div>
  </div>
</template>

<style>
#home_title {
  color: #fcf04e;
  -webkit-text-stroke: 1.5px black;
}

.wfamily {
  font-size: 32px;
  color: #14ff27;
  -webkit-text-stroke: 1.3px black;
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