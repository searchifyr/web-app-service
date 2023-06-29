<template>
  <div class="home">
    <SearchProfileWrapper />
  </div>
</template>

<script>
import SearchProfileWrapper from "@/views/SearchProfileDashboard/Components/SearchProfileWrapper.vue";

export default {
  name: "SearchProfileDashboardView",
  components: {
    SearchProfileWrapper,
  },
};
</script>
