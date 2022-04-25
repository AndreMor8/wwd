<template>
  <h1 v-if="!logged" class="title main_title">
    You must login with Discord on this website first.
  </h1>
  <h1 v-else-if="!loaded" class="title main_title">Loading...</h1>
  <h1 v-else-if="loaded && logged && !canPublish" class="title main_title">
    You need the 'Wubbzy-Media Publisher' role on Wow Wow Discord to post new
    content here.
  </h1>
  <div v-else-if="loaded && logged && canPublish">
    <h1 class="birthday_title title main_title">
      Create a new Wubbzy multimedia post
    </h1>
    <h2 class="subtitle">
      Thank you for your effort to continue preserving the show :)
    </h2>
    <form id="wwd_media_publish_form" @submit.prevent="sendPost">
      <div class="field">
        <div class="control">
          <input
            class="input is-info"
            type="text"
            placeholder="What is this? (title)"
            v-model="post.title"
            name="title"
            required
            :disabled="sended"
          />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <textarea
            class="textarea is-info"
            name="description"
            v-model="post.description"
            type="text"
            placeholder="Tell us more about this (description)"
            :disabled="sended"
          ></textarea>
        </div>
      </div>
      <div class="field">
        <h2 class="subtitle">Post type</h2>
        <div class="control">
          <label class="radio">
            <input
              type="radio"
              name="type"
              v-model.number="post.type"
              :value="0"
              :disabled="sended"
            />
            <b> Episode</b> compilation (eg. a Drive with episodes)</label
          ><br />
          <label class="radio">
            <input
              type="radio"
              name="type"
              v-model.number="post.type"
              :value="1"
              :disabled="sended"
            />
            Another compilation (eg. a Drive with music videos)</label
          ><br />
          <label class="radio">
            <input
              type="radio"
              name="type"
              v-model.number="post.type"
              :value="2"
              :disabled="sended"
            />
            Individual <b>episode</b></label
          ><br />
          <label class="radio">
            <input
              type="radio"
              name="type"
              v-model.number="post.type"
              :value="3"
              :disabled="sended"
            />
            Another individual material
          </label>
        </div>
      </div>

      <div class="field">
        <p
          class="control buttons is-right"
          style="position: absolute; right: 12px"
        >
          <a @click="addMirror">
            <button
              class="button is-primary is-success is-responsive"
              :disabled="sended || post.mirrors.length >= 10"
            >
              Add mirror
            </button>
          </a>
        </p>
        <h2 class="subtitle">Mirrors / Sources</h2>
        <h3>You can add up to 10 mirrors of the same content.</h3>
      </div>
      <div
        class="field has-addons"
        v-for="(mirror, index) in post.mirrors"
        :key="index"
      >
        <div class="control is-expanded">
          <input
            class="input is-link"
            type="text"
            placeholder="Mirror name"
            v-model="mirror.name"
            required
            :disabled="sended"
          />
        </div>
        <div class="control is-expanded">
          <input
            class="input is-link"
            type="url"
            placeholder="Source URL"
            v-model="mirror.url"
            required
            :disabled="sended"
          />
        </div>
        <div v-if="post.mirrors.length > 1" class="control">
          <a @click="removeMirror(index)"
            ><button class="button is-danger" :disabled="sended">
              Remove
            </button></a
          >
        </div>
      </div>
      <br v-if="spanText !== 'Please wait...' || sended" />
      <span v-if="spanText !== 'Please wait...' || sended" class="form-span">{{
        spanText
      }}</span>
      <br v-if="spanText !== 'Please wait...' || sended" />
      <div class="field">
        <div class="control buttons is-centered">
          <input
            class="button is-primary"
            type="submit"
            value="Submit"
            :disabled="sended"
          />
          <button @click="goBack" class="button is-danger" :disabled="sended">
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
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
      loaded: false,
      logged: this.$root.logged,
      canPublish: false,
      post: {
        title: "",
        description: "",
        mirrors: [{ name: "", url: "" }],
        type: 0,
      },
      sended: false,
      spanText: "Please wait...",
    };
  },
  created() {
    document.body.className = "";
    this.logged = this.$root.logged;
    if (this.logged) {
      this.loggedID = this.$root.user.id;
      this.checkStatus();
    }
  },
  methods: {
    goBack() {
      if (this.sended) return;
      this.$router.push("/wubbzy-media");
    },
    checkStatus() {
      this.axios.get("/api/wm/posts?check=1").then((e) => {
        this.canPublish = e.data.wmui.publish;
        this.loaded = true;
      });
    },
    addMirror() {
      if (this.sended) return;
      if (this.post.mirrors.length >= 10) return;
      this.post.mirrors.push({ name: "", url: "" });
    },
    removeMirror(index) {
      if (this.post.mirrors.length <= 1) return;
      if (this.sended) return;
      this.post.mirrors.splice(index, 1);
    },
    sendPost() {
      if (this.sended) return;
      this.sended = true;
      this.spanText = "Please wait...";
      this.axios
        .post("/api/wm/posts", this.post)
        .then(() => {
          this.$router.push("/wubbzy-media");
        })
        .catch((err) => {
          //console.error(err.response.data.message);
          this.spanText = `Error: ${err.response.data.message}`;
          this.sended = false;
        });
    },
  },
};
</script>