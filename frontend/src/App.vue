<template>
  <div class="container">
    <router-view v-if="loaded" />
    <h1 v-else class="title">{{ text }}</h1>
  </div>
  <footer v-if="loaded">
    <navbar :logged="logged" :tag="user.tag"></navbar>
  </footer>
</template>

<style scoped>
.container {
  padding: 1rem;
}
</style>

<style>
#app {
  text-align: -webkit-center;
}

html {
  background: none !important;
}

body {
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.main {
  background-image: url("./assets/main.webp");
}

.wwd {
  background-image: url("./assets/wwd.webp");
}

.birthdaycards {
  background-image: url("./assets/birthdaycards.webp");
}

.birthdaysubmit {
  background-image: url("./assets/birthdaysubmit.webp");
}

footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #1f1f1f;
  color: white;
  text-align: center;
  font-size: 0.88em;
}

.box {
  background-color: #fff9e0fa;
}

.field {
  margin: 1em;
}

.buttons {
  justify-content: space-evenly;
}

.content {
  white-space: pre-wrap;
}
</style>

<script>
import navbar from "./partials/web-navbar.vue";
export default {
  data() {
    return {
      loaded: false,
      logged: false,
      text: "Loading...",
      user: {
        id: "",
        tag: "stranger",
        inserver: false,
        verified: false,
        admin: false,
      },
    };
  },
  components: { navbar },
  created() {
    this.axios.defaults.withCredentials = true;
    this.getUser();
  },
  methods: {
    getUser() {
      this.axios
        .get(`${window.apiDomain}/user`)
        .then((e) => {
          if (e.data.logged) {
            this.user.id = e.data.user.id;
            this.user.tag = e.data.user.tag;
            this.user.inserver = e.data.user.inserver;
            this.user.verified = e.data.user.verified;
            this.user.admin = e.data.user.admin;
            this.logged = true;
          }
          this.loaded = true;
        })
        .catch((err) => {
          if (err.response?.data) this.text = err.response.data;
          else this.text = err.toString();
        });
    },
  },
};
</script>