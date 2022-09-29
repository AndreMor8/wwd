<template>
  <nav class="navbar is-warning is-fixed-bottom" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-item">
        <router-link to="/"><img src="../assets/icon.webp" alt="wwd_icon" width="28" height="28" /></router-link>
      </div>
      <a role="button" class="navbar-burger" data-target="navMenu" aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" id="navMenu">
      <div class="navbar-start">
        <a href="https://archive.wubbworld.xyz" class="navbar-item">
          Archives
        </a>
        <a href="https://discord.gg/5qx9ZcV" class="navbar-item">
          Server invite link
        </a>
      </div>
      <div class="navbar-end">
        <a href="mailto:admins@wubbworld.xyz" class="navbar-item"> admins@wubbworld.xyz </a>

        <div v-if="logged" class="navbar-item">
          <h1>Welcome, {{ tag }}</h1>
        </div>

        <div class="navbar-item">
          <div class="buttons">
            <form v-if="logged" :action="apiDomain + '/auth/logout'">
              <button class="button is-info is-rounded is-light is-focused" style="font-size: 0.95em" type="submit">
                Logout
              </button>
            </form>

            <form v-else :action="apiDomain + '/auth/'">
              <button class="button is-info is-rounded is-light is-focused" style="font-size: 0.95em" type="submit">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: ["logged", "tag"],
  data: function () {
    return {
      apiDomain: window.apiDomain
    }
  },
  mounted() {
    this.$nextTick(function () {
      const $navbarBurgers = Array.prototype.slice.call(
        document.querySelectorAll(".navbar-burger"),
        0
      );
      if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach((el) => {
          el.addEventListener("click", () => {
            const target = el.dataset.target;
            const $target = document.getElementById(target);
            el.classList.toggle("is-active");
            $target.classList.toggle("is-active");
          });
        });
      }
    });
  },
};
</script>