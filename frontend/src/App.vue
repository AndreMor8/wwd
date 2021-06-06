<template>
  <div align="center">
    <router-view v-if="loaded" />
    <div v-else>
      <h1 class="title main_title">Loading...</h1>
    </div>
    <footer v-if="loaded">
      <navbar :logged="logged" :tag="user.tag"></navbar>
    </footer>
  </div>
</template>

<style>
html {
  background: none !important;
}

body {
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.main_title {
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 3em;
}

footer {
  position: fixed;
  float: inline-end;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #1f1f1f;
  color: white;
  text-align: center;
  font-size: 0.88em;
}
.box {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}
.field {
  margin: 1em;   
}

#container {
  margin: 1em;
}

.buttons.fix {
  margin: auto;
  padding: 10px;
  margin-top: 10px;
  display: block;
}

.buttons.fix a {
  padding: 2px;
}

</style>

<script>
import navbar from "./partials/navbar.vue";
export default {
  data() {
    return {
      loaded: false,
      logged: false,
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
    this.getUser();
  },
  methods: {
    getUser() {
      this.axios.get("/api/user").then((e) => {
        if (e.data.logged) {
          this.user.id = e.data.user.id;
          this.user.tag = e.data.user.tag;
          this.user.inserver = e.data.user.inserver;
          this.user.verified = e.data.user.verified;
          this.user.admin = e.data.user.admin;
          this.logged = true;
        }
        this.loaded = true;
      });
    },
  },
};
</script>