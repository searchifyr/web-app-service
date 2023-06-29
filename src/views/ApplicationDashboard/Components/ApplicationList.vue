<template>
  <CreateComponent v-if="this.applicationFilterMode === 'OWN'" @click="toggleCreate" :text="textForCreateComponent" />
  <GridContentComponent :name="isCreateMode ? 'Create Application' : name">
    <TableComponent :data="tableData" :isActive="highligtRow" @onElementClick="onElementClick" @onCreateClick="createApplication" />
  </GridContentComponent>
  <ApiKeyResponse v-if="showApiPlainText">
    <p>{{ apiKey }}</p>
    <button @click="ctc(apiKey)">Copy</button>
    <button @click="showApiPlainText = false">Ok</button>
  </ApiKeyResponse>
</template>

<script>
import api from "@/apiService.js";
import dates from "@/helper/dates";
import GridContentComponent from "@/components/GridContentComponent.vue";
import CreateComponent from "@/components/Input/CreateComponent.vue";
import TableComponent from "@/components/TableComponent.vue";
import ApiKeyResponse from "@/components/ApiKeyResponse.vue";

import { mapState, mapActions } from "vuex";

export default {
  name: "ApplicationList",
  components: {
    GridContentComponent,
    CreateComponent,
    TableComponent,
    ApiKeyResponse,
  },
  props: {
    name: { type: String, required: true },
  },
  data() {
    return {
      isCreateMode: false,
      applicationId: "",
      toCreateIsPublic: false,
      isWaitForCreateResponse: false,
      showApiPlainText: false,
      apiKey: "",
    };
  },
  computed: {
    textForCreateComponent() {
      if (this.isCreateMode) return "Show List";
      else return "Create";
    },
    tableData() {
      let body = [];
      let header = [];

      let applications = [...this.scopedTableData];

      applications.forEach((elm) => {
        let copy = { ...elm };
        copy.createdDate = dates.dateToDDMMYYYYHHMM(copy.createdDate);

        if (copy.active) body.push(copy);
        else {
          copy.name = copy.name + " ❌";
          body.push(copy);
        }
      });

      if (this.isCreateMode)
        header = [
          { name: "Create New Application", isFilterable: false, key: "name" },
          { name: "", isFilterable: false, key: "createdDate" },
        ];
      else
        header = [
          { name: "Name", isFilterable: true, key: "name" },
          { name: "Last Modified Date", isFilterable: true, key: "createdDate" },
        ];

      return {
        header: header,
        body: body,
        misc: { hasInput: this.isCreateMode },
      };
    },
    scopedTableData() {
      let applications = [...this.applicationData];

      if (!this.isGlobal) applications = applications.filter((item) => item.creatorId === this.userData.userId);
      else applications = applications.filter((item) => item.creatorId != this.userData.userId);

      return applications;
    },
    highligtRow() {
      return this.scopedTableData.findIndex((item) => item.id === this.$route.params.application);
    },
    ...mapState({
      userData: (state) => state.userData,
      isGlobal: (state) => state.isGlobal,
      applicationData: (state) => state.applicationData,
    }),
    /** @returns {"OTHER" | "OWN"} */
    applicationFilterMode() {
      return this.$store.state.isGlobal ? "OTHER" : "OWN";
    },
  },
  watch: {
    $route() {
      if (this.$route.params.application) {
        this.applicationId = this.$route.params.application;
        this.fetchApplication();
        this.$store.commit("setCurrentApplication", {});
      } else this.applicationId = "";
    },
    applicationFilterMode() {
      this.fetchApplications();
    },
  },
  methods: {
    onElementClick({ row, column, data }) {
      const application = this.scopedTableData[row];
      this.applicationId = application.id;

      this.applicationId = application.id;
      switch (true) {
        case column < 2:
          this.$router.push({ name: "dashboard", params: { application: data.id } });
          break;
        case column === 2:
          {
            this.showConfirmScreenForRemove = true;
          }
          break;
      }
    },
    toggleCreate() {
      this.isCreateMode = !this.isCreateMode;
    },
    ctc(value) {
      navigator.clipboard.writeText(value);
    },
    async fetchApplication() {
      if (this.$route.params.application != "" && this.$route.params.application != undefined) {
        const request = await api.get(`api/v1/applications/${this.$route.params.application}`);
        this.$store.commit("setCurrentApplication", request);
      }
    },
    async createApplication(e) {
      if (!this.isWaitForCreateResponse) {
        this.isWaitForCreateResponse = true;
        const request = await api.post("api/v1/applications", e);
        this.applications = request;
        this.isCreateMode = false;
        this.$nextTick(() => {
          this.fetchApplications();
          this.isWaitForCreateResponse = false;
        });
        this.apiKey = request.clearTextApiKey;
        this.showApiPlainText = true;
      }
    },
    ...mapActions({
      fetchApplications: "fetchApplications",
    }),
  },
  mounted() {
    this.fetchApplications();
    this.fetchApplication();
    this.$store.commit("setCurrentApplication", {});
  },
};
</script>

<style lang="scss">
.application {
  &_create {
    max-width: 500px;

    &_inputtoggle {
      max-width: 40px;
      margin-bottom: 20px;
    }
  }
}
</style>
