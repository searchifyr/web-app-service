SampleSearch.vue

<template>
  <div class="searchprofileSample">
    <div class="searchprofileSample_header">
      <InputComponent :text="'Search'" @input="searchValue = $event.target.value" />
      <button @click.stop="sampleSearch">Query</button>
    </div>
    <div class="searchprofileSample_setting_wrapper">
      <div class="searchprofileSample_setting">
        <span class="searchprofileSample_setting_content">
          <span class="searchprofileSample_setting_content_text">
            <label>Show the unfilterd JSON</label>
            <label class="searchprofileSample_setting_content_text_small">This option may overwrite other selections</label>
          </span>
          <InputToggle :toggleValue="isShowAllActive" class="searchprofileSample_setting_inputtoggle" @click="toggleAllActive" />
        </span>
        <span class="searchprofileSample_setting_content">
          <label>Show highlighted fields</label>
          <InputToggle :toggleValue="isHighlightedActive" class="searchprofileSample_setting_inputtoggle" @click="toggleHighlightedActive" />
        </span>
        <span class="searchprofileSample_setting_content underlined">
          <label>Show document fields</label>
          <InputToggle :toggleValue="isAllDocumentActive" class="searchprofileSample_setting_inputtoggle" @click="toggleAllDocumentActive" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/apiService.js";

import InputComponent from "@/components/Input/InputComponent.vue";
import InputToggle from "@/components/Input/InputToggle.vue";

export default {
  name: "SampleSearch",
  components: {
    InputComponent,
    InputToggle,
  },
  data() {
    return {
      searchValue: "",
      isHighlightedActive: true,
      isAllDocumentActive: false,
      isShowAllActive: false,
      customFilter: "",
    };
  },
  methods: {
    toggleAllActive() {
      this.isShowAllActive = !this.isShowAllActive;
      if (this.isShowAllActive) {
        this.isAllDocumentActive = false;
        this.isHighlightedActive = false;
      }
    },
    toggleHighlightedActive() {
      this.isHighlightedActive = !this.isHighlightedActive;
      if (this.isHighlightedActive) {
        this.isShowAllActive = false;
      }
    },
    toggleAllDocumentActive() {
      this.isAllDocumentActive = !this.isAllDocumentActive;
      if (this.isAllDocumentActive) {
        this.isShowAllActive = false;
      }
    },
    async sampleSearch() {
      this.$store.commit("isSampleSearchOpen", true);
      this.$store.commit("setSampleSearch", { status: "pending" });
      const request = await api.get(`api/v1/search/${this.$route.params.searchprofile}?value=${this.searchValue}`);
      if (!request.status) {
        if (this.isShowAllActive) {
          this.$store.commit("setSampleSearch", { status: "success", data: request });
          return;
        }

        let filterdData = {};
        if (this.isHighlightedActive) {
          let highlightedData = { ...request };
          highlightedData = highlightedData?.results.map((item) => item.highlight);
          filterdData.Highlighted_Data = highlightedData;
        }

        if (this.isAllDocumentActive) {
          let documentData = { ...request };
          documentData = documentData?.results.map((item) => item.document);
          filterdData.Document_Data = documentData;
        }
        this.$store.commit("setSampleSearch", { status: "success", data: filterdData });
      } else this.$store.commit("setSampleSearch", { status: "failed", data: request });
    },
  },
  mounted() {},
};
</script>

<style lang="scss">
.searchprofileSample {
  max-width: 100%;
  max-height: 100%;
  overflow: scroll;

  &_header {
    display: flex;
    margin-top: 5px;
    padding: 0 10px;
    height: 30px;
    gap: 10px;
  }

  &_setting {
    &_wrapper {
      overflow: scroll;
      display: flex;
      flex-direction: column;
      margin: 10px;
      padding: 10px;
      white-space: nowrap;
      max-width: 100%;
    }

    &_content {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding: 5px 0;

      &_text {
        display: flex;
        flex-direction: column;
        text-align: left;

        &_small {
          margin-top: 0 !important;
          font-size: 0.7rem;
          color: gray;
        }
      }
      label {
        margin-top: 0.4rem;
      }
    }
  }
}
</style>
