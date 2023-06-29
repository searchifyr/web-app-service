<template>
  <div class="userSetting_wrapper">
    <div class="userSetting_meta">
      <div class="userSetting_meta_text underlined">
        <p>ID:</p>
        <p>{{ userData.userId }}</p>
      </div>
      <div class="userSetting_meta_text underlined">
        <p>Name:</p>
        <p>{{ userData.userName }}</p>
      </div>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import api from "@/apiService.js";

import { mapState } from "vuex";

export default {
  name: "UserComponent",
  computed: {
    ...mapState({
      userData: (state) => state.userData,
    }),
  },
  methods: {
    logout() {
      api.post("logout");
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss">
.userSetting {
  &_meta {
    margin: 0 75px 0 15px;
    font-size: 0.8rem;
    text-align: left;

    &_text {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      color: $text_grey;

      p {
        margin: 5px 0;
      }
    }

    button {
      width: 100%;
      margin: 12px 0;
    }
  }
}
</style>
