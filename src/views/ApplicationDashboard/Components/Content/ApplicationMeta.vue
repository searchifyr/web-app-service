<template>
  <GridContentComponent :name="currentApplication.name" v-if="currentApplication != {}">
    <div class="metaTable_fixedData_wrapper">
      <div class="metaTable_fixedData underlined">
        <span class="metaTable_fixedData_title">
          <p>Application Name:</p>
          <CopyToClipIcon class="metaTable_fixedData_title_icon" @ctc="ctc(currentApplication.name)" />
        </span>
        <InputComponent :setValue="setNameOfApplicationInput" @blur="updateApplication" @enter="updateApplication" />
      </div>
      <div class="metaTable_fixedData underlined">
        <span class="metaTable_fixedData_title">
          <p>ID:</p>
          <CopyToClipIcon class="metaTable_fixedData_title_icon" @ctc="ctc(currentApplication.id)" />
        </span>
        <p class="metaTable_fixedData_value">{{ currentApplication.id }}</p>
      </div>
      <div class="metaTable_fixedData underlined">
        <span class="metaTable_fixedData_title">
          <p>Date of creation:</p>
          <CopyToClipIcon class="metaTable_fixedData_title_icon" @ctc="ctc(currentApplication.createdDate)" />
        </span>
        <p class="metaTable_fixedData_value">{{ convertDate(currentApplication.createdDate) }}</p>
      </div>
      <div class="metaTable_fixedData underlined">
        <span class="metaTable_fixedData_title">
          <p>Creator:</p>
          <CopyToClipIcon class="metaTable_fixedData_title_icon" @ctc="ctc(currentApplication.creatorId)" />
        </span>
        <p class="metaTable_fixedData_value">{{ currentApplication.creatorId }}</p>
      </div>
      <div class="metaTable_fixedData underlined">
        <span class="metaTable_fixedData_title">
          <p>Number of Documents:</p>
          <CopyToClipIcon class="metaTable_fixedData_title_icon" @ctc="ctc(currentApplication.numberOfDocuments)" />
        </span>
        <p class="metaTable_fixedData_value">{{ currentApplication.numberOfDocuments }}</p>
      </div>
    </div>
  </GridContentComponent>
</template>

<script>
import GridContentComponent from "@/components/GridContentComponent.vue";
import InputComponent from "@/components/Input/InputComponent.vue";
import CopyToClipIcon from "@/assets/Icons/CopyToClipIcon.vue";
import api from "@/apiService.js";
import { mapState } from "vuex";
import dates from "@/helper/dates";

export default {
  name: "ApplicationMeta",
  components: {
    GridContentComponent,
    InputComponent,
    CopyToClipIcon,
  },
  data() {
    return {
      showConfirmScreenForRemove: false,
      setNameOfApplicationInput: "", // On change the application name will be set in the input
    };
  },
  computed: {
    ...mapState({
      currentApplication: (state) => state.currentApplication,
    }),
  },
  methods: {
    ctc(value) {
      navigator.clipboard.writeText(value);
    },
    convertDate(date) {
      return dates.dateToDDMMYYYYHHMM(date);
    },
    async updateApplication(e) {
      const response = await api.put(`api/v1/applications/${this.currentApplication.id}`, { name: e, isPublic: false });
      if (response) {
        const newApplicaiton = { ...this.currentApplication };
        newApplicaiton.name = e;
        this.$store.commit("setCurrentApplication", newApplicaiton);
      }
    },
  },
  watch: {
    currentApplication() {
      this.setNameOfApplicationInput = this.currentApplication.name;
    },
  },
  mounted() {
    this.setNameOfApplicationInput = "";
    this.$nextTick(() => {
      this.setNameOfApplicationInput = this.currentApplication?.name;
    });
  },
};
</script>

<style lang="scss"></style>
