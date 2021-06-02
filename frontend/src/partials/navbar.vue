<template>
  <nav
    class="navbar is-warning is-fixed-bottom"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <div class="navbar-item">
        <router-link to="/"><img src="/icon.gif" alt="wwd_icon" /></router-link>
      </div>
      <a
        role="button"
        class="navbar-burger"
        data-target="navMenu"
        aria-label="menu"
        aria-expanded="false"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" id="navMenu">
      <div class="navbar-start">
        <router-link to="/about" class="navbar-item"> About us </router-link>
        <a href="https://discord.gg/5qx9ZcV" class="navbar-item">
          Server invite link
        </a>
      </div>
      <div class="navbar-end">
        <router-link to="/games" class="navbar-item"> Games </router-link>
        <a href="mailto:admins@wubb.ga" class="navbar-item"> admins@wubb.ga </a>

        <div v-if="logged" class="navbar-item">
          <h1>Welcome, {{ tag }}</h1>
        </div>

        <div class="navbar-item">
          <div class="buttons">
            <form v-if="logged" action="/api/auth/logout">
              <button
                class="button is-primary is-rounded"
                style="font-size: 0.95em"
                type="submit"
              >
                Logout
              </button>
            </form>

            <form v-else action="/api/auth/">
              <button
                class="button is-primary is-rounded"
                style="font-size: 0.95em"
                type="submit"
              >
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