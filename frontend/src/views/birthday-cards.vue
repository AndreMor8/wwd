<template>
  <div>
    <h1 v-if="!loaded" class="title main_title">Loading...</h1>
    <div v-else>
      <h1 class="title main_title">Birthday cards</h1>
      <h2 class="subtitle">Select a year</h2>
      <div id="wwd_birthday_buttons" class="buttons fix">
        <year
          v-for="year_obj in available_years"
          :key="year_obj.year"
          :year="year_obj"
        ></year>
      </div>
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
    };
  },
  created() {
    document.getElementsByTagName("body")[0].style.backgroundImage = "none";
    this.getYears();
  },
  methods: {
    getYears() {
      this.axios.get("/api/birthday-cards").then((e) => {
        for (const year of e.data) {
          this.available_years.push(year);
        }
        this.loaded = true;
      });
    },
  },
};
</script>