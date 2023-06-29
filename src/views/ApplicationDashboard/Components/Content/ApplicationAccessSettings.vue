<template>
  <GridContentComponent :name="'Access Setting'">
    <div class="miniTable_wrapper">
      <div>
        <p>Add new User</p>
        <InputComponent @blur="addNewUser" @enter="addNewUser" :removeTextafterSoftProgress="true" />
      </div>
      <div v-if="allUser.length > 0">
        <div v-for="user in allUser" :key="user" class="miniTable_row">
          <p>{{ user }}</p>
          <span class="miniTable_row_rightCluster">
            <CopyToClipIcon @ctc="ctc(user)" />
            <p @click="removeUser(user)" class="miniTable_pointer">❌</p>
          </span>
        </div>
      </div>
      <div v-else>
        <p>There are no active user in this application.</p>
      </div>
    </div>
  </GridContentComponent>  
</template>

<script>
import GridContentComponent from "@/components/GridContentComponent.vue";
import InputComponent from "@/components/Input/InputComponent.vue";
import api from "@/apiService.js";
import CopyToClipIcon from "@/assets/Icons/CopyToClipIcon.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "ApplicationAccessSettings",
  components: {
    GridContentComponent,
    InputComponent,
    CopyToClipIcon,
  },
  data() {
    return {};
  },
  computed: {
    allUser() {
      if (this.currentApplication?.allowedUserIds?.length >= 0) return this.currentApplication.allowedUserIds; //userIds can be null if list is empty
      return [];
    },
    ...mapState({
      currentApplication: (state) => state.currentApplication,
    }),
  },
  methods: {
    ctc(value) {
      navigator.clipboard.writeText(value);
    },
    async addNewUser(newUser) {
      if (newUser.length > 2) {
        let allowedUserIds = [...this.allUser];
        const userIndex = allowedUserIds.findIndex((id) => id == newUser);

        if (userIndex === -1) {
          allowedUserIds.push(newUser);

          const newapplication = {
            name: this.currentApplication.name,
            numberOfDocuments: this.currentApplication.numberOfDocuments,
            allowedUserIds,
          };

          await api.put(`api/v1/applications/${this.currentApplication.id}`, newapplication);
          this.fetchcurrentApplication(this.currentApplication.id);
        } else {
          this.$store.commit("setNotification", { message: "The user already exists." });
        }
      } else {
        this.$store.commit("setNotification", { message: "The user-id must have 2 letters minimum." });
      }
    },
    async removeUser(userId) {
      let allowedUserIds = [...this.allUser];
      const userIndex = allowedUserIds.findIndex((id) => id == userId);
      allowedUserIds.splice(userIndex, 1);

      const newapplication = {
        name: this.currentApplication.name,
        numberOfDocuments: this.currentApplication.numberOfDocuments,
        allowedUserIds,
      };

      await api.put(`api/v1/applications/${this.currentApplication.id}`, newapplication);
      this.fetchcurrentApplication(this.currentApplication.id);
    },
    ...mapActions({
      fetchcurrentApplication: "fetchcurrentApplication",
    }),
  },
};
</script>

<style lang="scss"></style>
