<template>
  <div class="searchProfile_quicksetting_wrapper" v-if="newProfile?.analyser">
    <div class="searchProfile_quicksetting">
      <p>Fault Tolerance</p>
      <InputToggle :toggleValue="newProfile.analyser.faultTolerant" @click="toggleSettingQS('faultTolerant')" />
    </div>
    <div class="searchProfile_quicksetting">
      <p>Partial Word Search</p>
      <InputToggle :toggleValue="newProfile.analyser.partialWordSearch" @click="toggleSettingQS('partialWordSearch')" />
    </div>
    <div class="searchProfile_quicksetting">
      <div class="searchProfile_quicksetting_infotext">
        <p>Is Queryable</p>
        <p class="searchprofileSample_setting_content_text_small">This option will deactivate the relative threshold</p>
      </div>
      <InputToggle :toggleValue="newProfile.queryable" @click="newProfile.queryable = !newProfile.queryable" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import InputToggle from "@/components/Input/InputToggle.vue";

export default {
  name: "SearchTypes",
  components: {
    InputToggle,
  },
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
  methods: {
    toggleSettingQS(setting) {
      this.newProfile.analyser[setting] = !this.newProfile.analyser[setting];
    },
  },
  mounted() {
    this.newProfile = this.profile;
  },
};
</script>
