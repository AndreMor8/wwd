<template>
  <h1 class="title">Not Found</h1>
</template>

<script>
export default {
  data: function () {
    return {
      timeout: null,
    };
  },
  created: function () {
    document.body.className = "";
    const router = this.$router;
    this.timeout = setTimeout(() => router.replace("/"), 4000);
  },
  beforeRouteLeave(to, from, next) {
    clearTimeout(this.timeout);
    next();
  },
};
</script>