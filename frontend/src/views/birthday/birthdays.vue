<template>
  <h1 v-if="invalid" class="subtitle main_title">Invalid year!</h1>
  <h1 v-else-if="!loaded" class="title main_title">Loading...</h1>
  <div v-else>
    <h1 id="birthday_title" class="title main_title">
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
      <h2 class="subtitle">Nothing yet :(</h2>
    </div>
  </div>
</template>

<style>
.birthday {
  text-align: left;
}

#birthday_title {
  color: #f0e285;
  -webkit-text-stroke: 1px black;
}
</style>

<script>
import card from "../../partials/card.vue";
export default {
  components: { card },
  data() {
    return {
      loaded: false,
      cards: [],
      year: this.$route.params.year,
      invalid: false,
    };
  },
  created() {
    document.getElementsByTagName("body")[0].style.backgroundImage =
      "url(https://vignette.wikia.nocookie.net/wubbzy/images/1/17/Birthday_Birthday_-_Capture_24.png/revision/latest?cb=20190905005643&format=original)";
    this.getCards();
  },
  methods: {
    getCards() {
      this.axios
        .get(`/api/birthday-cards/${this.$route.params.year}`)
        .then((e) => {
          for (const card of e.data) {
            this.cards.push(card);
          }
          this.loaded = true;
        })
        .catch(() => {
          this.invalid = true;
        });
    },
  },
};
</script>