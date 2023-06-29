<template>
  <CreateComponent v-if="applicationId != ''" @click="toggleCreate" :text="textForCreateComponent" />
  <GridContentComponent @click="$store.commit('setDashboardApplicationFocus', false)" class="applicationSearchprofileList_wrapper">
    <div v-if="currentApplication?.active" class="applicationSearchprofileList_content">
      <div v-if="tableData.body.length > 0">
        <TableComponent v-if="!isCreateMode && applicationId != ''" :data="tableData" @onElementClick="onElementClick">
          <template #Delete="{ onclick }">
            <DeleteIcon @click.capture="onclick" />
          </template>
          <template #Edit="{ onclick }">
            <EditIcon @click.capture="onclick" />
          </template>
        </TableComponent>
      </div>
      <div v-else-if="!isCreateMode && !isEditMode">
        <h3>No Searchprofiles created</h3>
        <p>Click on "Create" to create a Searchprofile for this Application</p>
      </div>

      <CreateContentComponent v-if="isCreateMode && applicationId != ''" :titel="'Create Searchprofile'">
        <div class="metaTable_fixedData_wrapper">
          <div class="metaTable_fixedData">
            <span class="metaTable_fixedData_title">
              <p>Search profile Name:</p>
            </span>
            <InputComponent :text="'Name'" @input="toCreateName = $event.target.value" />
          </div>
        </div>
        <button @click="createSearchprofile">Create Searchprofile</button>
      </CreateContentComponent>
    </div>
    <div v-else-if="applicationId != ''">
      <h3>This Application has no documents uploaded</h3>
      <p>Please go in the Application setting and upload a JSON File</p>
    </div>
  </GridContentComponent>
</template>

<script>
import api from "@/apiService.js";
import { mapState, mapActions } from "vuex";

import GridContentComponent from "@/components/GridContentComponent.vue";
import CreateComponent from "@/components/Input/CreateComponent.vue";
import CreateContentComponent from "@/components/CreateContentComponent.vue";
import TableComponent from "@/components/TableComponent.vue";
import InputComponent from "@/components/Input/InputComponent.vue";
import DeleteIcon from "@/assets/Icons/DeleteIcon.vue";
import EditIcon from "@/assets/Icons/EditIcon.vue";

export default {
  name: "ApplicationSearchprofileList",
  components: {
    GridContentComponent,
    CreateComponent,
    TableComponent,
    CreateContentComponent,
    InputComponent,
    DeleteIcon,
    EditIcon,
  },
  props: {
    name: { type: String, required: true },
  },
  data() {
    return {
      isCreateMode: false,
      isEditMode: false,
      toCreateName: "",
      toCreateIsPublic: false,
      toCreateCreatorId: "",
      applicationId: "",
      profileId: "",
      showConfirmScreenForRemove: false,
    };
  },
  computed: {
    textForCreateComponent() {
      if (this.isCreateMode) return "Show List";
      else return "Create";
    },
    content() {
      return ["Create Searchprofile", "CreatorId"];
    },
    tableData() {
      let header = [];

      header = [{ name: "Name", isFilterable: true, key: "name" }];

      return {
        header: header,
        body: this.searchprofiles,
      };
    },
    ...mapState({
      applicationData: (state) => state.applicationData,
      currentApplication: (state) => state.currentApplication,
      searchprofiles: (state) => state.searchProfilesData,
    }),
  },
  watch: {
    "$route.params.application": {
      handler: function (search) {
        if (search != undefined) {
          this.applicationId = search;
          this.fetchSearchprofiles(this.applicationId);
        }
      },
      deep: true,
      immediate: true,
    },
    $route() {
      if (this.$route.params.application) this.applicationId = this.$route.params.application;
      else this.applicationId = "";
    },
  },
  methods: {
    onElementClick({ row, column }) {
      const searchprofiles = this.searchprofiles[row];
      this.profileId = searchprofiles.profileId;
      switch (true) {
        case column < 2:
          this.$router.push({
            name: "searchprofile",
            params: { searchprofile: this.profileId },
          });
          break;
        case column === 2:
          this.showConfirmScreenForRemove = true;
          break;
        case column === 3:
          {
            this.isCreateMode = true;
            this.isEditMode = true;
            this.toCreateName = searchprofiles.name;
            this.toCreateCreatorId = searchprofiles.creatorId;
          }
          break;
      }
    },
    toggleCreate() {
      this.isCreateMode = !this.isCreateMode;
      this.isEditMode = false;
      this.toCreateName = "";
      this.toCreateCreatorId = "";
    },
    async createSearchprofile() {
      await api.post("api/v1/searchprofiles", {
        name: this.toCreateName,
        creatorId: this.toCreateCreatorId,
        lastEditorId: this.toCreateCreatorId,
        applicationId: this.applicationId,
        analyser: {
          faultTolerant: this.toCreateIsPublic,
        },
      });
      this.isCreateMode = false;
      this.fetchSearchprofiles(this.currentApplication.id);
    },
    ...mapActions({
      fetchSearchprofiles: "fetchSearchprofiles",
    }),
  },
};
</script>

<style lang="scss">
.applicationSearchprofileList {
  &_wrapper {
    height: calc(200% - 20px);
  }
  &_content {
    height: 100%;
    overflow: scroll;
  }
}
</style>
