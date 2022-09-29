<template>
  <h1 v-if="invalid" class="subtitle">Invalid year!</h1>
  <h1 v-else-if="!loaded" class="title">Loading...</h1>
  <div v-else>
    <div class="box">
      <h1 id="birthday_title" class="title">
        Birthday cards for Wubbzy! ({{ year }})
      </h1>
      <router-link v-if="logged && button" to="/birthday-cards/submit" class="button is-info is-light is-focused">
        Add new birthday card
      </router-link>
    </div>
    <div v-if="!!cards.length">
      <div class="box" v-for="card in cards" :key="card._id">
        <card :card="card.card" :additional="card.additional" :userID="card.userID" :adminmode="false" :anon="card.anon"
          :username="card.username" :avatar="card.avatar"></card>
      </div>
    </div>
    <div v-else>
      <b>
        <h2 class="subtitle" style="font-size: 2em">
          Nothing yet :( Let's add one!
        </h2>
      </b>
    </div>
  </div>
</template>

<style scoped>
#birthday_title {
  color: #FEE382;
  -webkit-text-stroke: 1px black;
  font-size: 2.9rem;
}
</style>

<script>
import card from "../../partials/birthday-card.vue";
export default {
  components: { card },
  data() {
    return {
      loaded: false,
      cards: [],
      year: this.$route.params.year,
      invalid: false,
      button: false,
      logged: this.$root.logged,
    };
  },
  created() {
    document.body.className = "birthdaycards";
    this.logged = this.$root.logged;
    this.getCards();
  },
  methods: {
    getCards() {
      this.axios
        .get(`${window.apiDomain}/birthday-cards/${this.$route.params.year}`)
        .then((e) => {
          this.cards = e.data.cards;
          this.button = e.data.enabled;
          this.loaded = true;
        })
        .catch(() => {
          this.invalid = true;
        });
    },
  },
};
</script>