<template>
    <ModularJson :json="sampleSearchData" />
</template>

<script>
import { mapState } from "vuex";

import ModularJson from "@/components/ModularJson.vue";

export default {
  name: "SampleSearchTree",
  components: {
    ModularJson,
  },
  computed: {
    sampleSearchData() {
      if (this.sampleSearch.status == "success") {
        return JSON.parse(JSON.stringify(this.sampleSearch.data));
      } else return {};
    },
    ...mapState({
      sampleSearch: (state) => state.sampleSearch,
    }),
  },
};
</script>
