<template>
  <BreadCrumpsComponent />
  <div class="overview_wrapper content-layout">
    <div class="overview_metadata">
      <GridContentComponent :name="'Search Profile'">
        <Meta :profile="profile" />
      </GridContentComponent>
    </div>
    <div class="overview_valuedata">
      <GridContentComponent :name="'Values'">
        <SettingsWrapper :profile="profile" />
      </GridContentComponent>
    </div>
    <div class="overview_quickSetting" ref="setting">
      <GridContentComponent :name="'Settings'">
        <MenuSelection />
      </GridContentComponent>
      <!--  <SelectionLine v-if="lines['searchprofile_table']" :postion="{ left: `calc(${(2 / 7) * 100}% - 10px)`, height: lineYPos, top: '18px' }" />-->
    </div>
    <div class="overview_sampleSearch overview_content">
      <GridContentComponent :name="'Sample Search'">
        <SampleSearch />
      </GridContentComponent>
    </div>
    <Transition name="popup-right">
      <PopUp v-if="isSampleSearchOpen" pos="top: 10px; right: 10px;" bounds="height: calc(100% - 20px); width: 500px;">
        <SampleSearchTree />
      </PopUp>
    </Transition>
  </div>
</template>

<script>
import api from "@/apiService.js";
import { mapState, mapActions } from "vuex";
import BreadCrumpsComponent from "@/components/BreadCrumps/BreadCrumpsComponent.vue";
import GridContentComponent from "@/components/GridContentComponent.vue";
import Meta from "@/views/SearchProfileDashboard/Components/Content/SearchprofileMeta.vue";
import SampleSearch from "@/views/SearchProfileDashboard/Components/Content/SampleSearch.vue";
import SettingsWrapper from "@/views/SearchProfileDashboard/Components/Content/SearchprofileSettingsWrapper.vue";
import SampleSearchTree from "@/components/SampleSearchTree.vue";
import PopUp from "@/components/PopUp.vue";
import MenuSelection from "./Content/SearchprofileSettings/MenuSelection.vue";
// import SelectionLine from "@/components/SelectionLine.vue";

export default {
  name: "SearchProfileWrapper",
  components: {
    GridContentComponent,
    Meta,
    SampleSearch,
    SettingsWrapper,
    PopUp,
    SampleSearchTree,
    MenuSelection,
    // SelectionLine,
    BreadCrumpsComponent,
  },
  data() {
    return {
      profileId: "",
      profile: {},
    };
  },
  computed: {
    lineYPos() {
      return this.lines["searchprofile_table"];
    },
    ...mapState({
      isSampleSearchOpen: (state) => state.isSampleSearchOpen,
      previousSearchprofiles: (state) => state.previousSearchprofiles,
      lines: (state) => state.lines,
    }),
  },
  methods: {
    async setSP() {
      this.profileId = this.$route.params.searchprofile;
      let response;

      if (this.profileId) response = await api.get(`api/v1/searchprofiles/${this.profileId}`);

      this.profile = response;
      this.$store.commit("setProfile", response)
      this.profileId = this.$route.params.searchprofile;
      const reducedSearchprofile = { name: response.name, profileId: response.profileId };
      this.$store.commit("addPreviousSearchprofiles", reducedSearchprofile);
    },
    ...mapActions({
      fetchcurrentApplication: "fetchcurrentApplication",
    }),
  },
  watch: {
    $route() {
      this.setSP();
    },
  },
  async mounted() {
    this.setSP();
    this.profileId = this.$route.params.searchprofile;
    const request = await api.get(`api/v1/searchprofiles/${this.profileId}`);
    const response = await request;
    this.profile = response;
    this.$store.commit("setProfile", this.profile);
    this.profileId = this.$route.params.searchprofile;
    this.fetchcurrentApplication(this.profile.applicationId);
  },
};
</script>

<style lang="scss">
.overview {
  &_wrapper {
    position: relative;
    display: grid;
    padding: 0 10px;
    grid-template:
      "md md vd vd ss ss ss"
      "qs qs vd vd ss ss ss"
      "qs qs vd vd ss ss ss"
      "qs qs vd vd ss ss ss";
    grid-auto-columns: minmax(0, 1fr);

    & > div {
      min-height: 200px;
      min-width: 0;
    }
  }

  &_metadata {
    grid-area: md;
    min-height: 500px;
  }

  &_valuedata {
    grid-area: vd;
  }

  &_quickSetting {
    grid-area: qs;
  }

  &_sampleSearch {
    grid-area: ss;
  }
}

@media only screen and (max-width: 768px) {
  .overview {
    &_wrapper {
      display: flex;
      flex-direction: column;
      overflow-x: scroll;
      overflow-y: scroll;
    }
  }
}
</style>
