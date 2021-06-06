<template>
  <div>
    <img id="wubbzypedia_logo" src="https://vignette.wikia.nocookie.net/wubbzy/images/e/e6/Site-logo.png/revision/latest?cb=20210601233744&format=original" alt="wubbzypedia logo">
    <h2 class="subtitle" style="font-size: xx-large">
      <span class="wubbzypedia-color">
        The wubbtastic online Wubbzy encyclopedia that anyone can edit.</span
      >
    </h2>
    <p class="wubbzypedia-text">
      <span class="wubbzypedia-color">
        This wiki contains everything a Wubbzy fan should and will want to know,
        written by various community members and various casual editors.
      </span>
    </p>
    <br />
    <p class="wubbzypedia-text">
      <span class="wubbzypedia-color">
        It is the place where our community began, and it grew little by little,
        now it has more than 1000 pages about the show!
      </span>
    </p>
    <br />
    <p class="wubbzypedia-text">
      <span class="wubbzypedia-color">
        We invite you to read the wiki and remember your childhood! If you think
        there is a mistake or want to add something, you are welcome to do so!
      </span>
    </p>
    <br />
    <p class="wubbzypedia-text">
      <span class="wubbzypedia-color">
        Hosted on the FANDOM wiki hosting service.</span
      >
    </p>
    <div class="buttons fix">
      <a href="https://wubbzy.fandom.com/wiki/Wubbzypedia"
        ><button class="button wubbzypedia-button is-info">Main Page</button></a
      >
      <a href="https://wubbzy.fandom.com/es/wiki/Wubbzypedia"
        ><button class="button wubbzypedia-button is-info">
          Wubbzypedia in Spanish
        </button></a
      >
      <a href="https://wubbzy.fandom.com/wiki/Wubbzypedia:About"
        ><button class="button wubbzypedia-button is-info">
          About and more history
        </button></a
      >
    </div>
  </div>
</template>

<style>

#wubbzypedia_logo {
    padding-top: 10px;
    width: 20em;
}

.wubbzypedia-button {
  font-size: 20px;
}

.wubbzypedia-text {
  font-size: 20px;
}

.wubbzypedia-color {
  background-color: rgb(93, 253, 72);
  border-radius: 0.5em;
  padding: 3px;
  color: #000
}
</style>

<script>
export default {
  created() {
    document.getElementsByTagName("body")[0].style.backgroundImage =
      "url(https://vignette.wikia.nocookie.net/wubbzy/images/8/8f/All_wubbzys_from_season_2.jpg/revision/latest?cb=20131209204702&format=original)";
  },
};
</script>