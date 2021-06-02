<template>
  <div>
    <h1 v-if="!clicked" id="games_title" class="title">Wubbzy games</h1>
    <div id="container" style="display: none"></div>
    <div v-if="!clicked" id="wwd_games_buttons" class="buttons">
      <a @click="load('/amazing/v1/wplatform_levels.swf')"
        ><button class="button is-normal is-info">
          Wubbzy's Amazing Adventure (v1) (developer mode)
        </button></a
      >
      <br /><br />
      <a @click="load('/amazing/v2/wplatform_main.swf')"
        ><button class="button is-normal is-info">
          Wubbzy's Amazing Adventure (v2)
        </button></a
      >
      <br /><br />
      <a @click="load('/under/under_main.swf')"
        ><button class="button is-normal is-info">
          Wubbzy's Underwater Adventure
        </button></a
      >
      <br /><br />
      <a @click="load('/wubbgames/discodancing.swf')"
        ><button class="button is-normal is-info">
          Disco Dancin' Wubbzy
        </button></a
      >
      <br /><br />
      <a @click="load('/wubbgames/kickball.swf')"
        ><button class="button is-normal is-info">
          Kickety Kick Ball Bounce Out!
        </button></a
      >
      <br /><br />
      <a @click="load('/wubbgames/sketchitysketchpad.swf')"
        ><button class="button is-normal is-info">
          Sketchity Sketch Pad
        </button></a
      >
      <br /><br />
      <a @click="load('/wubbgames/stackums.swf')"
        ><button class="button is-normal is-info">
          Wuzzleburg Stack-ums
        </button></a
      >
      <br /><br />
      <a @click="load('/wubbgames/wubbhunt.swf')"
        ><button class="button is-normal is-info">Wacky Wubb Hunt</button></a
      >
      <br /><br />
      <a @click="load('german/wubbzy_s_soap_bubble_flyer_game.swf')"
        ><button class="button is-normal is-info">
          Wubbzy's Soap Bubble Flyer Game
        </button></a
      >
    </div>
  </div>
</template>

<style>
#games_title {
  padding-top: 20px;
  font-size: 3em;
}

#wwd_games_buttons {
  margin: auto;
  padding: 10px;
  margin-top: 10px;
  display: block;
}
#wwd_games_buttons a {
  padding: 2px;
}

ruffle-player {
  width: 100%;
  height: calc(100vh - 80px);
}
</style>

<script>
const containerStyle = `border-style: ridge;
border-color: aqua;
border-width: 10px;`;

export default {
  data() {
    return {
      clicked: false,
    };
  },
  created() {
  document.getElementsByTagName("body")[0].style.backgroundImage =
      "url(https://vignette.wikia.nocookie.net/wubbzy/images/8/89/C199993F-3451-4BE3-9CD8-DC59E3F30008.jpeg/revision/latest?cb=20200327143747&format=original)";
  },
  beforeRouteLeave(to, from, next) {
    const container = document.getElementById("container");
    container.style.display = "none";
    next();
  },
  methods: {
    load(link) {
      this.clicked = true;
      const ruffle = window.RufflePlayer.newest();
      const container = document.getElementById("container");
      container.style.display = "block";
      const player = ruffle.createPlayer();
      player.container.style = containerStyle;
      container.appendChild(player);
      player.onfullscreenchange = function () {
        if (this.isFullscreen) {
          this.container.style = "";
        } else {
          this.container.style = containerStyle;
        }
      };
      player.load(link);
    },
  },
};
</script>
