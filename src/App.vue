<template>
  <span @click="close">
    <HeaderComponentVue :showSelection="false" />
    <router-view />
    <NotificationWrapper />
  </span>
</template>

<script>
import HeaderComponentVue from "@/components/Header/HeaderComponent.vue";
import NotificationWrapper from "@/components/Notifications/NotificationWrapper.vue";

export default {
  name: "App",
  components: {
    HeaderComponentVue,
    NotificationWrapper,
  },
  methods: {
    close() {
      this.$store.commit("closeAllPopups");
    },
  },
};
</script>

<style lang="scss">
body,
html {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

button {
  cursor: pointer;
  border: 0 solid;
  box-shadow: $darker_shadow;
  border-radius: 5px;
  font-weight: 700;
  transition: all 0.4s;

  &:hover {
    box-shadow: 0px 0px 7px 4px #7a7a7a4b;
  }
}

select {
  cursor: pointer;
  border: 0 solid;
  box-shadow: $darker_shadow;
  border-radius: 5px;
  font-weight: 700;
  transition: all 0.4s;

  &:hover {
    box-shadow: 0px 0px 7px 4px #3d3d3d9f;
  }

  &:focus {
    border-radius: 5px 5px 0 0;
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

::-webkit-scrollbar {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  transition: all 0.5s;
}

::-webkit-scrollbar-track {
  background: #eeeeee00;
}

::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: lighten($company_blue, 65);
  transition: all 0.5s;
}

::-webkit-scrollbar-thumb:hover {
  background-color: $company_blue;
}
</style>
