<template>
  <h1 v-if="invalid" class="subtitle main_title">Invalid year!</h1>
  <h1 v-else-if="!loaded" class="title main_title">Loading...</h1>
  <div v-else>
    <router-link
      v-if="logged && button"
      to="/birthday-cards/submit"
      style="right: 0; padding-right: 1em; padding-top: 1em; position: absolute"
    >
      <button class="button is-info is-light">Add new birthday card</button>
    </router-link>
    <h1
      class="birthday_title title main_title"
      style="text-align: center; margin-bottom: 15px"
    >
      Birthday cards for Wubbzy! ({{ year }})
    </h1>
    <div v-if="!!cards.length">
      <div class="box" v-for="card in cards" :key="card._id">
        <card
          :card="card.card"
          :additional="card.additional"
          :userID="card.userID"
          :adminmode="false"
          :anon="card.anon"
          :username="card.username"
          :avatar="card.avatar"
        ></card>
      </div>
    </div>
    <div v-else>
      <b
        ><h2 class="subtitle" style="font-size: 2em">
          Nothing yet :( Let's add one!
        </h2></b
      >
    </div>
  </div>
</template>

<style>
.birthday {
  text-align: left;
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