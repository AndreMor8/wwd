<template>
  <div class="box" v-if="loaded && !sendedBefore && enabled">
    <h1 id="birthday_title" class="title">
      Write a birthday card to Wubbzy!
    </h1>
    <h2 class="subtitle">
      Wubbzy will be very grateful for congratulating him :)
    </h2>
    <form id="wwd_birthday_card_form" @submit.prevent="sendCard">
      <div class="field">
        <div class="control">
          <textarea class="textarea is-medium is-info" name="card" v-model="card.card" type="text"
            placeholder="Write a card for him. Wish him the best" required></textarea>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <textarea class="textarea is-small is-link" name="additional" v-model="card.additional" type="text"
            placeholder="Do you want to say something to the staff or the community? Write it here. (optional)"></textarea>
        </div>
      </div>
      <br />
      <input type="checkbox" id="anon" v-model="card.anon" /><span>Make this card anonymous when approving it.</span>
      <br />
      <br />
      <span v-if="sended || spanText !== 'Please wait...'" class="form-span">{{ spanText }}</span>
      <br v-if="sended || spanText !== 'Please wait...'" />
      <br v-if="sended || spanText !== 'Please wait...'" />
      <input v-if="!sended" class="button is-success is-light is-focused" type="submit" value="Submit" />
    </form>
  </div>
  <div v-else-if="!logged" class="box">
    <h1 class="title">
      You must login with Discord on this website first.
    </h1>
  </div>
  <div v-else-if="!loaded" class="box">
    <h1 class="title">Loading...</h1>
  </div>
  <div v-else-if="!enabled" class="box">
    <h1 class="title">
      There is no enabled year where you can send cards.
    </h1>
  </div>
  <div v-else-if="sendedBefore" class="box">
    <h1 class="title">
      You already made your card!
    </h1>
  </div>
</template>

<style scoped>
#birthday_title {
  color: #FEE382;
  -webkit-text-stroke: 1px black;
  font-size: 2.9rem;
  margin-bottom: 2rem;
}

.form-span {
  padding: 3px;
  margin-top: 10px;
  font-size: 20px;
  color: #000;
  background-color: rgb(205, 218, 255);
  max-width: 50em;
}
</style>

<script>
export default {
  data() {
    return {
      loaded: false,
      logged: this.$root.logged,
      card: {
        card: "",
        additional: "",
        anon: false,
      },
      enabled: false,
      sended: false,
      spanText: "Please wait...",
      sendedBefore: false,
    };
  },
  created() {
    document.body.className = "birthdaysubmit";
    this.logged = this.$root.logged;
    if (this.logged) this.isSendedBefore();
  },
  methods: {
    isSendedBefore() {
      this.axios.get(`${window.apiDomain}/birthday-cards/checkcard`).then((e) => {
        this.enabled = e.data.enabled;
        this.sendedBefore = e.data.sended;
        this.loaded = true;
      });
    },
    sendCard() {
      this.sended = true;
      this.spanText = "Please wait...";
      this.axios
        .post(`${window.apiDomain}/birthday-cards/submit`, this.card)
        .then(() => {
          this.spanText = "Your card was sent successfully.";
          alert(
            "Your card was sent successfully, now you must wait for a moderator to accept it."
          );
          location.reload();
        })
        .catch((err) => {
          //console.error(err);
          this.spanText = `Error: ${err.response.data.message}`;
          this.sended = false;
        });
    },
  },
};
</script>