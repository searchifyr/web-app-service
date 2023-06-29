<template>
  <SearchTypes v-if="settingId == 0" />
  <SearchFields v-else-if="settingId == 1" />
  <Threshold v-else-if="settingId == 2" />
</template>

<script>
import { mapState } from "vuex";
import SearchFields from "./SearchprofileSettings/SearchFields.vue";
import SearchTypes from "./SearchprofileSettings/SearchTypes.vue";
import Threshold from "./SearchprofileSettings/Threshold.vue";

export default {
  name: "SettingsWrapper",
  components: {
    SearchFields,
    SearchTypes,
    Threshold,
  },
  computed: {
    ...mapState({
      settingId: (state) => state.settingId,
    }),
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

    &:hover {
      border: 2px $linerider_grey;
      border-style: none none solid none;
    }

    &_wrapper {
      overflow: scroll;
    }

    p {
      margin: 5px 0px 2px 0px;
      height: 100%;
      width: calc(100% - 125px);
    }
    input {
      width: 40px;
      height: 19px;
      margin-right: 10px;
    }
  }
}
</style>
