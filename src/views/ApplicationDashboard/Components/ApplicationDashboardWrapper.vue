<template>
  <BreadCrumpsComponent />
  <div :class="['dashboard_wrapper', 'dashboard_wrapper_applicationOverview', 'content-layout', isCreator ? 'dashboard_wrapper_applicationOverview_userOwner' : 'dashboard_wrapper_applicationOverview_userNotOwner']" v-if="isApplicationSelected">
    <ApplicationMeta />
    <AccessSettings class="dashboard_wrapper_applicationOverview_accessSetting" />
    <ApplicationSearchprofileList :name="'Searchprofiles'" class="dashboard_wrapper_applicationOverview_searchprofiles" />
    <JSONEdit class="dashboard_wrapper_applicationOverview_jsonEdit" />
    <APISettings v-if="isCreator"  :name="'APISettings'" class="dashboard_wrapper_applicationOverview_apiSettings" />
  </div>
  <div class="dashboard_wrapper content-layout" v-else>
    <MyApplications :name="'Applications'" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import MyApplications from "@/views/ApplicationDashboard/Components/ApplicationList.vue";
import BreadCrumpsComponent from "@/components/BreadCrumps/BreadCrumpsComponent.vue";
import ApplicationSearchprofileList from "@/views/ApplicationDashboard/Components/Content/ApplicationSearchprofileList.vue";
import ApplicationMeta from "@/views/ApplicationDashboard/Components/Content/ApplicationMeta.vue";
import AccessSettings from "@/views/ApplicationDashboard/Components/Content/ApplicationAccessSettings.vue";
import APISettings from "@/views/ApplicationDashboard/Components/Content/ApplicationAPISettings.vue/";
import JSONEdit from "@/views/ApplicationDashboard/Components/Content/ApplicationJSONEdit.vue";

export default {
  name: "ApplicationDashboardWrapper",
  components: {
    MyApplications,
    ApplicationSearchprofileList,
    ApplicationMeta,
    AccessSettings,
    JSONEdit,
    APISettings,
    BreadCrumpsComponent
  },
  data() {
    return {
      applicationId: ""
    };
  },
  computed: {
    isApplicationSelected() {
      return this.applicationId != "";
    },

    isCreator(){
      return  this.applicationCreator == this.userData.userId;
    },

    ...mapState({
      applicationCreator: (state) => state.currentApplication.creatorId,
      userData: (state) => state.userData,
    })
  },
  watch: {
    $route() {
      if (this.$route.params.application) {
        this.applicationId = this.$route.params.application;
      } else this.applicationId = "";
    }
  },
  mounted() {
    if (this.$route.params.application) {
      this.applicationId = this.$route.params.application;
    }
  }
};
</script>

<style lang="scss">
.dashboard {
  &_wrapper {
    position: relative;
    display: grid;
    padding: 10px;

    &_applicationOverview {
      grid-auto-columns: minmax(0, 1fr);
      grid-auto-rows: minmax(0, 1fr);

      &_userOwner {
        grid-template-areas:
        "md as sp"
        "je ap sp";
      }
       &_userNotOwner {

        grid-template-areas:
        "md as sp"
        "je je sp";
       }

      & > div {
        min-height: 0;
        min-width: 0;
      }

      &_meta {
        grid-area: md;
      }
      &_accessSetting {
        grid-area: as;
      }
      &_searchprofiles {
        grid-area: sp;
        min-height: calc(200% - 20px);
      }
      &_jsonEdit {
        grid-area: je;
      }
      &_apiSettings {
        grid-area: ap;
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .dashboard {
    &_wrapper {
      display: flex;
      flex-direction: column;
      overflow-x: scroll;
      overflow-y: scroll;
    }
  }
}
</style>
