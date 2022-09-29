<template>
  <div class="box">
    <h1 v-if="!clicked" class="title">Select a Wubbzy game</h1>
    <div id="game" class="container" style="display: none"></div>
    <div v-if="!clicked" class="buttons">
      <a @click="load('/swf/amazing/v1/wplatform_levels.swf')" class="button is-info is-responsive">
        Wubbzy's Amazing Adventure (v1) (dev mode)
      </a>
      <a @click="load('/swf/amazing/v2/wplatform_main.swf')" class="button is-info is-responsive">
        Wubbzy's Amazing Adventure (v2)
      </a>
      <a @click="load('/swf/under/under_main.swf')" class="button is-info is-responsive">
        Wubbzy's Underwater Adventure
      </a>
      <a @click="load('/swf/wubbgames/discodancing.swf')" class="button is-info is-responsive">
        Disco Dancin' Wubbzy
      </a>
      <a @click="load('/swf/wubbgames/kickball.swf')" class="button is-info is-responsive">
        Kickety Kick Ball Bounce Out!
      </a>
      <a @click="load('/swf/wubbgames/sketchitysketchpad.swf')" class="button is-info is-responsive">
        Sketchity Sketch Pad
      </a>
      <a @click="load('/swf/wubbgames/stackums.swf')" class="button is-info is-responsive">
        Wuzzleburg Stack-ums
      </a>
      <a @click="load('/swf/wubbgames/wubbhunt.swf')" class="button is-info is-responsive">Wacky Wubb
        Hunt</a>
      <a @click="load('/swf/wubbzy_s_soap_bubble_flyer_game.swf')" class="button is-info is-responsive">
        Wubbzy's Soap Bubble Flyer Game
      </a>
    </div>
  </div>
</template>

<style>
ruffle-player {
  width: 100%;
  height: calc(100vh - 8rem);
}
</style>

<script>
import "ruffle-mirror/ruffle.js";
window.RufflePlayer = window.RufflePlayer || {};
window.RufflePlayer.config = {
  publicPath: "/js/ruffle/",
};
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
    document.body.className = "wwd";
  },
  beforeRouteLeave(to, from, next) {
    const container = document.getElementById("game");
    if (container.children[0]) container.removeChild(container.children[0]);
    container.style.display = "none";
    next();
  },
  methods: {
    load(link) {
      this.clicked = true;
      const ruffle = window.RufflePlayer.newest();
      const container = document.getElementById("game");
      container.style.display = "";
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
