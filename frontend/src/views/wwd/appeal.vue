<template>
  <div v-if="banned && loaded && !appealed">
    <h1 class="title main_title">Appeal your ban</h1>
    <h2 class="subtitle">Ban reason: {{ banReason }}</h2>
    <form id="wwd_ban_appeal" @submit.prevent="sendAppeal">
      <div class="field">
        <div class="control">
          <textarea
            class="textarea is-medium"
            name="reason"
            v-model="banAppeal.reason"
            type="text"
            placeholder="Why should we unban you? (max. 2000 characters)"
            required
          ></textarea>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <textarea
            class="textarea is-medium"
            name="additional"
            v-model="banAppeal.additional"
            type="text"
            placeholder="Do you want to indicate something outside of the appeal? Write it here. (max. 1000 characters)"
          ></textarea>
        </div>
      </div>
      <br />
      <span v-if="sended" class="form-span">{{ spanText }}</span>
      <br />
      <input v-if="!sended" class="button" type="submit" value="Submit" />
    </form>
  </div>
  <h1 v-else-if="!logged" class="title main_title">
    You must be logged before using this route!
  </h1>
  <h1 v-else-if="appealed" class="title main_title">
    You already made your appeal!
  </h1>
  <h1 v-else-if="!loaded" class="title main_title">Loading...</h1>
  <h1 v-else class="title main_title">You are not banned!</h1>
</template>

<style>
.form-span {
  padding: 3px;
  margin-top: 10px;
  font-size: 20px;
  color: #000;
  background-color: rgb(181, 200, 255);
  max-width: 50em;
}
</style>

<script>
export default {
  data() {
    return {
      logged: this.$root.logged,
      banned: false,
      loaded: false,
      banReason: "*unknown*",
      banAppeal: {
        reason: "",
        additional: "",
      },
      sended: false,
      spanText: "Please wait...",
      appealed: false,
    };
  },
  created() {
    document.body.className = "wwd";
    this.logged = this.$root.logged;
    if (this.logged) this.getBanInfo();
  },
  methods: {
    getBanInfo() {
      this.axios.get(`/api/appeal`).then((e) => {
        this.banned = e.data.banned;
        this.appealed = e.data.appealed;
        if (e.data.reason) this.banReason = e.data.reason;
        this.loaded = true;
      });
    },
    sendAppeal() {
      this.sended = true;
      this.axios
        .post("/api/appeal", this.banAppeal)
        .then(() => {
          this.spanText =
            "Your appeal has been sended! Now wait for an administrator to review it. Come back soon.";
        })
        .catch(() => {
          this.spanText = "Something happened!";
        });
    },
  },
};
</script>