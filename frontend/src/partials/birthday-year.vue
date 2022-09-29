<template>
  <router-link :to="'/birthday-cards/' + year.year" class="button year"
    :class="{ year_enabled: year.enabled, year_disabled: !year.enabled }">
    {{ year.year }}
  </router-link>
</template>

<style>
.year {
  font-weight: bold;
  font-size: xx-large;
  border-width: 0.16em;
}

.year:hover {
  background-color: lightgray;
}

.year_disabled {
  border-color: purple !important;
}

.year_enabled {
  border-color: green !important;
}
</style>

<script>
export default {
  props: ["year"],
};
</script>