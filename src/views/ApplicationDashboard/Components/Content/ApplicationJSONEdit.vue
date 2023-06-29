<template>
  <GridContentComponent :name="'JSON Edit'" class="myApplications_wrapper">
    <div class="myApplications_jsonUpload">
      <h4>Upload Index JSON</h4>
      <div class="myApplications_jsonUpload_input">
        <ModularJson :json="json" :showButtons="false" />
      </div>
      <div class="myApplications_jsonUpload_input">
        <label>Drag and Drop or select a JSON File</label>
        <input type="file" accept="application/json" @change="onFileChange" />
      </div>
    </div>
    <CreateComponent v-if="Object.keys(this.json).length > 0" @click="uploadJSON" :text="'Upload JSON'" class="myApplications_wrapper_create" />
  </GridContentComponent>
</template>

<script>
import GridContentComponent from "@/components/GridContentComponent.vue";
import ModularJson from "@/components/ModularJson.vue";
import CreateComponent from "@/components/Input/CreateComponent.vue";

import api from "@/apiService.js";
import { mapState, mapActions } from "vuex";

export default {
  name: "ApplicationJSONEdit",
  components: {
    GridContentComponent,
    ModularJson,
    CreateComponent,
  },
  data() {
    return {
      json: {},
    };
  },
  computed: {
    ...mapState({
      currentApplication: (state) => state.currentApplication,
    }),
  },
  methods: {
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      let reader = new FileReader();
      reader.onload = (e) => {
        try {
          this.json = JSON.parse(e.target.result);
        } catch (error) {
          this.$store.commit("setNotification", { message: "The JSON File could not be parsed" });
        }
      };
      reader.readAsText(files[0]);
    },
    async uploadJSON() {
      if (Object.keys(this.json).length > 0) {
        const request = await api.post(`api/v1/applications/${this.currentApplication.id}/documents`, this.json);
        if (request.status === undefined || request.status < 400) {
          request.message = "The file was uploaded successfully";
        }
        this.$store.commit("setNotification", { type: "info", ...request });
        this.fetchcurrentApplication(this.currentApplication.id);
      } else {
        this.$store.commit("setNotification", { message: "The JSON File is empty" });
      }
    },
    ...mapActions({
      fetchcurrentApplication: "fetchcurrentApplication",
    }),
  },
};
</script>

<style lang="scss">
.myApplications {
  &_wrapper {
    position: relative;
    z-index: 5;

    &_create {
      z-index: 0;
      top: 0;
      height: 40px;
      overflow: hidden;
    }
  }

  &_jsonUpload {
    display: flex;
    flex-direction: column;
    text-align: left;
    height: 100%;

    &_input {
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      overflow-x: hidden;
      min-height: 45px;
      margin: 5px 0;

      input {
        width: 90%;
        height: 40px;
        border: 1px solid #ccc;
        display: inline-block;
        cursor: pointer;
      }
    }

    h4 {
      margin: 0;
    }
  }
}
</style>
