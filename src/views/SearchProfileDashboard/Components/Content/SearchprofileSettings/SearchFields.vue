<template>
  <div class="searchProfile_wrapper">
    <div class="searchProfile_quicksetting_wrapper">
      <InputComponent :text="'Filter'" @change="setFilter" />
      <div class="searchProfile_quicksetting" v-for="(setting, index) in filterdSearchFields" :key="index">
        <p>{{ setting.fieldName }}</p>
        <input v-if="setting.enabled" type="number" :value="setting.boost" step="0.1" min="0" @change="$event.target.value >= 0 ? (setting.boost = $event.target.value) : (setting.boost = 0)" />
        <InputToggle :toggleValue="setting.enabled" @click="toggleSettingQS(setting)" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import InputToggle from "@/components/Input/InputToggle.vue";
import InputComponent from "@/components/Input/InputComponent.vue";

export default {
  name: "SearchFields",
  components: {
    InputToggle,
    InputComponent,
  },
  data() {
    return {
      newProfile: {},
      searchFieldFilter: "",
    };
  },
  watch: {
    profile() {
      this.newProfile = this.profile;
    },
  },
  computed: {
    filterdSearchFields() {
      if (this.searchFieldFilter.length) return this.newProfile?.searchFields.filter((sf) => sf.fieldName.includes(this.searchFieldFilter));
      return this.newProfile?.searchFields;
    },
    ...mapState({
      profile: (state) => state.profile,
    }),
  },
  methods: {
    toggleSettingQS(setting) {
      setting.enabled = !setting.enabled;
    },
    setFilter(value) {
      this.searchFieldFilter = value;
    },
  },
  mounted() {
    this.newProfile = this.profile;
  },
};
</script>

<style lang="scss">
.searchProfile {
  &_wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100% - 25px);
    padding: 15px;
  }

  &_quicksetting {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding-bottom: 5px;
    margin-bottom: 5px;
    word-break: break-all;
    text-align: left;
    width: 100%;
    min-height: 22px;
    vertical-align: middle;
    transition: all 100ms ease-in-out;
    border: 2px transparent;
    border-style: none none solid none;

    &_infotext {
      display: flex;
      flex-direction: column;
    }

    &_wrapper {
      overflow: scroll;
    }

    &:hover {
      border: 2px $linerider_grey;
      border-style: none none solid none;
    }
    p {
      margin: 5px 0px 2px 0px;
      height: 100%;
      width: calc(100% - 125px);
      min-width: 100px;
    }
    input {
      width: 40px;
      height: 19px;
      margin-right: 10px;
    }
  }
}
</style>
