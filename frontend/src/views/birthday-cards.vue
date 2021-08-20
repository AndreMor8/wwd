<template>
  <div>
    <h1 v-if="!loaded" class="title main_title">Loading...</h1>
    <div v-else>
      <router-link
        v-if="logged && button"
        to="/birthday-cards/submit"
        style="right: 0; padding-right: 1em; padding-top: 1em; position: absolute"
      >
        <button class="button is-info is-light">Add new birthday card</button>
      </router-link>
      <h1
        class="title main_title"
        style="text-align: center; margin-bottom: 15px"
      >
        Birthday cards
      </h1>
      <h2 class="subtitle">Select a year</h2>
      <div id="wwd_birthday_buttons" class="buttons fix">
        <year
          v-for="year_obj in available_years"
          :key="year_obj.year"
          :year="year_obj"
        ></year>
      </div>
      <h2 v-if="!logged && button" class="subtitle">To add a birthday card, login with Discord.</h2>
    </div>
  </div>
</template>

<script>
import year from "../partials/year.vue";
export default {
  components: { year },
  data() {
    return {
      loaded: false,
      available_years: [],
      button: false,
      logged: this.$root.logged
    };
  },
  created() {
    document.body.className = "";
    this.logged = this.$root.logged;
    this.getYears();
  },
  methods: {
    getYears() {
      this.axios.get("/api/birthday-cards").then((e) => {
        this.available_years = e.data;
        this.button = e.data.some((a) => a.enabled);
        this.loaded = true;
      });
    },
  },
};
</script>