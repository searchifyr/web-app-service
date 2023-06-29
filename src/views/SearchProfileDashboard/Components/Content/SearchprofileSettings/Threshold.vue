<template>
  <div class="searchProfile_quicksetting_wrapper">
    <div class="searchProfile_quicksetting">
      <p>Absolute Threshold</p>
      <input type="number" :value="newProfile.minScore" step="0.1" min="0" @change="$event.target.value >= 0 ? (newProfile.minScore = $event.target.value) : (newProfile.minScore = 0)" />
    </div>
    <div class="searchProfile_quicksetting">
      <p>Relative Threshold</p>
      <input type="number" :value="newProfile.relativeScore" step="0.1" min="0" @change="$event.target.value >= 0 ? (newProfile.relativeScore = $event.target.value) : (newProfile.relativeScore = 0)" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "thresholdS",
  components: {},
  data() {
    return {
      newProfile: {},
    };
  },
  watch: {
    profile() {
      this.newProfile = this.profile;
    },
  },
  computed: {
    ...mapState({
      profile: (state) => state.profile,
    }),
  },
  mounted() {
    this.newProfile = this.profile;
  },
};
</script>
