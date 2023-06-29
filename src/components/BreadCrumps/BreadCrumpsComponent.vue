<!--
* < Concept-Name: BreadCrumpsComponent >
* <p>This component handles the navigation-path-component displayed on the top left. It serves as a 
navigational tool for the dashboard- (My Application & Other Applications), application-seetings-
and searchprofile-settings-page. In addition to that this component displays a save-, reset- and 
delete-button on the mentioned pages depeing on utilization. The if-condition for this is 
handled in this component file so that the component could easily be integrated into future pages.</p>

* @author: anonymous
* @version 1.2
* @since   2023-05-01
-->
<template>
  <div class="breadCrumps_wrapper">
    <div class="overlayBox">
      <span v-for="(item, i) in navPath" :key="i" class="breadCrumps">
        <p @click="pushroute(item.routeTo)" class="breadCrumps_item">{{ item.name }}</p>
        <p v-if="i != navPath.length - 1">-></p>
      </span>
    </div>
    <div v-if="currentApplication?.id" class="buttons_wrapper">
      <button v-if="$route.name == 'searchprofile'" class="buttons_reset" @click="resetSearchprofile">Reset</button>
      <button v-if="$route.name == 'searchprofile'" class="buttons_save" @click="updateSearchprofile">Save</button>
      <button class="buttons_delete" @click="showConfirmScreenForRemove = !showConfirmScreenForRemove">Delete</button>
    </div>
  </div>
  <Transition name="confirm-screen">
    <ConfirmationOverlay v-if="showConfirmScreenForRemove">
      <button @click="showConfirmScreenForRemove = false">Cancel</button>
      <button @click="remove()">OK</button>
    </ConfirmationOverlay>
  </Transition>
</template>

<!--
* The Confirmation-Overlay is a seperate component created for validating user-input and can be found in ./components.

* The heart of the navigational tool is "navPath". It uses params set in the ./store/index.js to return the array
containing the previous path-names. "isGlobal" determines if an application falls under "My Applications" or 
"Other Applications" and is defined in the store. 
-->
<script>
import api from "@/apiService.js";
import { mapState, mapActions } from "vuex";
import ConfirmationOverlay from "@/components/ConfirmationOverlay.vue";

export default {
  components: {
    ConfirmationOverlay
  },
  data() {
    return {
      showConfirmScreenForRemove: false
    };
  },
  computed: {
    navPath() {
      let locationNames = [];
      if (this.isGlobal) {
        locationNames.push({ name: "Other Applications", routeTo: { name: "dashboard" } });
      } else {
        locationNames.push({ name: "My Applications", routeTo: { name: "dashboard" } });
      }

      if (this.currentApplication?.name) {
        locationNames.push({ name: this.currentApplication.name, routeTo: { name: "dashboard", params: { application: this.currentApplication.id } } });
      }
      if (this.profile && this.$route.name == "searchprofile") {
        locationNames.push({ name: this.profile?.name, routeTo: {} });
      }

      return locationNames;
    },

    ...mapState({
      isGlobal: (state) => state.isGlobal,
      currentApplication: (state) => state.currentApplication,
      profile: (state) => state.profile
    })
  },

  methods: {

    // Handles route-pathing for click-events found in the HTML part. Determines the path based on store-data.    
    pushroute(locationRoute) {
      if (locationRoute.name == "dashboard" && locationRoute.params?.application === undefined) {
        this.$store.commit("setCurrentApplication", {});
      }
      this.$router.push(locationRoute);
    },

    /* Handles functionality for the update-button found in searchprofile-settings only. 
    THe update is handled via API-request using the profileID and updating/sending the entire searchprofile. 
    Afterwards a notification is being called via store.*/
    async updateSearchprofile() {
      const request = await api.put(`api/v1/searchprofiles/${this.profile.profileId}`, this.profile);

      if (request.status === undefined || request.status < 400) {
        request.message = "The searchprofile was updated successfully";
      }
      this.$store.commit("setNotification", { type: "info", ...request });
    },

    /* Handles functionality for the reset-button found in searchprofile-settings only. 
    This prompts an API-request asking for data stored in the backend and therefor resetting the searchprofile. */
    async resetSearchprofile() {
      const request = await api.get(`api/v1/searchprofiles/${this.profile.profileId}`);
      this.$store.commit("setProfile", request);
    },

    /* Handles functionality for the remove-button found in searchprofile-settings and application-settings only. 
    Removal is handled via specific API-endpoints just for this purpose.*/
    async remove() {
      if (this.$route.name == "searchprofile") {
        await api.delete(`api/v1/searchprofiles/${this.$route.params.searchprofile}`);
        this.showConfirmScreenForRemove = false;
        this.fetchSearchprofiles(this.currentApplication.id);
        this.$router.push({ name: "dashboard", params: { application: this.currentApplication.id } });
      } else if (this.$route.name == "dashboard") {
        await api.delete(`api/v1/applications/${this.$route.params.application}`);
        this.$store.commit("setCurrentApplication", {});
        this.showConfirmScreenForRemove = false;
        this.$router.push({ name: "dashboard" });
      }
    },

    ...mapActions({
      fetchSearchprofiles: "fetchSearchprofiles",
      fetchcurrentApplication: "fetchcurrentApplication"
    })
  }
};
</script>

<style lang="scss">
.overlayBox {
  width: 60%;
  display: flex;
  margin-left: 10px;
  flex-wrap: nowrap;
}

.breadCrumps {
  display: flex;
  gap: 10px;
  font-weight: 800;
  font-size: 14px;
  padding: 0;
  border: 200px;
  cursor: pointer;
  margin-right: 10px;

  &_item {
    &:hover {
      height: 17px;
      border: 2px $company_blue;
      border-style: none none solid none;
    }
  }

  &_wrapper {
    display: flex;
    margin-left: 160px;
    height: 35px;
    justify-content: space-between;
  }
}

.buttons {
  &_wrapper {
    display: flex;
    flex-wrap: none;
    height: 35px;
    border: 2px;
    z-index: 1;
    margin: 19px 20px 0 0;
  }

  &_save {
    font-size: 1.1rem;
    width: 75px;
    height: 25px;
    background: $company_blue;
    color: #fafafa;
    margin: 0 15px 0 15px;
  }

  &_reset {
    font-size: 1.1rem;
    width: 75px;
    height: 25px;
  }

  &_delete {
    font-size: 1.1rem;
    width: 75px;
    height: 25px;
    background: $delete-red;
    color: #fafafa;
  }
}
</style>
