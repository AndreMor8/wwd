<template>
  <h1 v-if="!loaded" class="title">Loading...</h1>
  <div v-else>
    <div class="container">
      <h1 class="title" style="font-size: 3rem;">
        Birthday cards
      </h1>
      <router-link v-if="logged && button" to="/birthday-cards/submit" class="button is-info is-light is-focused">
        Add new birthday card
      </router-link>
    </div>
    <br />
    <h2 class="subtitle">Select a year</h2>
    <div id="wwd_birthday_buttons" class="buttons">
      <year v-for="year_obj in available_years" :key="year_obj.year" :year="year_obj"></year>
    </div>
    <h2 v-if="!logged && button" class="subtitle">
      To add a birthday card, login with Discord.
    </h2>
  </div>
</template>

<script>
import year from "../partials/birthday-year.vue";
export default {
  components: { year },
  data() {
    return {
      loaded: false,
      available_years: [],
      button: false,
      logged: this.$root.logged,
    };
  },
  created() {
    document.body.className = "";
    this.logged = this.$root.logged;
    this.getYears();
  },
  methods: {
    getYears() {
      this.axios.get(`${window.apiDomain}/birthday-cards`).then((e) => {
        this.available_years = e.data?.sort((a, b) => a.year - b.year);
        this.button = e.data.some((a) => a.enabled);
        this.loaded = true;
      });
    },
  },
};
</script>