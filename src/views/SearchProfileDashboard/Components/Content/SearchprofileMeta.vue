<template>
  <div class="metaTable_fixedData_wrapper">
    <div class="metaTable_fixedData underlined">
      <span class="metaTable_fixedData_title">
        <p>Profile Name:</p>
        <CopyToClipIcon class="metaTable_fixedData_title_icon" @ctc="ctc(profile.name)" />
      </span>
      <InputComponent :setValue="profile.name" @blur="editSearchprofile" @enter="editSearchprofile" />
    </div>
    <div class="metaTable_fixedData underlined">
      <span class="metaTable_fixedData_title">
        <p>Created by:</p>
        <CopyToClipIcon class="metaTable_fixedData_title_icon" @ctc="ctc(profile.creatorId)" />
      </span>
      <p class="metaTable_fixedData_value">{{ profile.creatorId }}</p>
    </div>
    <div class="metaTable_fixedData underlined">
      <span class="metaTable_fixedData_title">
        <p>Last Edited by:</p>
        <CopyToClipIcon class="metaTable_fixedData_title_icon" @ctc="ctc(profile.lastEditorId)" />
      </span>
      <p class="metaTable_fixedData_value">{{ profile.lastEditorId }}</p>
    </div>
    <div class="metaTable_fixedData underlined">
      <span class="metaTable_fixedData_title">
        <p>Last Modified at:</p>
        <CopyToClipIcon class="metaTable_fixedData_title_icon" @ctc="ctc(profile.lastModifiedDate)" />
      </span>
      <p class="metaTable_fixedData_value">{{ profile.lastModifiedDate }}</p>
    </div>
    <div class="metaTable_fixedData underlined">
      <span class="metaTable_fixedData_title">
        <p>Application ID:</p>
        <CopyToClipIcon class="metaTable_fixedData_title_icon" @ctc="ctc(profile.applicationId)" />
      </span>
      <p class="metaTable_fixedData_value">{{ profile.applicationId }}</p>
    </div>
    <div class="metaTable_fixedData underlined">
      <span class="metaTable_fixedData_title">
        <p>Searchprofile ID:</p>
        <CopyToClipIcon class="metaTable_fixedData_title_icon" @ctc="ctc(profile.profileId)" />
      </span>
      <p class="metaTable_fixedData_value">{{ profile.profileId }}</p>
    </div>
  </div>
</template>

<script>
import CopyToClipIcon from "@/assets/Icons/CopyToClipIcon.vue";
import InputComponent from "@/components/Input/InputComponent.vue";

import { mapState, mapActions } from "vuex";
import api from "@/apiService.js";

export default {
  name: "SearchprofileMeta",
  components: {
    CopyToClipIcon,
    InputComponent
  },
  props: {
    profile: { type: Object, default: () => {} }
  },
  data() {
    return {
      showConfirmScreenForRemove: false
    };
  },
  computed: {
    ...mapState({
      currentApplication: (state) => state.currentApplication
    })
  },
  methods: {
    ctc(value) {
      navigator.clipboard.writeText(value);
    },
    async editSearchprofile(e) {
      let oldFile = { ...this.profile };
      oldFile.name = e;
      await api.put(`api/v1/searchprofiles/${this.profile.profileId}`, oldFile);
    },
    ...mapActions({
      fetchSearchprofiles: "fetchSearchprofiles"
    })
  }
};
</script>

<style lang="scss"></style>
